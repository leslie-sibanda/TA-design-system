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

Run the full verification and serve the static export. Both default to the site root, so no environment variables are needed:

```bash
pnpm check
PORT=8080 pnpm serve:export
```

Open `http://127.0.0.1:8080/`. Browser tests use a separate server on port 4173 and never reuse a running development server.

`SITE_BASE_PATH` is a deployment setting, not part of everyday local commands. The GitHub Pages project site is served at `https://leslie-sibanda.github.io/TA-design-system/`, so CI builds the deployed artifact with `SITE_BASE_PATH=/TA-design-system` (and also verifies the root build). Set it locally only to reproduce that CI configuration, and set it for both `pnpm build`/`pnpm check` and `pnpm serve:export`.

On this development machine, WebKit system libraries are unavailable. The owner chose CI-only WebKit verification. Run the explicit local scope with `PLAYWRIGHT_PROJECTS=chromium,mobile,firefox pnpm check`. CI must omit `PLAYWRIGHT_PROJECTS` and install all browser dependencies; the default check runs every configured engine.

## GitHub delivery

The small caller `.github/workflows/pages.yml` invokes two reusable workflows:

- `verify-site.yml`: frozen install, all-browser verification and static-artifact checks at both root and `/TA-design-system` paths (the only place `SITE_BASE_PATH` is set). Pull requests have read-only permissions and never upload a deployment artifact.
- `deploy-site.yml`: main-only deployment of the verified project-path artifact, without rebuilding. Only this job receives Pages and OIDC write permissions, through the `github-pages` environment.

Before the first deployment, a repository owner must choose **GitHub Actions** as the Pages source, restrict the `github-pages` environment to `main`, and make the verification jobs required checks. These settings and a real GitHub run have not been performed. Never pass `PLAYWRIGHT_PROJECTS` in CI. Official external actions are pinned to commit revisions resolved from their upstream tags; review updates before changing pins.

See the [handoff](./delivery/handoffs/current.md) for verification evidence and replayable commit history. See the [approved design and current status](./docs/design/site-design-status.md) for decisions and remaining work. The [current agent-access ADR](./docs/adr/ADR-0007-static-agent-access-without-external-mcp.md) defines initial access through WebMCP and static Markdown, with the external MCP server deferred.
