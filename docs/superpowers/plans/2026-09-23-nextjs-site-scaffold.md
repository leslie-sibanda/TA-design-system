# Next.js documentation-site scaffold implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved Next.js/Fumadocs documentation shell as a static export, verified and deployed to GitHub Pages through GitHub Actions.

**Architecture:** Keep the Next.js application at the repository root, with routes under `src/app` and public MDX under `content/docs`. Separate the standalone homepage from documentation layouts. Use canonical token and theme packages for brand styling; do not transplant the prototype HTML or its DOM-based Markdown converter.

**Tech stack:** Next.js App Router static export, React, TypeScript, Fumadocs static search, Tailwind CSS v4, pnpm workspaces, Vitest, Testing Library, Playwright, axe-core and GitHub Actions/Pages. Use the supported official Fumadocs starter and commit resolved dependency versions in the lockfile.

**Spec:** [Approved design and current status](../../design/site-design-status.md), [documentation-site architecture](../../architecture/documentation-site.md), [repository boundaries](../../architecture/repository-boundaries.md).

**Hosting:** [ADR-0006: GitHub Pages static deployment](../../adr/ADR-0006-github-pages-static-deployment.md). All tasks must meet its static-export, base-path and deployment constraints.

**Status:** Proposed implementation plan, awaiting review. This plan is not an instruction to start coding without approval.

## Scope

This is the first independently testable slice: project setup, homepage, responsive navigation, documentation rendering and route shells. It does not deliver the complete design system.

Included routes are `/`, `/components`, `/components/button`, `/components/input`, `/components/tabs`, `/components/alert`, `/pages` and `/styling`. Add foundation and contribution MDX pages as navigation destinations. Until their later implementation slices, component content clearly states that APIs are proposals, Pages contains no claim of installable templates, and Styling shows a not-yet-implemented message rather than simulated working controls.

Explicitly excluded from this slice:

- Canonical interactive Button, Input, Tabs and Alert implementations
- Working token editing, theme persistence or registration
- Markdown export endpoints and real Copy Markdown controls
- Registry distribution and WebMCP registration (separate follow-on slices)
- External MCP services (deferred entirely under ADR-0007)
- Dark mode and additional approved application themes

These exclusions preserve the approved design direction; they do not remove features from the roadmap.

## Global constraints

- Generic component implementations belong in `packages/ui/`.
- Primitive and semantic tokens belong in `packages/tokens/`.
- App theme mappings belong in `packages/themes/`.
- Public documentation belongs in `content/docs/`; engineering decisions belong in `docs/`.
- Preserve existing documents, assets, Git history and the committed design preview.
- No copied production values sampled from screenshot pixels.
- Do not represent proposed component APIs or unavailable services as released.
- The approved white-on-orange preview has a known 2.69:1 contrast failure. Do not silently change the brand orange or disable an accessibility check. Obtain a design-owner decision on a compliant foreground/background pairing before accepting the styled scaffold.
- Browser dialogs in the scaffold use accessible framework facilities; later shared controls use Base UI.
- Resolve and record actual tool versions from the starter during execution. Do not invent framework integration imports before inspecting that version's generated files.
- Build with `output: 'export'`, `trailingSlash: true` and `images.unoptimized: true`. Test exported `out/`, not `next start`.
- Test the project base path `/TA-design-system` and unprefixed local mode. Every public asset and search request must respect the configured path.
- Apply `vercel-react-best-practices` to rendering and client boundaries, `vercel-composition-patterns` to APIs, `web-design-guidelines` to responsive/accessibility review, and `writing-guidelines` to documentation. Repo standards and static-host constraints take precedence.
- Apply the installed `tdd` skill: one public behaviour, observed failing test, minimal passing implementation, then the next behaviour. Each task's test list is a sequence of vertical slices, not a request to write the whole suite first.
- Plan approval also confirms the test seams: rendered routes/navigation, keyboard interactions, search results, exported files/base-path URLs and CI deployment permissions. Later slices add canonical component behaviour, theme export and agent contracts.

## Review focus

1. Direct route loads and browser Back must work without hash routing; covered by Task 3 route tests.
2. At 320 CSS pixels and enlarged text, content must not widen the viewport; covered by Task 4 responsive tests.
3. Mobile navigation must trap focus, dismiss with Escape and restore focus; covered by Task 4 interaction tests.
4. Long headings, tables and code examples must stay readable; covered by Task 3 fixture and Task 4 overflow checks.
5. Missing routes and unfinished features must not imply released components; covered by Task 3 content checks.

## File responsibilities

