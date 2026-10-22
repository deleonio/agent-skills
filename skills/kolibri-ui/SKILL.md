---
name: kolibri-ui
description: Builds accessible web UIs with Public UI – KoliBri, as web components (`<kol-*>`) or through a framework adapter (React, React Hook Form, Angular, Vue, Solid, Preact, Svelte). Maps the UI completely onto KoliBri components, verifies every API with little context through a bundled script and the KoliBri MCP server, uses public-ui.github.io for concepts and checks keyboard, focus and error handling. Use this skill whenever a page, form, dialog or component is built, changed or reviewed with KoliBri – also for "build a form with KoliBri", "contact form", "accessible UI", "BITV", "WCAG", "Public UI", "kol-button", "KolInputText", "@public-ui/react-v19", "which KoliBri component fits" or "migrate the page to KoliBri".
license: EUPL-1.2
compatibility: Node.js 18+ for scripts/kol-props.mjs; network access to the KoliBri MCP server when @public-ui/components is not installed locally.
---

# Accessible UIs with KoliBri

## Overview

KoliBri components ship accessibility built in: label, focus, ARIA, error display and keyboard. It
only survives if the UI consists **entirely of KoliBri components** and uses their API **exactly**.
Hence the workflow:

1. **Clarify the setup**: adapter or plain web components, registration → [§1](#1-setup)
2. **Map the UI**: assign every element a component → [§2](#2-map-the-ui), catalog
   [components.md](references/components.md)
3. **Verify the API**: cheap before expensive, never guess → [§3](#3-look-things-up), sources
   [sources.md](references/sources.md)
4. **Implement**: rules → [§4](#4-implement), forms [forms.md](references/forms.md)
5. **Check**: checklist and browser test → [§5](#5-check), [checklist.md](references/checklist.md)

Load a reference only when its step needs it.

## 1. Setup

Look for `@public-ui/*` in `package.json`:

- `react-v19`, `angular-v21`, `vue`, `solid`, `preact`, `svelte` → adapter components (`KolButton`, …).
  `react-hook-form-adapter` → form fields as `Kol…Controller`.
- only `components` → `<kol-…>` tags.
- nothing, or the components do not render → [setup.md](references/setup.md).

Icon fonts of the theme: copy `assets/` into the static directory and link **all** its stylesheets –
`node <skill-path>/scripts/kol-icons.mjs` prints the exact `<link>` tags for the installed version.
Missing ones show as tofu squares later ([setup.md](references/setup.md), Icons).

## 2. Map the UI

Every control, heading and message gets a component from [components.md](references/components.md);
native HTML is reserved for layout and running text (catalog, "Native HTML"). If a component is
missing, name the gap instead of rebuilding it.

## 3. Look things up

| Question                 | Source (in this order)                                       |
| ------------------------ | ------------------------------------------------------------ |
| Which component?         | [components.md](references/components.md)                    |
| Props, events, methods?  | `node scripts/kol-props.mjs <component …> [_prop …]`         |
| Pattern, sample code?    | [forms.md](references/forms.md), then MCP `search` → `fetch` |
| Concept, theming, setup? | [sources.md](references/sources.md) → public-ui.github.io    |

- Run the script **once for all** components you need; ask for details with `_prop`. The script path
  is relative to this skill's directory; run it from the project root so it reads the installed
  KoliBri version.
- MCP `search` always with `query` (ideally one term), `kind` and `limit: 5`; without `query` it
  returns the whole index.
- MCP `fetch spec/…` only if the script fails: the specs are more than ten times larger.

## 4. Implement

- Props start with `_`. No `aria-*`, `role`, `tabindex` or `class` for behavior on `kol-*`.
- Every component has a meaningful `_label`; icon-only buttons additionally `_hideLabel`.
- Required via `_required` (no `*` in the label), hints via `_hint`, errors via `_msg` + `_touched`.
- Personal-data fields get `_autoComplete` (`given-name`, `email`, `tel`, …): the default is `off`
  (WCAG 1.3.5).
- Objects and functions (`[JS]` in the script output) are properties, not HTML attributes.
- Appearance comes from the theme. Own CSS only for layout around the components.
- No deprecated components (list in [components.md](references/components.md)).

## 5. Check

Work through [checklist.md](references/checklist.md) completely: type check, lint, then keyboard and
focus in the browser. Fix findings before the work counts as done.
