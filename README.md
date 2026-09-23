# TeacherActive Design System

Shared accessible components, application themes, documentation, registry distribution, and agent interfaces for TeacherActive products.

Start with:

- [Design-system plan](./docs/agent-ready-design-system-plan.md)
- [Documentation index](./docs/README.md)
- [Agent instructions](./AGENTS.md)

The approved visual direction is implemented as a Next.js/Fumadocs static documentation scaffold. Shared components, working Styling controls, Markdown export and WebMCP are not implemented yet.

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

On this development machine, WebKit system libraries are unavailable. The owner chose CI-only WebKit verification. Run the explicit local scope with `SITE_BASE_PATH=/TA-design-system PLAYWRIGHT_PROJECTS=chromium,mobile,firefox pnpm check`. CI must omit `PLAYWRIGHT_PROJECTS` and install all browser dependencies; the default check runs every configured engine.

## GitHub delivery

The small caller `.github/workflows/pages.yml` invokes two reusable workflows:

- `verify-site.yml`: frozen install, all-browser verification and static-artifact checks at both root and `/TA-design-system` paths. Pull requests have read-only permissions and never upload a deployment artifact.
- `deploy-site.yml`: main-only deployment of the verified project-path artifact, without rebuilding. Only this job receives Pages and OIDC write permissions, through the `github-pages` environment.

Before the first deployment, a repository owner must choose **GitHub Actions** as the Pages source, restrict the `github-pages` environment to `main`, and make the verification jobs required checks. These settings and a real GitHub run have not been performed. Never pass `PLAYWRIGHT_PROJECTS` in CI. Official external actions are pinned to commit revisions resolved from their upstream tags; review updates before changing pins.

See the [handoff](./delivery/handoffs/current.md) for verification evidence and replayable commit history. See the [approved design and current status](./docs/design/site-design-status.md) for decisions and remaining work. The [current agent-access ADR](./docs/adr/ADR-0007-static-agent-access-without-external-mcp.md) defines initial access through WebMCP and static Markdown, with the external MCP server deferred.