| Path | Responsibility |
| --- | --- |
| `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` | Root app dependencies, pinned package manager and workspace discovery |
| `next.config.*`, `source.config.*`, `tsconfig.json` | Starter-compatible build, MDX and type configuration |
| `scripts/check` | Reproducible lint/type/unit/static-build/browser gate |
| `scripts/serve-export.mjs` | Serve exported files under the configured base path for local and CI verification |
| `.github/workflows/pages.yml` | PR verification and main-branch-only Pages deployment |
| `tests/unit/`, `tests/integration/`, `tests/contract/` | Vitest/Testing Library behaviour tests and exported-artifact contracts |
| `src/app/layout.tsx`, `src/app/globals.css` | Root providers and application CSS imports |
| `src/app/page.tsx` | Standalone homepage without a sidebar |
| `src/app/(docs)/layout.tsx` | Documentation shell and sidebar |
| `src/app/(docs)/components/[[...slug]]/page.tsx` | Component catalogue and MDX detail routes |
| `src/app/(docs)/foundations/page.tsx` | Foundations content entry |
| `src/app/(docs)/contributing/page.tsx` | Contribution guidance entry |
| `src/app/(docs)/pages/page.tsx` | Page-template destination with honest scaffold status |
| `src/app/styling/page.tsx` | Styling destination, separate from the component sidebar |
| `src/components/site/site-header.tsx` | Shared icon, navigation, search trigger and mobile menu |
| `src/lib/navigation.ts` | Shared top-level navigation records |
| `src/lib/source.ts` | Fumadocs content loader using the installed version's API |
| `content/docs/components/` | Component overview and proposal MDX files plus navigation metadata |
| `packages/tokens/src/primitive.css`, `semantic.css` | Brand primitives and shared semantic variables |
| `packages/themes/src/teacheractive.css` | Base light theme mapping |
| `public/brand/` | Supplied logo assets used at runtime |
| `playwright.config.ts`, `e2e/site-shell.spec.ts` | Production-build browser checks |

Do not create unused packages or placeholder exports merely to match the future repository diagram. Adapt starter-generated configuration filenames to its supported conventions and record any path changes in the handoff.

## Task 1: Establish the runnable application and verification gate

**Files:** Root configuration files, `scripts/check`, `src/app/layout.tsx`, `src/app/page.tsx`, `playwright.config.ts`, `e2e/site-shell.spec.ts`, `.gitignore`, `README.md`.

