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

## Required verification

Run the shared repository check command once it exists. Until then, changes must cover the relevant type, unit, accessibility, contract, registry, build, and browser checks described in `docs/standards/testing-and-evals.md`.

