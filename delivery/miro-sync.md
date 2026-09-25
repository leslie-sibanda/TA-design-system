# Miro sync notes

The Miro [DS Technical Solution Design](https://miro.com/app/dashboard/space/79YvboryTV8sZzzqDLdR6e) space holds the technical requirement diagrams. It is not edited from this repository. When a decision here changes something a board shows, add a note below, so the boards can be updated by hand later.

Each note says which board and frame to change, what it says now, what it should say, and where the decision is recorded. Tick a note once the board is updated, and leave it in place as a record.

- **Last checked against the boards:** 2026-09-25
- **Pending notes:** 14

## System Architecture board

- [ ] **Product view:** the arrow from UI components to Apps is labelled "npm packages via GitHub Packages". Remove it; apps receive components only through the registry (`shadcn add`). Source: [ADR-0010](../docs/adr/ADR-0010-shadcn-registry-only-distribution.md).
- [ ] **Product view:** there is no motion layer. Add a Motion box between Tokens and UI components, marked "decided, not built", with an optional edge to UI components (only animated components depend on it). Source: [ADR-0008](../docs/adr/ADR-0008-motion-library-and-shared-animations.md).
- [ ] **Product view:** the Apps box reads "Client Portal, New Tabs (first adopter undecided)" with a yellow "undecided" dot. Change to "Client Portal first, then New Tabs" and mark it decided. Source: [roadmap](./backlog/roadmap.md#decisions-taken-on-2026-09-25).
- [ ] **Delivery pipeline:** the "Publish packages" box says "GitHub Packages (npm); registry JSON ships with the site". Change to "Registry JSON ships with the site; nothing published to npm". Source: ADR-0010.
- [ ] **Contribution and release flow:** step 8 says "Release: packages and registry versioned together". Change to "Release: registry output and a changelog of changed items". Source: ADR-0010 and [RFC-0001](../docs/rfc/RFC-0001-component-lifecycle.md).
- [ ] **Contribution and release flow:** the "CI and release" lane says "GitHub Actions, Pages, Packages". Drop "Packages". Source: ADR-0010.

## Requirements board

- [ ] **Must haves:** the pink note "npm packages via GitHub Packages" contradicts ADR-0010. Remove it or move it to Nice to haves as "Private packages, only if registry drift becomes a problem".
- [ ] **Must haves:** the pink notes "Choose the first adopter app" and "Choose first-release components" are resolved. Replace with "Client Portal is the first adopter" and "Bare-minimum first release: Button, Link, Field, Input, Textarea, Checkbox, Radio group, Select, Alert, Dialog, Tabs". Source: [roadmap Phase 3](./backlog/roadmap.md#phase-3-first-release-components).
- [ ] **Nice to haves:** "Layered motion system (proposal, PR 6)" is now decided. Move it to Should haves as "Shared motion on Motion, CSS first (ADR-0008)".

## Technical Brainstorm board

- [ ] **Current State Context:** "CI verify and deploy built, never run on GitHub" and "No WebMCP, Pages not yet deployed" are out of date. CI runs on every PR and main, and the site is live at https://leslie-sibanda.github.io/ta-design-system/.
- [ ] **Future State Brainstorm:** the open notes on first adopter, owners and Markdown-before-registry are answered: Client Portal first; owners in RFC-0001 roles and approvals; Markdown before the registry.
- [ ] **Technical Solution Summary:** add ADR-0008 (Motion), ADR-0009 (this repository is the canonical home for shared UI and motion; the Motion Kit is a reference) and ADR-0010 (registry only). Mark ADR-0002's npm channel as superseded.
- [ ] **Technical Solution Summary:** the owner decision "dark text #182B3A on brand orange" was replaced on 2026-09-25 by white on orange as a recorded accessibility exception. Source: [design status](../docs/design/site-design-status.md#contrast-decision-resolved-for-implementation).
- [ ] **Technical Solution Summary:** the build order lists registry (slice 5) before Markdown (slice 6). Swap them: Markdown and `llms.txt` come first.

## Not changed on purpose

- The **Design Principles** frame is empty. The principles live in the ADRs and `AGENTS.md`; whether to copy them onto the board is a choice for whoever owns it.
