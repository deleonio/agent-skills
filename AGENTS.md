# Agent instructions

This repository publishes agent skills for Public UI – KoliBri. It is at the same time a Claude Code
plugin marketplace (`.claude-plugin/marketplace.json`) whose only plugin is the repository root
(`.claude-plugin/plugin.json`, `.mcp.json`, `skills/`).

## Layout

- `skills/<name>/` – one skill per directory, in the [Agent Skills format](https://agentskills.io/specification).
  This is the only copy of each skill; every distribution channel reads it from here.
- `.claude-plugin/`, `.mcp.json` – Claude Code packaging. No skill content here.
- `scripts/check-skills.mjs` – checks what the reference validator does not.

## Writing skills

- English. As short, clear and free of contradictions as possible: as much as necessary, as little as
  possible. State each fact once.
- `SKILL.md` starts with an overview of the workflow that links to its detail sections and to the
  `references/` files. Details live in `references/`, one level deep, loaded only when needed.
- Frontmatter only uses `name`, `description`, `license` and `compatibility`; no experimental or
  vendor-specific fields. Nothing in the content may assume a particular agent.
- Paths are relative to the skill directory. Scripts use Node.js built-ins only and work on Windows,
  macOS and Linux.
- Component knowledge comes from the KoliBri MCP server and the installed package, not from the skill
  text. Every statement about a KoliBri API is verified against the code or a running browser.

## Checks

Run before every commit; CI runs the same:

```bash
agentskills validate skills/<name>   # pip install skills-ref==0.1.1
node scripts/check-skills.mjs
npx prettier@3.9.10 --check .
```

Bump `version` in `.claude-plugin/plugin.json` with every release; Claude Code users only receive an
update when it changes. Commit messages follow Conventional Commits.
