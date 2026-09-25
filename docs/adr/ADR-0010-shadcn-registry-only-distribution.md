# ADR-0010: Distribute through the shadcn registry only

- **Status:** Proposed
- **Date:** 2026-09-25
- **Partially supersedes:** [ADR-0002](./ADR-0002-canonical-source-and-dual-distribution.md) where it requires versioned npm packages

## Context

[ADR-0002](./ADR-0002-canonical-source-and-dual-distribution.md) chose two channels: versioned workspace/npm packages and a shadcn-compatible registry. The team now wants the registry as the only consumer channel, with no GitHub Packages and no npm publishing from this repository. The Motion Kit publishes `@teacheractive/ui` to GitHub Packages. That repository is left unchanged, and this decision does not depend on it.

## Decision

Consumers install TeacherActive components, tokens, themes, motion presets and blocks by copying source through the shadcn registry (`shadcn add @teacheractive/<item>`). The registry is served as static files from the documentation site ([ADR-0006](./ADR-0006-github-pages-static-deployment.md)).

- Do not publish any package to GitHub Packages or npm. Keep `packages/*` as private workspace packages (`"private": true`). They remain the canonical source ([ADR-0002](./ADR-0002-canonical-source-and-dual-distribution.md)) and are what the docs site, examples and registry payloads resolve from inside this repository.
- Registry payloads are generated from `packages/` and never edited by hand.
- Every registry item declares its npm `dependencies` (for example `motion`, `@base-ui/react`) and its `registryDependencies` on other TeacherActive items. Tokens, themes and motion presets are registry items too, because a copied component needs them.
- [ADR-0008](./ADR-0008-motion-library-and-shared-animations.md) still confines the `motion` import to one module in this repository. In a consuming project that module is the copied motion item, so `@teacheractive/motion` is not an installable npm package.

## Consequences

- Consumers own the copied source. There are no managed upgrades: a consumer receives a change only by re-adding the item and reviewing the resulting diff. Every release needs a changelog that says which items changed and whether the change is breaking, so consumers can decide what to re-add.
- The compatibility policy covers copied-source consumers only. Token names remain a public contract ([ADR-0003](./ADR-0003-semantic-tokens-and-multi-app-theming.md)).
- The registry and its source are public, because the Pages site is public. This matches the public class for stable component source and registry metadata in [data classification](../security/data-classification.md). Do not put private or app-specific material in a registry item.
- Registry files must be emitted as static files under the configured base path. Test the built artifact, not a development server.
- Registry installation and the docs preview must produce the same result. Add a registry smoke test that installs items into a clean fixture project and builds it, with the theme lab as the visual check.
- Update [RFC-0001](../rfc/RFC-0001-component-lifecycle.md) step 8 and the documentation standard so that "release" means publishing registry output and its changelog.

## Open items

- Decide the versioning and changelog convention for registry items, since the shadcn format has no package-style version resolution.
- Decide whether a private mirror of the registry is ever needed. It would require authenticated access and a new security review.
