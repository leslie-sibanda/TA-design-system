# Delivery roadmap

- **Recorded:** 2026-09-25
- **Sources:** the approved [design preview](../../docs/design/preview/index.html) and [design status](../../docs/design/site-design-status.md), the [master plan](../../docs/agent-ready-design-system-plan.md), the Motion Kit review, ADR-0008 to ADR-0010, the [layered motion system design](../../docs/superpowers/specs/2026-09-25-layered-motion-system-design.md), and the Miro [DS Technical Solution Design](https://miro.com/app/dashboard/space/79YvboryTV8sZzzqDLdR6e) space (Product Brief, Requirements, Technical Brainstorm and System Architecture boards)

This is the working task list: what exists, what is left, and the order to take it in. Decisions live in ADRs, RFCs and the design status; this file tracks delivery only. Tick an item only when the evidence it names exists.

`[x]` done · `[~]` started or drafted, not finished · `[ ]` not started

## Where we are

The documentation site is built, tested and deployed, and the architecture is written down. No shared component, motion preset, registry item, app theme or agent record exists yet. Every component page is still a proposal.

The next work is foundations and the motion pilot, then a small first-release component set, then Markdown for agents, then the Client Portal theme, then the registry that lets Client Portal adopt it.

## Decisions taken on 2026-09-25

- **First adopter:** Client Portal. The first registered app theme is `client-portal`.
- **First release:** a bare-minimum set of components every site needs, and nothing complicated (Phase 3).
- **Build order:** follow the Miro slices, with Markdown and `llms.txt` before the registry, as the Technical Brainstorm recommends.
- **Owners:** the roles agreed on the Miro contribution flow are recorded in [RFC-0001](../../docs/rfc/RFC-0001-component-lifecycle.md#roles-and-approvals).
- **Miro:** the boards are not edited from this repository. Changes they need are listed in [Miro sync notes](../miro-sync.md) for a later update.

## Relation to the Miro slices

| Miro slice | This roadmap |
| --- | --- |
| 0. First deployment and owner setup | Done; remaining owner checks in Phase 0 |
| 1. Static scaffold | Done |
| 2. Canonical components | Phases 1 to 3 |
| 3. Live previews and API tables | Phase 3 |
| 6. Markdown and `llms.txt` (moved ahead of the registry) | Phase 4 |
| 4. Themes, Styling canvas and theme lab | Phases 5 and 6 |
| 5. Registry | Phase 7 |
| 7. WebMCP, then adoption | Phase 8 |

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
- [~] RFC-0001 component lifecycle (now with roles and approvals) and RFC-0002 app theme registration (proposed; accepted only after one full delivery cycle)

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

### Analysis and decisions (2026-09-25)

- [x] Review of the Motion Kit against this repository
- [x] Layered motion system design merged (PR #6), then extended with CSS-first guidance, the deliberately still list, the pilot and resolved decisions
- [x] ADR-0008 Motion, ADR-0009 canonical home and ADR-0010 registry-only distribution, committed in PR #8 (still Proposed)
- [x] Testing standard extended with the registry smoke test, browser axe, the motion and forced-colour matrix, and import boundaries
- [x] WebKit decision: stays CI-only, widened when the first animated component ships
- [x] Roadmap reconciled with the Miro space; first adopter, first-release scope, build order and owners decided

## To do

### Phase 0: land the decisions

- [ ] Merge PR #8
- [ ] Decide whether ADR-0008, ADR-0009 and ADR-0010 move from Proposed to Accepted
- [ ] Record in ADR-0010 the trigger for revisiting private packages (drift or upgrade pain in a second app, or an urgent accessibility or security fix)
- [ ] Investigate the phone focus-trap test that passed only on retry in run 36111601605
- [ ] Verify branch protection and required checks on `main`, and the `github-pages` environment restriction
- [ ] Update the Miro boards from the [Miro sync notes](../miro-sync.md) (done by a person in Miro, not from this repository)

### Phase 1: foundations

- [ ] Motion tokens in `packages/tokens`: durations, easing and distances, named by intent, seeded from the Motion Kit values
- [ ] Fill out the rest of the semantic token set the first-release components need: spacing, radius, type scale, elevation, status colours
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

### Phase 3: first-release components

The bare minimum every site needs, and nothing complicated. Each ships with its states, keyboard behaviour, accessibility tests, a live preview with source beneath it, and an API table.

- [ ] **Button**: settle the proposed `variant` API against the `intent` vocabulary in the authoring standard, then implement on the tokens
- [ ] **Link**: navigation that looks like the brand, distinct from a link-styled Button
- [ ] **Field**: label, description and error message, shared by every form control below
- [ ] **Input**
- [ ] **Textarea**
- [ ] **Checkbox**
- [ ] **Radio group**
- [ ] **Select**
- [ ] **Alert**: information, success, warning and error
- [ ] **Dialog**: CSS transitions on Base UI's `data-starting-style` and `data-ending-style`, no Motion
- [ ] **Tabs**: working, not static anatomy; its sliding indicator is the pilot's one Motion-inside-Base-UI case, proving exit and cancellation by test
- [ ] Replace the proposal pages with live pages for this set
- [ ] Widen the WebKit project to the focus-trap, search, responsive and reduced-motion specs
- [ ] Validate RFC-0001 through this first delivery cycle

Anything beyond this set (tables, date pickers, toasts, menus, comboboxes) waits for a real Client Portal need.

### Phase 4: Markdown and `llms.txt`

- [ ] Generate public component Markdown from canonical docs and metadata, with View Markdown and Copy Markdown in each Reference section
- [ ] `llms.txt` and `llms-full.txt` as static files under the base path
- [ ] Contract tests for the Markdown and discovery files, and a check that they match the rendered pages
- [ ] Agent evaluations for finding a component and explaining its accessibility constraints

### Phase 5: Client Portal theme and app examples

- [ ] `client-portal` theme as a token mapping, not a component fork, registered under RFC-0002
- [ ] Accept RFC-0002 on this first registered theme
- [ ] Themes page and theme lab from the preview: every first-release component state in the base and `client-portal` themes
- [ ] App example click-through: switch between the base and Client Portal themes on the same examples
- [ ] Phone version of every app example, verified at a phone viewport with touch and reduced motion
- [ ] Visual baselines at the agreed desktop and phone viewports
- [ ] Rank Motion Kit Portal components for migration by real Client Portal need

### Phase 6: Styling playground

- [ ] Build the accepted playground on canonical components: Customize (colour presets, action colour, corners, shadow, reset) and Copy
- [ ] Contrast warnings inside Customize and in the copied CSS; drafts kept in memory only

### Phase 7: registry

- [ ] `components.json` and `registry.json`; a `registry:base` item carrying tokens, theme provider and utilities
- [ ] Registry items for tokens, the base and `client-portal` themes, motion presets and each first-release component, generated from `packages/`
- [ ] Static `/r/<item>.json` files under the base path, validated with `shadcn registry validate`
- [ ] Registry smoke test: install every stable item into a clean project, then type-check and build it
- [ ] Changelog and versioning convention for registry items
- [ ] Content hash on each item, plus a drift check apps can run against installed files
- [ ] Registry and installation page and a Getting started page (both in the preview, neither built)

### Phase 8: WebMCP and Client Portal adoption

- [ ] Read-only WebMCP tools, feature-detected, with a plain-HTTP fallback
- [ ] Client Portal installs the first-release components and its theme from the registry
- [ ] Record what adoption surfaced; promote any repeated Client Portal composition to patterns only when a second app needs it

### Pipeline and quality (from the Miro delivery pipeline and requirements)

These can run alongside any phase.

- [ ] PR template, and automated PR review
- [ ] Formatting check, CodeQL, secret scanning and a dependency audit in CI (Should have: security scanning)
- [ ] Define what integration tests cover (the pipeline marks them "not yet defined")
- [ ] Post-deploy smoke test against the live URL
- [ ] Release tags and release notes (tag `v0.0.2` exists; agree the convention with the registry changelog)
- [ ] Staging target with acceptance tests and an environment approval gate
- [ ] Supported browsers policy, which also settles how much WebKit coverage is required
- [ ] Versioning and deprecation policy for registry items and tokens

### Ongoing

- [ ] Manual screen-reader review of the site and of each component
- [ ] Revisit the orange button exception with the brand team by 2026-12-31
- [ ] The TeacherActive app's own button contrast follow-up (out of scope for this site)
- [ ] Repository agent files from the plan: `CLAUDE.md`, `SECURITY.md`, `.agents/skills/`
- [ ] Decide how adoption, time saved and grounded AI tasks are measured (Product Brief section 12)
- [ ] Support channel for app teams
- [ ] A release cadence that counters the "stale iteration" risk in the Product Brief
- [ ] Add to the [Miro sync notes](../miro-sync.md) whenever a decision changes something the boards show

## Order and dependencies

Phase 0 unblocks everything. Phases 1 and 2 can run in parallel once motion tokens exist. Phase 3 needs both. Markdown (Phase 4) needs component pages generated from canonical metadata, so it follows Phase 3. The Client Portal theme (Phase 5) and the Styling playground (Phase 6) need real components and the theme provider. The registry (Phase 7) needs components and the theme to distribute, and Client Portal adoption (Phase 8) needs the registry.
