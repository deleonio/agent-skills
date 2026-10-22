# Public UI – KoliBri agent skills

Agent skills for building accessible web UIs with [KoliBri](https://public-ui.github.io), the accessible
web component library of Public UI. The skills follow the open
[Agent Skills specification](https://agentskills.io/specification), so they work in every agent that
supports it: Claude Code, GitHub Copilot, VS Code, Cursor, Codex, Gemini CLI and others.

| Skill                                      | Purpose                                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------- |
| [`kolibri-ui`](skills/kolibri-ui/SKILL.md) | Build, change or review pages and forms with KoliBri components, accessible by default |

The skills get their component knowledge from the **KoliBri MCP server**
(`https://public-ui-kolibri-mcp.vercel.app/mcp`). Without it they still work: the bundled script reads
the installed `@public-ui/components` package or queries the server over plain HTTP.

## Install

### Claude Code

The repository is a plugin marketplace. The `kolibri` plugin contains the skills and configures the
MCP server.

```bash
claude plugin marketplace add public-ui/agent-skills
claude plugin install kolibri@public-ui
```

### Other agents

[`skills`](https://github.com/vercel-labs/skills) installs into the skills directory of your agent:

```bash
npx skills add public-ui/agent-skills                 # choose agent and skills interactively
npx skills add public-ui/agent-skills --skill kolibri-ui -a <agent>
```

Or copy `skills/kolibri-ui/` into the skills directory of your agent by hand.

Add the MCP server to your agent as an HTTP server named `kolibri` with the URL above. Examples for
VS Code, Claude Desktop and local stdio use are in the
[`@public-ui/mcp` README](https://github.com/public-ui/kolibri/tree/develop/packages/tools/mcp#readme).

### Agents without skill support

Add this to the `AGENTS.md` of your project, with the path where you placed the skill:

```markdown
## UI with KoliBri

Before building or changing UI with KoliBri components, read `<path>/kolibri-ui/SKILL.md` and follow it.
```

## Requirements

- Node.js 18 or later for `scripts/kol-props.mjs`.
- Network access to the MCP server when `@public-ui/components` is not installed in the project.

## Contributing

See [AGENTS.md](AGENTS.md). Validate before every commit:

```bash
pip install skills-ref==0.1.1 && agentskills validate skills/kolibri-ui
node scripts/check-skills.mjs
claude plugin validate .
```

## License

[EUPL-1.2](LICENSE)