**Interfaces:** Produces `pnpm dev`, `pnpm build`, `pnpm serve:export`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e` and `pnpm check`. Later tasks rely on port 3000 and the same Playwright suite. `pnpm serve:export` serves `out/` at the configured base path without a Next.js runtime.

- [ ] Inspect current official Fumadocs starter options and runtime requirements. Generate into a temporary directory using `npx create-fumadocs-app@latest`, selecting Next.js/TypeScript. Record selected versions. Copy starter app files deliberately; do not overwrite repository documentation or initialise a second Git repository.
- [ ] Configure pnpm workspaces for `packages/*` and `apps/*`. Pin the package-manager version and commit the generated lockfile. Preserve the existing `.superpowers/` ignore entry; ignore dependency, build, generated MDX, browser report and local environment outputs.
- [ ] Configure static export and the explicit build-time `SITE_BASE_PATH` environment variable. Its CI value is `/TA-design-system`; local unprefixed mode uses an empty string. Validate allowed path syntax and centralise prefixing for public assets/fetch URLs. Do not double-prefix Next.js Link destinations.
- [ ] Add Vitest, Testing Library, Playwright and axe-core as development dependencies. Unit-test the public path helper, including root mode, project mode and malformed paths, before implementing it. Use the exported production files for browser verification. Configure Chromium desktop/mobile projects plus representative Firefox and WebKit smoke tests.
- [ ] Add an export server that mounts `out/` at `SITE_BASE_PATH`, resolves directory indexes and serves unknown paths with a real 404 status and the exported 404 page. Reject traversal. Verify nested direct loads, query strings and missing paths against that public HTTP boundary.
- [ ] Add this first acceptance test before replacing starter content:

```ts
import { test, expect } from '@playwright/test';

test('homepage identifies the design system', async ({ page }) => {
  await page.goto(`${process.env.SITE_BASE_PATH ?? ''}/`);
  await expect(page).toHaveTitle(/TeacherActive/);
  await expect(page.getByRole('heading', { level: 1 }))
    .toContainText('Shared foundations');
});
```

- [ ] Run `pnpm build && pnpm test:e2e`. Confirm the test fails because the starter does not contain the approved identity, not because the test runner is broken.
- [ ] Replace the starter landing content with the approved heading and page metadata, then rerun the test.
- [ ] Create `scripts/check` to run type checking, linting, unit/integration tests, static production build, exported-artifact contracts and browser tests sequentially with immediate failure on a nonzero exit. Set `pnpm check` to invoke it. Do not silently skip browsers when dependencies are missing.
- [ ] Run `pnpm check`, document bootstrap/dev/check commands in the README, and commit as `build: scaffold Next.js and Fumadocs with verification`.

## Task 2: Apply the approved brand and shared header

**Files:** Token/theme CSS and workspace manifests, `src/components/site/site-header.tsx`, `src/lib/navigation.ts`, root layout/CSS, homepage, `public/brand/`, browser tests.

**Interfaces:** A shared `siteNavigation` array contains `{ href, label }` entries for Components, Pages and Styling. The header renders these links and the home icon. Token CSS is imported once through the root stylesheet.

```ts
export const siteNavigation = [
  { href: '/components', label: 'Components' },
  { href: '/pages', label: 'Pages' },
  { href: '/styling', label: 'Styling' },
] as const;
```

- [ ] Add a failing homepage test requiring an image named `TeacherActive home` inside a link to `/`, a separate full-wordmark image, and the Components/Pages/Styling links.
- [ ] Run the targeted browser test and confirm missing elements cause failure.
- [ ] Copy the supplied wordmark and icon to `public/brand/` without altering their proportions. Use meaningful image dimensions to avoid layout shift.
- [ ] Define TA Blue `#005292` and TA Orange `#F57D00` in primitive tokens, then map semantic surface, text, action, border and focus values in the base theme. Keep product-specific values out of reusable component code.
- [ ] Resolve the documented orange/white contrast decision with the design owner before finalising action foreground tokens. Record the chosen compliant treatment in the design status; do not describe preview approval as an accessibility waiver.
- [ ] Build the header and plain homepage with Arial/system fallbacks, no homepage sidebar and no portal-card grid. Use the agreed large wordmark, headline, supporting copy and two navigation calls to action. Keep this content server-rendered; isolate interactive navigation/search code.
- [ ] Run the homepage tests and an axe scan. Confirm there is no ignored colour-contrast violation. Commit as `feat: add TeacherActive homepage and shared navigation` only after the acceptance checks pass.

## Task 3: Render documentation and route shells

**Files:** Documentation layout/routes, `src/lib/source.ts`, `content/docs/`, Pages/Styling route shells, browser tests.

**Interfaces:** Fumadocs loads the component MDX files by slug. Sidebar order is All components, Alert, Button, Input, Tabs. Top-level routes remain ordinary Next.js links, not hash-based prototype navigation.

- [ ] Add route tests for `/components`, each of the four component detail routes, `/pages` and `/styling`. Require a page heading, successful navigation and no console errors. Test browser Back from a detail page to the catalogue.
- [ ] Add an unknown-component test requiring a real not-found response instead of rendering a fabricated component.
- [ ] Run the tests and confirm missing routes fail.
- [ ] Use the installed Fumadocs loader/MDX renderer to render public content. Enumerate every dynamic component slug with static-generation APIs; no route can require request-time rendering. Derive catalogue links and sidebar navigation from the same content metadata. Do not create a second list of hand-maintained detail pages in client JavaScript.
- [ ] Add concise proposal MDX for Alert, Button, Input and Tabs using the approved guidance. Preserve the Button API table as proposed, not supported runtime exports. Do not display an executable install command as already available.
- [ ] Render the catalogue as linked cards and the sidebar as a flat alphabetical list. Use a soft selected state without the hard blue stripe. Reserve Overview, Usage guidance, States and accessibility, and Reference sections.
- [ ] Put explicit scaffold-status content on Pages and Styling. Do not import the static prototype into production to simulate completion. Do not show active Markdown-copy controls until the export slice implements them.
- [ ] Use Fumadocs' supported static search export and client adapter. Generate its index during the build and fetch it through a base-path-aware URL; no request-time search service may remain. Test Button lookup, no results and index-load failure before implementing each behaviour. Search must navigate to the real exported route.
- [ ] Add a documentation test fixture with a long heading, a wide table and a long code line. Keep code/table overflow within their containers.
- [ ] Run route, not-found and search tests, then `pnpm check`. Commit as `feat: add documentation routes and catalogue shell`.

## Task 4: Verify responsive navigation and accessibility

**Files:** Header/navigation client boundary, route styles, browser tests, `delivery/handoffs/current.md`.

**Interfaces:** Navigation and search work with pointer and keyboard at desktop and phone widths. The homepage has no desktop sidebar; documentation retains desktop navigation and offers a mobile menu.

- [ ] Add this responsive overflow check for all scaffold routes:

```ts
for (const width of [320, 390, 768, 1100, 1440]) {
  test(`site fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/components/button', '/styling']) {
      await page.goto(`${process.env.SITE_BASE_PATH ?? ''}${route}`);
      const fits = await page.evaluate(() =>
        document.documentElement.scrollWidth <= window.innerWidth
      );
      expect(fits).toBe(true);
    }
  });
}
```

- [ ] Add keyboard tests: open the mobile menu, tab through its controls without reaching background content, dismiss with Escape and verify focus returns to the trigger. Repeat for search. Follow a mobile navigation link and confirm the dialog closes.
- [ ] Add enlarged-text and reduced-motion checks, plus axe scans on homepage and Button documentation. Add long-content fixture coverage from Task 3.
- [ ] Run the targeted tests and inspect failures before changing layout.
- [ ] Implement responsive header/menu behaviour with supported accessible facilities. Scale the logo and heading, stack phone homepage actions, and retain scrollable table/code regions. Do not globally hide horizontal overflow to conceal layout defects.
- [ ] Run the complete `pnpm check` command. Inspect representative desktop and phone screenshots and manually verify keyboard behaviour. Record gaps rather than claiming device or screen-reader testing that did not occur.
- [ ] Write a handoff listing implemented routes, exact run commands, verified checks and remaining work. Commit as `test: verify responsive documentation scaffold`.

## Task 5: Gate and deploy the static artifact through GitHub Actions

**Files:** `.github/workflows/pages.yml`, verification scripts, `README.md`, `delivery/handoffs/current.md`.

**Interfaces:** Pull requests run read-only verification. Main-branch pushes can deploy the tested `out/` artifact to the `github-pages` environment. Pages configuration remains an owner setup step.

- [ ] Write contract tests for the workflow: PR events exist, default permissions are read-only, deployment depends on successful verification, deployment is restricted to `refs/heads/main` and excludes PR events, and only deployment receives Pages/OIDC write permissions. Run them against the absent workflow and observe failure.
- [ ] Add supported official checkout, pnpm/Node setup, Pages configuration, artifact upload and deployment actions. Pin reviewed action revisions, not invented SHAs. Install with `pnpm install --frozen-lockfile` and install required Playwright browsers/system dependencies.
- [ ] Set `SITE_BASE_PATH=/TA-design-system` for build and tests. Run `pnpm check` once against this export. Upload browser reports on failure with bounded retention. Never upload the repository or local sessions as the website.
- [ ] Upload the already tested `out/` directory as the Pages artifact. Do not rebuild between tests and deployment. Add a dependent deploy job with environment `github-pages`, `pages: write`, `id-token: write`, a main-branch/non-PR condition and deployment concurrency.
- [ ] Repeat export/path smoke checks in an unprefixed local test job or documented local verification command. Check logo URLs, nested-route reloads, search-index fetches, correct 404 responses and no broken internal links in both modes.
- [ ] Run workflow contract tests and an available workflow syntax validator. Local checks do not prove an Actions run or public deployment succeeded; report those separately.
- [ ] Document owner setup: select GitHub Actions as the Pages source, restrict the deployment environment to main and enable required checks. Do not claim these settings were changed without repository access and confirmation.
- [ ] Record the verified CI run/deployment URL once available. The expected project URL is `https://leslie-sibanda.github.io/TA-design-system/`. Commit as `ci: verify and deploy the static site to GitHub Pages`.

## Follow-on implementation slices

After accepting the scaffold, plan these separately:

1. Canonical Base UI components, validated component API contracts and live documentation examples.
2. The accepted simplified Styling canvas using those real components, scoped tokens and draft CSS copy.
3. Build-time Markdown/static record generation and read-only browser WebMCP under ADR-0005, ADR-0006 and [ADR-0007](../../adr/ADR-0007-static-agent-access-without-external-mcp.md). Other agents retrieve public Markdown through HTTP. Do not scaffold an external MCP server or transport.
4. Registry generation, installation smoke tests and formal app-theme registration.

## Completion and review

The scaffold is complete only when its routes, navigation, search, responsive behaviour and verification command work. It is not a design-system release. Missing canonical components and agent services remain explicit follow-on work.

Review this plan before execution. Native execution in this session is recommended for this sequential scaffold. Implementation should begin in an isolated worktree, preserve the existing preview, and stop on failing acceptance checks or unresolved accessibility decisions.
