# Agent Instructions

This repository contains the TeacherActive design system, documentation site, component registry, themes, and agent interfaces.

## Read first

Before changing code or documentation, read:

1. `docs/agent-ready-design-system-plan.md`
2. `docs/architecture/overview.md`
3. The relevant standard under `docs/standards/`
4. Any ADR or RFC related to the change

## Source-of-truth rules

- Generic component implementations belong in `packages/ui/`.
- Primitive and semantic tokens belong in `packages/tokens/`.
- App theme mappings belong in `packages/themes/`.
- Shared animation presets belong in `packages/motion/`; import `motion` only there ([ADR-0008](docs/adr/ADR-0008-motion-library-and-shared-animations.md)).
- Reusable product compositions belong in `packages/patterns/` only after reuse is demonstrated.
- Registry files describe or package canonical source; generated registry output is never edited by hand.
- Public documentation belongs in `content/docs/`; engineering decisions belong in `docs/`.

## Working rules

- Keep component names and APIs product-agnostic.
- Use Base UI for accessible behaviour and TeacherActive tokens for styling.
- Never place app-specific colour values inside a shared component.
- Preserve keyboard interaction, focus visibility, contrast, text scaling, reduced motion, and forced-colour support across themes.
- Update tests, documentation, registry metadata, and agent resources with the implementation they describe.
- Record lasting architecture changes as ADRs and proposed cross-cutting changes as RFCs.
- Do not expose secrets, arbitrary filesystem access, or repository writes through MCP or WebMCP.

## Frontend development skills

Use these installed Vercel skills as supporting guidance during app and design-system development:

- `vercel-react-best-practices`: apply when writing, reviewing, or refactoring React/Next.js code, especially for rendering, data loading, bundle size, and performance concerns.
- `vercel-composition-patterns`: apply when designing component APIs, refactoring prop-heavy components, or choosing compound component, context, render prop, and React 19 patterns.
- `web-design-guidelines`: apply when reviewing UI implementation for accessibility, UX, interaction quality, visual hierarchy, and responsive behaviour.
- `writing-guidelines`: apply when creating or reviewing public docs, component usage guidance, README content, and other prose.

These skills complement this repository's source-of-truth rules. If skill guidance conflicts with the architecture, standards, ADRs, or TeacherActive token/accessibility requirements, follow the repository documents and record any lasting decision as an ADR or RFC.

## Required verification

Run the shared repository check command once it exists. Until then, changes must cover the relevant type, unit, accessibility, contract, registry, build, and browser checks described in `docs/standards/testing-and-evals.md`.

