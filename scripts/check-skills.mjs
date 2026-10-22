#!/usr/bin/env node
/**
 * Checks the skills in `skills/` for what the reference validator (`agentskills validate`) does not:
 * the recommended size of SKILL.md, links that point to missing files or deeper than one level, and
 * frontmatter fields outside the portable set. Uses Node.js built-ins only.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, normalize, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = join(ROOT, 'skills');
const PORTABLE_FIELDS = new Set(['compatibility', 'description', 'license', 'name']);
const MAX_SKILL_LINES = 500;

const errors = [];

const markdownFiles = (dir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
		entry.isDirectory() ? markdownFiles(join(dir, entry.name)) : entry.name.endsWith('.md') ? [join(dir, entry.name)] : [],
	);

for (const name of readdirSync(SKILLS)) {
	const skillDir = join(SKILLS, name);
	const skillFile = join(skillDir, 'SKILL.md');
	if (!existsSync(skillFile)) {
		errors.push(`${name}: SKILL.md missing`);
		continue;
	}

	const skill = readFileSync(skillFile, 'utf8');
	const lines = skill.split('\n').length;
	if (lines > MAX_SKILL_LINES) {
		errors.push(`${name}/SKILL.md: ${lines} lines, keep it under ${MAX_SKILL_LINES}`);
	}
	const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
	for (const field of frontmatter.matchAll(/^([a-zA-Z-]+):/gm)) {
		if (!PORTABLE_FIELDS.has(field[1])) {
			errors.push(`${name}/SKILL.md: frontmatter field "${field[1]}" is not portable`);
		}
	}

	for (const file of markdownFiles(skillDir)) {
		const text = readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
		for (const [, target] of text.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
			if (/^[a-z]+:/i.test(target)) {
				continue;
			}
			const resolved = normalize(join(dirname(file), target));
			const label = relative(SKILLS, file);
			if (!existsSync(resolved)) {
				errors.push(`${label}: link to missing file ${target}`);
			} else if (relative(skillDir, resolved).split(sep).length > 2) {
				errors.push(`${label}: link ${target} is nested deeper than one level below the skill`);
			}
		}
	}
}

if (errors.length > 0) {
	console.error(errors.join('\n'));
	process.exitCode = 1;
} else {
	console.log('Skills OK');
}
