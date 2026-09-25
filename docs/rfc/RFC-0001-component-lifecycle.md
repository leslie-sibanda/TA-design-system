# RFC-0001: Component Lifecycle

- **Status:** Proposed
- **Owners:** Design System Team; step owners in [Roles and approvals](#roles-and-approvals)

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

## Roles and approvals

These owners were agreed on 2026-09-25 and drawn on the contribution and release flow in the Miro System Architecture board.

| Step | Owner | Decision or output |
| --- | --- | --- |
| 1. Proposal | Requester: an app team, a designer or an agent | The need, known consumers and existing alternatives |
| Shared or app-specific? | Application dev team | App-specific work stays in the app and becomes a pattern only after proven reuse. Shared UI, tokens and themes continue to step 2 |
| 2. Contract | Design System Team | API, states, keyboard behaviour, tokens and acceptance criteria |
| Brand sign-off | Marketing | Required when visuals or tokens change; otherwise not needed |
| 3–4. Implementation and examples | Design System Team | Base UI, tokens, test-first, every state |
| 5. Verification | CI | `pnpm check` on every pull request; a failure returns the work to step 3 |
| 6. Documentation | Design System Team | Usage, API, accessibility and theming |
| 7. Review | Marketers and developers | Findings recorded in the delivery review; unresolved findings return to step 3 |
| Release approval | Developers | Approve or send back |
| 8. Release | Design System Team | Registry output and changelog, per step 8 above |

An agent may act as requester or implementer. It never approves brand sign-off, review or release.

## Stability levels

- **Experimental:** API may change; excluded from the default registry catalogue.
- **Preview:** documented and testable; breaking changes require release notes.
- **Stable:** covered by compatibility policy and migration requirements.
- **Deprecated:** supported temporarily with a named replacement and removal milestone.

## Acceptance

Adopt this RFC when the first component is implemented and validate it through one complete delivery cycle before marking it accepted.

