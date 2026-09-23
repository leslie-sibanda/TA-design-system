# Current handoff: static site scaffold

## Workspace and scope

Implementation is on `feat/nextjs-scaffold`, in the worktree renamed to `.worktrees/ta-design-site` at the owner's request. The repository root and prior design history are unchanged.

The Next.js 16.3.5 / React 19.3 / Fumadocs 16.15.13 scaffold exports static pages for GitHub Pages. TypeScript 6.0.3 satisfies the installed ESLint peer requirements. Dependencies and pnpm 9.6.0 are pinned through the manifest/lockfile.

Implemented routes: homepage, component catalogue and four proposal pages, Foundations, Contributing, Pages and Styling. Search uses the generated Fumadocs static index. Pages and Styling clearly describe pending implementation. Canonical UI components, live Styling, Markdown export, registry and WebMCP remain follow-on slices; external MCP is deferred.

## Decisions and verification

- The owner approved dark `#182B3A` text on the original `#F57D00` orange for the app. Historical previews retain the earlier white-text proposal.
- The browser test server uses port 4173 because another local service occupies 3000.
- Local tests use one browser worker to reduce contention with other development processes.
- Observed failing tests before implementing path validation, export serving, homepage identity, route navigation and static search behaviour.
- Responsive tests exposed low syntax-highlight contrast caused by a changed code background, a nested unfocusable scroll area and unbroken heading overflow. Preserving the highlighter's white background, keeping one focusable code viewport and wrapping headings resolved these without suppressing axe rules.
- Latest local verification: types, lint, 4 unit tests, build, 2 artifact contracts and 39 Chromium/mobile/Firefox browser tests pass for `/TA-design-system`.
- Desktop homepage, phone homepage and phone documentation screenshots were captured; homepage screenshots were visually inspected. Keyboard focus trapping/restoration and Escape dismissal were tested automatically. No manual screen-reader review is claimed.
- WebKit libraries are missing locally. The owner explicitly chose WebKit verification in CI rather than installing system libraries. Local WebKit is not claimed to pass.
- A combined check invocation exceeded the harness timeout during machine contention; the built artifact's browser suite passed when run separately. No test failure was hidden or converted into success.

## Reproduce

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium firefox webkit
SITE_BASE_PATH=/TA-design-system pnpm check
```

For the approved local browser scope, set `PLAYWRIGHT_PROJECTS=chromium,mobile,firefox`. CI must leave this unset and run all engines.

## Replay history

Apply the implementation commits in order on top of the design/ADR baseline:

1. `708df5a` — static scaffold, path/server tests and verification commands
2. `6ab28aa` — accessible brand tokens, homepage and navigation
3. `29076bd` — static documentation routes and searchable proposals

Subsequent commits add responsive verification and the Pages pipeline. Use Git history for their hashes; do not squash if individual replay is required. These commits have not been pushed or merged into main.

## Next

Implement and test the GitHub Actions verification/deployment workflow. Validate the export in both root and repository-prefix modes. Repository Pages settings, environment restrictions, required checks and an actual CI/deployment run require owner setup/permission and have not been performed.
