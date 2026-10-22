# Setup

## Packages

- `@public-ui/components` and at least one theme: `@public-ui/theme-default` (more: `theme-bwst`,
  `theme-desy`, `theme-ecl`, `theme-kern`).
- Adapter per framework: `react-v19`, `react-hook-form-adapter`, `angular-v21`, `vue`, `solid`,
  `preact`, `svelte`; SSR: `hydrate`.
- All `@public-ui/*` packages in exactly the same version; check the current major before
  installing (`npm view @public-ui/components version`).
- Resolve subpath imports against the installed version's `exports` map: v4 maps
  `@public-ui/components/loader`; older majors only resolve `./dist/loader`.

## Register – once, before the first render

```ts
import { register } from '@public-ui/components';
import { defineCustomElements } from '@public-ui/components/loader';
import { DEFAULT } from '@public-ui/theme-default';

await register(DEFAULT, defineCustomElements);
```

Without a bundler, use the same imports from `https://unpkg.com/@public-ui/...` in a
`<script type="module">`. Several themes: `register([DEFAULT, ECL], …)`, switch via the `kol-theme`
attribute.

Top-level `await register(…)` needs an ES2022 build target (Vite: `build.target: 'es2022'`);
a default target such as es2020 fails the build. Alternatively, bootstrap inside an async function.

## Icons

The components use icon fonts for their built-in icons (close buttons, drop-down arrows). The
themes ship the fonts under `assets/` – several CSS files (`kolicons`, `codicons`, fontawesome,
…), and the set **changes between theme versions**. A CSS import from `@public-ui/components`
fails, the package exports no assets. Copy the directory into your static directory, then derive
the `<link>` tags from the installed theme instead of a memorized list – a forgotten stylesheet
shows up later as empty squares (tofu) instead of icons:

```bash
cp -R node_modules/@public-ui/theme-default/assets public/assets
node <path-to-this-skill>/scripts/kol-icons.mjs   # prints one <link> per stylesheet
```

**Never link only `codicon.css` + `fontawesome`**: theme-default ≥ 4.5 renders its own
error/drop-down icons through the `kolicons` font, whose `@font-face` lives in
`assets/kolicons/style.css`.

In the dev server, linking into the package directory also works
(`/node_modules/@public-ui/theme-default/assets/…`), as the official templates do.

## Light/dark

The application sets `:root { color-scheme: light dark; }`, the components follow. Do not let a
minifier targeting old browsers rewrite `light-dark()` in the app CSS.

## New project

`npx degit public-ui/templates/csr/react-vite my-app`; more templates via MCP `search_templates`.

## Symptoms

| Symptom                       | Cause                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `<kol-…>` shows as plain text | `register` missing or not awaited                                               |
| Components without styling    | no theme passed to `register`                                                   |
| "already defined" error       | `register` called more than once                                                |
| Icons missing / tofu squares  | an icon stylesheet is not linked – derive the list with `scripts/kol-icons.mjs` |
