#!/usr/bin/env node
/**
 * Prints the <link> tags for the icon stylesheets of one or more KoliBri themes.
 *
 * Themes ship their icon fonts (kolicons, codicons, fontawesome, …) as CSS files under assets/.
 * The set of files changes between theme versions – derive the links from the installed package
 * instead of a memorized list.
 *
 * Run from the project root (reads node_modules there):
 *   node <path-to-this-skill>/scripts/kol-icons.mjs [theme-default theme-bwst …]
 *
 * Without arguments: theme-default.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const themes = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ['theme-default'];
let failed = false;

async function listCssFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const path = join(directory, entry.name);
			return entry.isDirectory() ? listCssFiles(path) : Promise.resolve(entry.name.endsWith('.css') ? [path] : []);
		}),
	);
	return files.flat();
}

for (const theme of themes) {
	const assetsDir = join('node_modules', '@public-ui', theme, 'assets');
	try {
		await readFile(join(assetsDir, '..', 'package.json'));
	} catch {
		console.error(`Nicht gefunden: ${assetsDir} – läuft das Skript aus dem Projektroot und ist "${theme}" installiert?`);
		failed = true;
		continue;
	}
	const cssFiles = (await listCssFiles(assetsDir)).sort();
	// Link only the minified variant of a style.css / style.min.css pair
	const deduped = cssFiles.filter((file) => !(file.endsWith('.css') && cssFiles.includes(`${file.slice(0, -4)}.min.css`)));
	console.log(`<!-- ${theme}: ${deduped.length} Stylesheet(s) -->`);
	for (const file of deduped) {
		const relativePath = relative(assetsDir, file).split(sep).join('/');
		console.log(`<link rel="stylesheet" href="/assets/${relativePath}" />`);
	}
}

process.exit(failed ? 1 : 0);
