# ADR-0003: Use Semantic Tokens for Multi-App Theming

- **Status:** Accepted
- **Date:** 2026-09-21

## Context

TeacherActive applications need to share component behaviour while expressing different product contexts. Component forks would multiply maintenance and create inconsistent accessibility.

## Decision

Use primitive, semantic, and exceptional component token layers. Shared components consume semantic or component tokens and never use app-specific colour values.

Each application registers a theme that maps the stable token contract under `data-ta-theme`. Visual differences use themes, documented variants, or density settings. A component fork requires materially different semantics or behaviour and an ADR.

## Consequences

- New app themes can be added without rewriting shared components.
- Token names become a public compatibility contract and require deliberate versioning.
- Every theme must pass accessibility and visual-regression checks across all supported component states.

