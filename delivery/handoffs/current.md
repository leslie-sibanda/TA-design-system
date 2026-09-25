# Current handoff: static site scaffold

## Workspace and scope

The implementation is merged into `main`. PRs [#1](https://github.com/leslie-sibanda/ta-design-system/pull/1), [#2](https://github.com/leslie-sibanda/ta-design-system/pull/2), [#3](https://github.com/leslie-sibanda/ta-design-system/pull/3) and [#4](https://github.com/leslie-sibanda/ta-design-system/pull/4) contain the scaffold, local-path correction, Pages-path correction and DEV-5 button update.

The Next.js 16.3.5 / React 19.3 / Fumadocs 16.15.13 scaffold exports static pages for GitHub Pages. TypeScript 6.0.3 satisfies the installed ESLint peer requirements. Dependencies and pnpm 9.6.0 are pinned through the manifest/lockfile.

Implemented routes: homepage, component catalogue and four proposal pages, Foundations, Contributing, Pages and Styling. Search uses the generated Fumadocs static index. Pages and Styling clearly describe pending implementation. Canonical UI components, live Styling, Markdown export, registry and WebMCP remain follow-on slices; external MCP is deferred.

## Decisions and verification

- DEV-5: the design-system site's primary button is orange with a white label, per the brand colour hierarchy. White on `#F57D00` is 2.69:1, so this is a recorded accessibility exception accepted by the requester and confirmed by the design owner on 2026-09-25 (see `docs/design/site-design-status.md`), replacing the 2026-09-23 dark-on-orange decision. Alternatives tried and rejected: a darker orange (off-brand) and a blue button (not an orange background). The TeacherActive app is out of scope and needs its own follow-up.
- The browser test server uses port 4173 because another local service occupies 3000.
- Local tests use one browser worker to reduce contention with other development processes.
- Observed failing tests before implementing path validation, export serving, homepage identity, route navigation and static search behaviour.
- Responsive tests exposed low syntax-highlight contrast caused by a changed code background, a nested unfocusable scroll area and unbroken heading overflow. Preserving the highlighter's white background, keeping one focusable code viewport and wrapping headings resolved these without suppressing axe rules.
- The latest main-branch run, [36111601605](https://github.com/leslie-sibanda/ta-design-system/actions/runs/36111601605), passed types, lint, 11 unit tests, builds and artifact contracts in both modes. Its browser checks passed 41 tests at the root and 42 at `/ta-design-system`. The root run reported one flaky mobile focus-trap test, which passed on its first retry; the project-path run passed without retries. Chromium and mobile run the full browser suite, while Firefox and WebKit run `e2e/smoke.spec.ts` only.
- Desktop homepage, phone homepage and phone documentation screenshots were captured; homepage screenshots were visually inspected. Keyboard focus trapping/restoration and Escape dismissal were tested automatically. No manual screen-reader review is claimed.
- WebKit libraries are missing locally. The owner explicitly chose WebKit verification in CI rather than installing system libraries. WebKit smoke checks passed against root and `/ta-design-system` exports in run 36111601605; local WebKit and full-suite WebKit coverage are not claimed.
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

Later commits add forced-colour/export checks and the reusable Pages pipeline. Use Git history for their hashes; do not squash if individual replay is required. The replay commits and later updates are now in `main` through PRs #1-#4.

## Next

The owner chose `workflow_call` reusable workflows rather than local composite actions. `.github/workflows/pages.yml` calls `verify-site.yml` and, after successful verification on main, `deploy-site.yml`. Verification runs all browser engines against root and project-path builds. Deployment reuses the checked artifact and has no checkout/build step. External action SHAs were resolved from official upstream tags, including the peeled pnpm action tag. Workflow contract tests were observed failing before each implementation, then passing.

GitHub Pages is configured at [the TeacherActive design-system site](https://leslie-sibanda.github.io/ta-design-system/). Main-branch runs [35993515096](https://github.com/leslie-sibanda/ta-design-system/actions/runs/35993515096) and [36111601605](https://github.com/leslie-sibanda/ta-design-system/actions/runs/36111601605) passed both verification modes and deployed to the `github-pages` environment. Branch-protection required checks and environment restrictions remain unverified. Review was performed inline; no independent reviewer subagent was available in this session. Next product slices are canonical components, live Styling and static Markdown/WebMCP, not further scaffolding.
