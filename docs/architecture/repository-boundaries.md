# Repository Boundaries

## Canonical ownership

| Area | Owns | Must not own |
| --- | --- | --- |
| `packages/ui` | Generic component APIs, composition, state styling | Product workflows or app colour values |
| `packages/tokens` | Primitive and semantic token contracts | Component markup or app-specific screens |
| `packages/themes` | Base-brand and app token mappings | Behaviour changes or component forks |
| `packages/motion` | The only `motion` import, shared animation presets, reduced-motion behaviour | Component markup, app-specific choreography or Motion+ dependencies |
| `packages/patterns` | Reusable cross-app compositions | Single-app business logic |
| `content/docs` | Published documentation content | Architecture decisions or generated registry files |
| `docs` | Product, architecture, standards, security, ADRs, RFCs | Runtime implementation |
| `registry` | Registry manifests and generated payload definitions | A second editable component implementation |
| `mcp` (deferred) | No package in the initial scope; revisit only under a new ADR | Initial-release server scaffolding, repository writes or arbitrary filesystem reads |
| `src` | Documentation application shell and adapters | Canonical shared component source |

## Promotion rules

- A single-app composition starts in its owning application.
- Promote it to `packages/patterns` after a second application demonstrates the same semantic and interaction contract.
- Promote a repeated low-level control to `packages/ui` only when its API can remain product-agnostic.
- Add a component token only when semantic tokens cannot express the requirement without ambiguity.
- Add an app theme rather than forking a component when the difference is visual.

## Import constraints

- Packages may depend only on lower-level packages defined by the architecture.
- Documentation and fixtures may import all published packages.
- Shared packages must not import from `src`, `content`, `apps`, `registry`, `delivery`, or generated directories.
- Registry manifests may reference canonical package files but generated payloads must not be imported back into packages.

