# Next.js documentation-site scaffold implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the temporary preview server with a runnable Next.js/Fumadocs documentation shell matching the approved information architecture.

**Architecture:** Keep the Next.js application at the repository root, with routes under `src/app` and public MDX under `content/docs`. Separate the standalone homepage from documentation layouts. Use canonical token and theme packages for brand styling; do not transplant the prototype HTML or its DOM-based Markdown converter.

**Tech stack:** Next.js App Router, React, TypeScript, Fumadocs, Tailwind CSS v4, pnpm workspaces, Playwright and axe-core. Use the supported official Fumadocs starter and commit resolved dependency versions in the lockfile.

**Spec:** [Approved design and current status](../../design/site-design-status.md), [documentation-site architecture](../../architecture/documentation-site.md), [repository boundaries](../../architecture/repository-boundaries.md).

**Status:** Proposed implementation plan, awaiting review. This plan is not an instruction to start coding without approval.

## Scope

This is the first independently testable slice: project setup, homepage, responsive navigation, documentation rendering and route shells. It does not deliver the complete design system.

Included routes are `/`, `/components`, `/components/button`, `/components/input`, `/components/tabs`, `/components/alert`, `/pages` and `/styling`. Add foundation and contribution MDX pages as navigation destinations. Until their later implementation slices, component content clearly states that APIs are proposals, Pages contains no claim of installable templates, and Styling shows a not-yet-implemented message rather than simulated working controls.

Explicitly excluded from this slice:

- Canonical interactive Button, Input, Tabs and Alert implementations
- Working token editing, theme persistence or registration
- Markdown export endpoints and real Copy Markdown controls
- Registry distribution, external MCP services and WebMCP registration
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
| `scripts/check` | Reproducible lint/type/build/browser gate |
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

**Interfaces:** Produces `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm typecheck`, `pnpm lint`, `pnpm test:e2e` and `pnpm check`. Later tasks rely on port 3000 and the same Playwright suite.

- [ ] Inspect current official Fumadocs starter options and runtime requirements. Generate into a temporary directory using `npx create-fumadocs-app@latest`, selecting Next.js/TypeScript. Record selected versions. Copy starter app files deliberately; do not overwrite repository documentation or initialise a second Git repository.
- [ ] Configure pnpm workspaces for `packages/*` and `apps/*`. Pin the package-manager version and commit the generated lockfile. Preserve the existing `.superpowers/` ignore entry; ignore dependency, build, generated MDX, browser report and local environment outputs.
- [ ] Add Playwright and axe-core as development dependencies. Use the production build for browser verification. Configure Chromium with desktop and 390-pixel-wide mobile projects.
- [ ] Add this first acceptance test before replacing starter content:

```ts
import { test, expect } from '@playwright/test';

test('homepage identifies the design system', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/TeacherActive/);
  await expect(page.getByRole('heading', { level: 1 }))
    .toContainText('Shared foundations');
});
```

- [ ] Run `pnpm build && pnpm test:e2e`. Confirm the test fails because the starter does not contain the approved identity, not because the test runner is broken.
- [ ] Replace the starter landing content with the approved heading and page metadata, then rerun the test.
- [ ] Create `scripts/check` to run type checking, linting, production build and browser tests sequentially with immediate failure on a nonzero exit. Set `pnpm check` to invoke it. Do not silently skip browsers when dependencies are missing.
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
- [ ] Use the installed Fumadocs loader/MDX renderer to render public content. Derive catalogue links and sidebar navigation from the same content metadata. Do not create a second list of hand-maintained detail pages in client JavaScript.
- [ ] Add concise proposal MDX for Alert, Button, Input and Tabs using the approved guidance. Preserve the Button API table as proposed, not supported runtime exports. Do not display an executable install command as already available.
- [ ] Render the catalogue as linked cards and the sidebar as a flat alphabetical list. Use a soft selected state without the hard blue stripe. Reserve Overview, Usage guidance, States and accessibility, and Reference sections.
- [ ] Put explicit scaffold-status content on Pages and Styling. Do not import the static prototype into production to simulate completion. Do not show active Markdown-copy controls until the export slice implements them.
- [ ] Wire Fumadocs search to the real content index, following the installed starter API. Search must find Button and navigate to its real route.
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
      await page.goto(route);
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

## Follow-on implementation slices

After accepting the scaffold, plan these separately:

1. Canonical Base UI components, validated component API contracts and live documentation examples.
2. The accepted simplified Styling canvas using those real components, scoped tokens and draft CSS copy.
3. Canonical Markdown generation and read-only MCP/WebMCP adapters under ADR-0005.
4. Registry generation, installation smoke tests and formal app-theme registration.

## Completion and review

The scaffold is complete only when its routes, navigation, search, responsive behaviour and verification command work. It is not a design-system release. Missing canonical components and agent services remain explicit follow-on work.

Review this plan before execution. Native execution in this session is recommended for this sequential scaffold. Implementation should begin in an isolated worktree, preserve the existing preview, and stop on failing acceptance checks or unresolved accessibility decisions.
