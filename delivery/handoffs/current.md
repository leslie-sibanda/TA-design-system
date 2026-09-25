# Current handoff: static site scaffold

## Workspace and scope

Implementation is on `feat/nextjs-scaffold`, in the worktree renamed to `.worktrees/ta-design-site` at the owner's request. The repository root and prior design history are unchanged.

The Next.js 16.3.5 / React 19.3 / Fumadocs 16.15.13 scaffold exports static pages for GitHub Pages. TypeScript 6.0.3 satisfies the installed ESLint peer requirements. Dependencies and pnpm 9.6.0 are pinned through the manifest/lockfile.

Implemented routes: homepage, component catalogue and four proposal pages, Foundations, Contributing, Pages and Styling. Search uses the generated Fumadocs static index. Pages and Styling clearly describe pending implementation. Canonical UI components, live Styling, Markdown export, registry and WebMCP remain follow-on slices; external MCP is deferred.

## Decisions and verification

- DEV-5: the requester asked for white text on orange buttons, but white on `#F57D00` is 2.69:1 and no on-brand text colour passes AA on it. The requester chose the brand hierarchy's Design 2 pattern: the design-system site's primary button is now TA Blue with a white label (8.01:1, AA) and an orange bottom-border accent. This replaces the 2026-09-23 dark-on-orange decision, so design-owner confirmation is still wanted. No accessibility exception is recorded. The TeacherActive app is out of scope and needs its own follow-up.
- The browser test server uses port 4173 because another local service occupies 3000.
- Local tests use one browser worker to reduce contention with other development processes.
- Observed failing tests before implementing path validation, export serving, homepage identity, route navigation and static search behaviour.
- Responsive tests exposed low syntax-highlight contrast caused by a changed code background, a nested unfocusable scroll area and unbroken heading overflow. Preserving the highlighter's white background, keeping one focusable code viewport and wrapping headings resolved these without suppressing axe rules.
- Latest full project-prefix check (run in CI mode with `SITE_BASE_PATH=/TA-design-system`): types, lint, 7 unit tests, build, 4 artifact contracts and 41 Chromium/mobile/Firefox browser tests pass. The earlier full root-path check passed 39 browser tests; the two subsequently added forced-colour/skip-link checks have been verified at the project prefix. CI runs the entire updated suite in both modes.
- Desktop homepage, phone homepage and phone documentation screenshots were captured; homepage screenshots were visually inspected. Keyboard focus trapping/restoration and Escape dismissal were tested automatically. No manual screen-reader review is claimed.
- WebKit libraries are missing locally. The owner explicitly chose WebKit verification in CI rather than installing system libraries. Local WebKit is not claimed to pass.
- A combined check invocation exceeded the harness timeout during machine contention; the built artifact's browser suite passed when run separately. No test failure was hidden or converted into success.

## Reproduce

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm check
```

No `SITE_BASE_PATH` is needed locally; builds, `pnpm serve:export` and browser tests default to the site root. CI sets `SITE_BASE_PATH=/TA-design-system` for the deployed GitHub Pages artifact only.

For the approved local browser scope, set `PLAYWRIGHT_PROJECTS=chromium,mobile,firefox`. CI must leave this unset and run all engines.

## Replay history

Apply the implementation commits in order on top of the design/ADR baseline:

1. `708df5a` — static scaffold, path/server tests and verification commands
2. `6ab28aa` — accessible brand tokens, homepage and navigation
3. `29076bd` — static documentation routes and searchable proposals
4. `b51b593` — responsive verification and accessible code blocks

Later commits add forced-colour/export checks and the reusable Pages pipeline. Use Git history for their hashes; do not squash if individual replay is required. These commits have not been pushed or merged into main.

## Next

The owner chose `workflow_call` reusable workflows rather than local composite actions. `.github/workflows/pages.yml` calls `verify-site.yml` and, after successful verification on main, `deploy-site.yml`. Verification runs all browser engines against root and project-path builds. Deployment reuses the checked artifact and has no checkout/build step. External action SHAs were resolved from official upstream tags, including the peeled pnpm action tag. Workflow contract tests were observed failing before each implementation, then passing.

Repository Pages settings, environment restrictions, required checks and an actual CI/deployment run require owner setup/permission and have not been performed. WebKit remains unverified until CI. Review was performed inline; no independent reviewer subagent was available in this session. Workflow contracts and YAML parsing pass, but an actual GitHub run is still required. Next product slices are canonical components, live Styling and static Markdown/WebMCP, not further scaffolding.
