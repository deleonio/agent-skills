# Knowledge sources

## Script `kol-props.mjs`

```bash
node scripts/kol-props.mjs form input-text textarea   # several components in one call
node scripts/kol-props.mjs input-text _autoComplete    # single props, full type + description
node scripts/kol-props.mjs --list                      # all components (local package only)
```

Run it from the project root; the path is relative to the skill directory. The script reads `node_modules/@public-ui/components/doc`
(searched upwards from the working directory), otherwise the hosted MCP server.

## KoliBri MCP server

Endpoint: `https://public-ui-kolibri-mcp.vercel.app/mcp` (HTTP), locally `npx @public-ui/mcp` (stdio).

| Tool                                 | Purpose                                        |
| ------------------------------------ | ---------------------------------------------- |
| `search` (`query`, `kind`, `limit`)  | find entries; returns ID and short description |
| `fetch` (`id`)                       | content of one entry                           |
| `search_templates`, `fetch_template` | project templates (Vite, tests, configuration) |

IDs: `sample/<component>/<name>` (one component), `scenario/scenarios/<name>` (composed patterns),
`spec/<component>` (API, large), `doc/<name>` (guides).

Search is fuzzy (Fuse.js) over ID, name, group, description and tags. A component name or domain term
hits best (`input-file`, `validation`). Several words are OR-combined; without results, cut down to one
term. Each hit costs about 1 KB, hence `limit: 5`.

Proven IDs:

| ID                                           | Content                                                           |
| -------------------------------------------- | ----------------------------------------------------------------- |
| `scenario/scenarios/contact-form`            | contact form: RHF, Zod, conditions, upload, error summary, dialog |
| `scenario/scenarios/react-hook-form-adapter` | all `Kol…Controller`                                              |
| `doc/HOWTO_REGISTER_COMPONENTS_AND_THEMES`   | registration, themes, dark mode                                   |
| `doc/HOWTO_ICON_FONTS`                       | icon fonts                                                        |

Project-internal documents (`doc/arc42*`, `doc/AGENTS`, migration and breaking-change documents) do
not help when using KoliBri.

## public-ui.github.io

For concepts and getting started; fetch with a concrete question, never take over whole pages.

| Topic                | Path under https://public-ui.github.io/docs |
| -------------------- | ------------------------------------------- |
| First steps          | `/get-started/first-steps`                  |
| Frameworks, adapters | `/get-started/frameworks`                   |
| React Hook Form      | `/get-started/react-hook-form`              |
| Component            | `/components/<name>`                        |
| Expert slot          | `/concepts/expert-slot`                     |
