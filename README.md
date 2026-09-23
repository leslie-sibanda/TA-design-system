# TeacherActive Design System

Shared accessible components, application themes, documentation, registry distribution, and agent interfaces for TeacherActive products.

Start with:

- [Design-system plan](./docs/agent-ready-design-system-plan.md)
- [Documentation index](./docs/README.md)
- [Agent instructions](./AGENTS.md)

The visual direction is approved and demonstrated in a local HTML prototype. The Next.js/Fumadocs static scaffold is in progress. Shared components and agent services are not implemented yet.

## Development

Use Node.js 22.22.1 or later in the Node 22 line and pnpm 9.6.0.

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm dev
```

Run the same static-export checks used for the GitHub Pages project path:

```bash
SITE_BASE_PATH=/TA-design-system pnpm check
SITE_BASE_PATH=/TA-design-system PORT=8080 pnpm serve:export
```

Open `http://127.0.0.1:8080/TA-design-system/`. For root-path development, omit `SITE_BASE_PATH` when both building and serving. Browser tests use a separate server on port 4173 and never reuse a running development server.

See the [approved design and current status](./docs/design/site-design-status.md) for decisions, remaining work and the unresolved button contrast issue. The [current agent-access ADR](./docs/adr/ADR-0007-static-agent-access-without-external-mcp.md) defines initial access through WebMCP and static Markdown, with the external MCP server deferred.
