# Delivery roadmap

- **Recorded:** 2026-09-25
- **Sources:** the approved [design preview](../../docs/design/preview/index.html) and [design status](../../docs/design/site-design-status.md), the [master plan](../../docs/agent-ready-design-system-plan.md), the Motion Kit review, ADR-0008 to ADR-0010 and the [layered motion system design](../../docs/superpowers/specs/2026-09-25-layered-motion-system-design.md)

This is the working task list: what exists, what is left, and the order to take it in. Decisions live in ADRs and the design status; this file tracks delivery only. Tick an item only when the evidence it names exists.

`[x]` done · `[~]` started or drafted, not finished · `[ ]` not started

## Where we are

The documentation site is built, tested and deployed, and the architecture is written down. No shared component, motion preset, registry item, app theme or agent record exists yet. Every component page is still a proposal. The next work is foundations and the motion pilot, then real components, then the registry that distributes them.

## Done

### Design

- [x] Approved visual direction, preserved as `docs/design/preview/index.html` (v11)
- [x] Accepted Styling playground prototype (`preview/styling.js`, `preview/styling.css`)
- [x] Brand assets with provenance (`docs/design/assets/`)
- [x] Brand language and theme model (`docs/domain/`)
- [x] Orange primary button with a white label, recorded as an accessibility exception and confirmed by the design owner on 2026-09-25

### Architecture and standards

- [x] ADR-0001 to ADR-0007 accepted: Base UI, canonical source, semantic tokens, agent access, GitHub Pages, static agent access
- [x] Standards for component authoring, accessibility, documentation, testing and evals
- [x] Security: threat model, data classification, agent access policy
- [x] Repository boundaries and component taxonomy
- [~] RFC-0001 component lifecycle and RFC-0002 app theme registration (proposed; accepted only after one full delivery cycle)

### Documentation site

- [x] Next.js 16 and Fumadocs static export for GitHub Pages, working at the root and at `/ta-design-system`
- [x] Homepage with wordmark, headline and two calls to action
- [x] Icon-only header with Components, Pages, Styling and search
- [x] Phone navigation with a focus trap, Escape to close and focus return
- [x] Flat alphabetical component sidebar
- [x] Component catalogue and proposal pages for Alert, Button, Input and Tabs
- [x] Foundations, Contributing and Pages content
- [~] Styling page (placeholder only; the approved playground is not built)
- [x] Static search from a generated index
- [x] Global reduced-motion clamp and forced-colours support for the skip link and actions

### Tokens and themes

- [x] Primitive colour tokens and a small semantic set (`packages/tokens`)
- [x] TeacherActive light theme mapping (`packages/themes`)
- [x] Test that pins the orange button tokens and the 2.69:1 ratio

### Delivery and verification

- [x] Reusable GitHub Actions: verification on every PR and main, deployment from main only, actions pinned to commit SHAs
- [x] `pnpm check`: typecheck, lint, 11 unit tests, 4 export contract tests, 41 browser tests locally (Chromium, mobile emulation, Firefox); WebKit runs the smoke test in CI
- [x] Handoff record (`delivery/handoffs/current.md`)

### Analysis and motion decisions (2026-09-25)

