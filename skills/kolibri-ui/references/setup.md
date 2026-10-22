# Setup

## Packages

- `@public-ui/components` and at least one theme: `@public-ui/theme-default` (more: `theme-bwst`,
  `theme-desy`, `theme-ecl`, `theme-kern`).
- Adapter per framework: `react-v19`, `react-hook-form-adapter`, `angular-v21`, `vue`, `solid`,
  `preact`, `svelte`; SSR: `hydrate`.
- All `@public-ui/*` packages in exactly the same version.

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

## Icons

```ts
import '@public-ui/components/assets/kolicons/style.css';
```

## Light/dark

The application sets `:root { color-scheme: light dark; }`, the components follow. Do not let a
minifier targeting old browsers rewrite `light-dark()` in the app CSS.

## New project

`npx degit public-ui/templates/csr/react-vite my-app`; more templates via MCP `search_templates`.

## Symptoms

| Symptom                       | Cause                             |
| ----------------------------- | --------------------------------- |
| `<kol-…>` shows as plain text | `register` missing or not awaited |
| Components without styling    | no theme passed to `register`     |
| "already defined" error       | `register` called more than once  |
| Icons missing                 | icon CSS not imported             |
