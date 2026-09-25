# ADR-0009: This repository is the canonical home for shared UI and motion

- **Status:** Proposed
- **Date:** 2026-09-25

## Context

The [Motion Kit](https://github.com/TeacherActive/teacheractive-motion-kit) repository states that it is the master for all TeacherActive UI components. It holds six HTML kits, a React package (`@teacheractive/ui` 1.2.0) built from them, and parity records. This repository holds the design-system documentation site, tokens, themes, standards and ADRs, and per [ADR-0002](./ADR-0002-canonical-source-and-dual-distribution.md) is where canonical components will live. Two repositories both claiming ownership would let component APIs, tokens, accessibility rules and motion drift apart.

## Decision

This repository is the canonical home for shared TeacherActive UI and motion going forward: components, tokens, themes, motion ([ADR-0008](./ADR-0008-motion-library-and-shared-animations.md)), patterns, the registry, documentation and agent access. New shared components and shared motion are designed and built here, under the standards in `docs/standards/`.

The Motion Kit is a reference and migration source, not a second home. Its HTML kits, parity records and component inventory are inputs to this repository. Anything brought across must meet this repository's standards first: Base UI for behaviour, semantic tokens, product-agnostic names and APIs, forced-colour support, reduced motion through `@teacheractive/motion`, and the accessibility checks in the testing standard.

## Consequences

- The Motion Kit repository is left unchanged. Its README still claims mastership and it still publishes `@teacheractive/ui` to GitHub Packages. This repository does not depend on either, because it distributes through the shadcn registry only ([ADR-0010](./ADR-0010-shadcn-registry-only-distribution.md)) and publishes no npm package, so the two do not compete for a package name. Reconciling the kit's own README is a decision for its owners, outside this repository.
- App-specific component sets from the kit are not copied wholesale. A composition enters `packages/patterns` only after the [promotion rules](../architecture/repository-boundaries.md#promotion-rules) are met. App styling goes through app themes ([RFC-0002](../rfc/RFC-0002-app-theme-registration.md)).
- The Motion Kit's token values, motion timings and per-component intent notes are the starting point for this repository's tokens and presets, but its decisions do not bind this repository. Where they conflict, this repository's ADRs and design owner decide. The orange primary button is the current example.
- Existing consumers of the kit's package are not affected by this decision. Moving them to registry installs is a separate migration that this decision does not schedule.

## Open items

- Decide which kit components are migrated first, ranked by real reuse across apps.
- Decide whether the kit's owners are asked to change anything, once this repository has shipped components. Nothing is required of them now.