- [x] Review of the Motion Kit against this repository
- [x] Layered motion system design merged (PR #6), then extended with CSS-first guidance, the deliberately still list, the pilot and resolved decisions
- [~] ADR-0008 Motion, ADR-0009 canonical home and ADR-0010 registry-only distribution (proposed, not yet committed)
- [x] Testing standard extended with the registry smoke test, browser axe, the motion and forced-colour matrix, and import boundaries
- [x] WebKit decision: stays CI-only, widened when the first animated component ships

## To do

### Phase 0: land the decisions

- [ ] Commit ADR-0008, ADR-0009, ADR-0010, the spec update and the related doc edits on a branch, and open a PR
- [ ] Decide whether each ADR moves from Proposed to Accepted
- [ ] Record in ADR-0010 the trigger for revisiting private packages (drift or upgrade pain in a second app, or an urgent accessibility or security fix)
- [ ] Investigate the phone focus-trap test that passed only on retry in run 36111601605
- [ ] Verify branch protection and required checks on `main`, and the `github-pages` environment restriction

### Phase 1: foundations

- [ ] Motion tokens in `packages/tokens`: durations, easing and distances, named by intent, seeded from the Motion Kit values
- [ ] Fill out the rest of the semantic token set the components will need: spacing, radius, type scale, elevation, status colours
- [ ] Theme provider that sets `data-ta-theme` and `data-ta-mode` without a flash of the wrong theme
- [ ] Scaffold `packages/ui` with Base UI, subpath exports and a `private` manifest
- [ ] `packages/test-utils`: render helper, theme wrapper, axe helper
- [ ] Import-boundary checks as a lint rule plus a contract test, including "only `packages/motion` imports `motion`"
- [ ] Browser accessibility test convention: every component state checked with axe in a real browser, contrast rules on

### Phase 2: motion pilot

- [ ] Scaffold `packages/motion` (private) with `motion` 13.x, `m` with `LazyMotion` and `domAnimation`
- [ ] Provider that sets `MotionConfig reducedMotion="user"`
- [ ] `Reveal` wrapper and staggered-list wrapper, each with a reduced-motion variant
- [ ] Token-to-preset parity test
- [ ] Decide whether reduced-motion variants change instantly or use a short fade
- [ ] Bundle budget recorded, plus a check that non-animated pages do not load Motion
- [ ] Motion foundations page under `content/docs/foundations/`, including the deliberately still list

### Phase 3: first real components

- [ ] Button: settle the proposed `variant` API against the `intent` vocabulary in the authoring standard, then implement on the tokens
- [ ] Dialog on CSS transitions using Base UI's `data-starting-style` and `data-ending-style`, with no Motion
- [ ] One Motion-inside-Base-UI component (toast or tabs indicator), proving exit and cancellation by test
- [ ] Input, Tabs (working, not static anatomy) and Alert as live components
- [ ] Replace proposal previews with live previews, with source directly beneath each example as on Button
- [ ] Widen the WebKit project to the focus-trap, search, responsive and reduced-motion specs
- [ ] Validate RFC-0001 through this first delivery cycle

### Phase 4: registry

- [ ] `components.json` and `registry.json`; a `registry:base` item carrying tokens, theme provider and utilities
- [ ] Registry items for tokens, the TeacherActive theme, motion presets and each component, generated from `packages/`
- [ ] Static `/r/<item>.json` files under the base path, validated with `shadcn registry validate`
- [ ] Registry smoke test: install every stable item into a clean project, then type-check and build it
- [ ] Changelog and versioning convention for registry items
- [ ] Content hash on each item, plus a drift check apps can run against installed files
- [ ] Registry and installation page and a Getting started page (both in the preview, neither built)

### Phase 5: app themes and app examples

- [ ] Accept RFC-0002 on the first registered app theme
- [ ] First app theme (for example `client-portal`) as a token mapping, not a component fork
- [ ] Themes page and theme lab from the preview: every component state in every registered theme
- [ ] App example click-through: switch between each app's theme on the same examples
- [ ] Phone version of every app example, verified at a phone viewport with touch and reduced motion
- [ ] Visual baselines at the agreed desktop and phone viewports
- [ ] Patterns page with the preview's form layout and application shell, built from shared components
- [ ] Rank Motion Kit components for migration by real cross-app reuse, starting from its T1 tier

### Phase 6: Styling playground

- [ ] Build the accepted playground on canonical components: Customize (colour presets, action colour, corners, shadow, reset) and Copy
- [ ] Contrast warnings inside Customize and in the copied CSS; drafts kept in memory only

### Phase 7: agent access

- [ ] Generate public component Markdown from canonical docs and metadata, with View Markdown and Copy Markdown in each Reference section
- [ ] `llms.txt` and `llms-full.txt` as static files
- [ ] Read-only WebMCP tools, feature-detected, with a plain-HTTP fallback
- [ ] Agent evaluations from the testing standard

### Ongoing

- [ ] Manual screen-reader review of the site and of each component
- [ ] Revisit the orange button exception with the brand team by 2026-12-31
- [ ] The TeacherActive app's own button contrast follow-up (out of scope for this site)
- [ ] Repository agent files from the plan: `CLAUDE.md`, `SECURITY.md`, `.agents/skills/`

## Order and dependencies

Phase 0 unblocks everything. Phases 1 and 2 can run in parallel once motion tokens exist. Phase 3 needs both. The registry (Phase 4) needs at least one real component to distribute. App themes (Phase 5) and the Styling playground (Phase 6) need real components and the theme provider. Agent access (Phase 7) can start once component pages are generated from canonical metadata.
