# RFC-0001: Component Lifecycle

- **Status:** Proposed
- **Owners:** Design System Team

## Goal

Define one path from component request to supported release across packages, registry, documentation, and agent interfaces.

## Lifecycle

1. **Proposal:** document user need, known consumers, existing alternatives, accessibility requirements, and why composition is insufficient.
2. **Contract:** define semantics, public API, states, variants, keyboard behaviour, token needs, responsive behaviour, and acceptance criteria.
3. **Implementation:** build against Base UI and semantic tokens in the canonical package.
4. **Examples:** add representative, edge, error, loading, empty, disabled, and high-content states where applicable.
5. **Verification:** test behaviour, accessibility, themes, registry installation into a clean project, and production build.
6. **Documentation:** publish usage, API, accessibility, theming, migration, and related-component guidance.
7. **Review:** resolve API, visual, accessibility, QA, and security findings.
8. **Release:** publish the registry output with a changelog of changed items ([ADR-0010](../adr/ADR-0010-shadcn-registry-only-distribution.md)), then update static agent records and search indexes. External MCP is deferred under ADR-0007.
9. **Maintenance:** track deprecations and provide migrations before removal.

## Stability levels

- **Experimental:** API may change; excluded from the default registry catalogue.
- **Preview:** documented and testable; breaking changes require release notes.
- **Stable:** covered by compatibility policy and migration requirements.
- **Deprecated:** supported temporarily with a named replacement and removal milestone.

## Acceptance

Adopt this RFC when the first component is implemented and validate it through one complete delivery cycle before marking it accepted.

