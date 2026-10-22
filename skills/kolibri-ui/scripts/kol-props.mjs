#!/usr/bin/env node
/**
 * Prints the API of KoliBri components as compact text instead of the padded Markdown tables of the
 * generated docs (about a tenth of the tokens).
 *
 * Usage:
 *   node kol-props.mjs <component …>          props (type, default), events, methods, slots
 *   node kol-props.mjs <component> _prop …    only these props, with description
 *   node kol-props.mjs --list                 all components (local package only)
 *
 * <component> accepts `input-text`, `kol-input-text` or `KolInputText`. With several components, props
 * they all share are printed once.
 *
 * Long types are shortened; asking for the prop prints it in full.
 *
 * Source: the installed package (`node_modules/@public-ui/components/doc`, searched upwards from the
 * working directory), the KoliBri monorepo (`packages/components/doc`), otherwise the hosted MCP server.
 * Uses Node.js built-ins only.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const MCP_URL = process.env.KOLIBRI_MCP_URL ?? 'https://public-ui-kolibri-mcp.vercel.app/mcp';
const MAX_TYPE_LENGTH = 120;

const toSlug = (name) =>
	name
		.replace(/^kol-/i, '')
		.replace(/^Kol(?=[A-Z])/, '')
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.toLowerCase();

function findDocDir() {
	for (let dir = resolve(process.cwd()); ; dir = dirname(dir)) {
		for (const candidate of [join(dir, 'node_modules', '@public-ui', 'components', 'doc'), join(dir, 'packages', 'components', 'doc')]) {
			if (existsSync(candidate)) {
				return candidate;
			}
		}
		if (dirname(dir) === dir) {
			return undefined;
		}
	}
}

async function load(slug, docDir) {
	const file = docDir && join(docDir, `${slug}.md`);
	if (file && existsSync(file)) {
		return { markdown: readFileSync(file, 'utf8'), source: 'local' };
	}
	const response = await fetch(MCP_URL, {
		method: 'POST',
		headers: { Accept: 'application/json, text/event-stream', 'Content-Type': 'application/json' },
		body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'fetch', arguments: { id: `spec/${slug}` } } }),
	});
	const payload = await response.json();
	const text = payload?.result?.content?.[0]?.text;
	if (!text || payload.result.isError) {
		throw new Error(`no spec for "${slug}"`);
	}
	return { markdown: text, source: 'MCP' };
}

/** Splits a Markdown table row at unescaped pipes; `\|` inside type unions stays part of the cell. */
const splitRow = (row) =>
	row
		.trim()
		.replace(/^\||\|$/g, '')
		.split(/(?<!\\)\|/)
		.map((cell) => cell.trim().replace(/\\\|/g, '|').replace(/`/g, ''));

function section(markdown, heading) {
	const start = markdown.indexOf(`\n## ${heading}\n`);
	if (start < 0) {
		return '';
	}
	const rest = markdown.slice(start + heading.length + 5);
	const end = rest.search(/\n## /);
	return end < 0 ? rest : rest.slice(0, end);
}

const tableRows = (text) =>
	text
		.split('\n')
		.filter((line) => line.startsWith('|') && !/^\|\s*-/.test(line))
		.slice(1)
		.map(splitRow);

function parse(markdown) {
	const props = tableRows(section(markdown, 'Properties')).map(([name, attribute, description, type, defaultValue]) => {
		const required = name.includes('(required)') ? '*' : '';
		const jsOnly = attribute === '--' ? ' [JS]' : '';
		const def = defaultValue && defaultValue !== 'undefined' ? ` = ${defaultValue}` : '';
		// Every optional prop accepts `undefined`; repeating it in each union only costs tokens.
		const compactType = type.replace(/ \| undefined\b/g, '').replace(/\bundefined \| /g, '');
		const shortType = compactType.length > MAX_TYPE_LENGTH ? `${compactType.slice(0, MAX_TYPE_LENGTH)}… (full type: pass the prop name)` : compactType;
		const prop = name.replace(/\s*_?\(required\)_?/, '');
		return { name: prop, line: `${prop}${required}${jsOnly}: ${shortType}${def}`, fullLine: `${prop}${required}${jsOnly}: ${compactType}${def}`, description };
	});
	return {
		overview: section(markdown, 'Overview').trim().split('\n')[0].replace(/\*\*/g, ''),
		props,
		events: tableRows(section(markdown, 'Events')).map(([name]) => name),
		methods: [...section(markdown, 'Methods').matchAll(/^### `?(\w+)\(/gm)].map((match) => match[1]),
		slots: tableRows(section(markdown, 'Slots')).map(([name]) => name || '(default)'),
	};
}

async function main() {
	const args = process.argv.slice(2);
	const docDir = findDocDir();

	if (args[0] === '--list') {
		console.log(
			docDir
				? readdirSync(docDir)
						.filter((file) => file.endsWith('.md') && !file.startsWith('_'))
						.map((file) => file.slice(0, -3))
						.join(' ')
				: 'No local @public-ui/components found: use the MCP tool `search` with kind "spec".',
		);
		return;
	}

	const components = args.filter((arg) => !arg.startsWith('_'));
	const wanted = args.filter((arg) => arg.startsWith('_'));
	if (components.length === 0) {
		console.log('Usage: node kol-props.mjs <component …> [_prop …] | --list');
		process.exitCode = 1;
		return;
	}

	const specs = [];
	for (const component of components) {
		const slug = toSlug(component);
		try {
			specs.push({ slug, ...(await load(slug, docDir)) });
		} catch (error) {
			console.log(`kol-${slug}: ${error.message}. Fall back to the MCP tool \`fetch\` with id "spec/${slug}".`);
			process.exitCode = 1;
		}
	}

	const parsed = specs.map((spec) => ({ ...spec, ...parse(spec.markdown) }));
	// Form fields (components with `_msg`) share most of their props; print those once.
	const fields = parsed.filter((spec) => spec.props.some((prop) => prop.name === '_msg'));
	const shared =
		fields.length > 1 && wanted.length === 0
			? fields[0].props.map((prop) => prop.line).filter((line) => fields.every((spec) => spec.props.some((prop) => prop.line === line)))
			: [];
	console.log('Legend: * required, [JS] = set as JS property, not as HTML attribute');
	if (shared.length > 0) {
		console.log(`Shared by the form fields ${fields.map((spec) => spec.slug).join(', ')}:\n  ${shared.join('\n  ')}`);
	}

	for (const spec of parsed) {
		console.log(`kol-${spec.slug} (${spec.source})${spec.overview ? ` — ${spec.overview}` : ''}`);
		const props = wanted.length > 0 ? spec.props.filter((prop) => wanted.some((w) => prop.name.startsWith(w))) : spec.props;
		for (const prop of props.filter((p) => !shared.includes(p.line))) {
			console.log(wanted.length > 0 ? `  ${prop.fullLine}\n      ${prop.description}` : `  ${prop.line}`);
		}
		if (wanted.length === 0) {
			for (const [label, list] of [
				['events', spec.events],
				['methods', spec.methods],
				['slots', spec.slots],
			]) {
				if (list.length > 0) {
					console.log(`  ${label}: ${list.join('; ')}`);
				}
			}
		}
	}
}

await main();
