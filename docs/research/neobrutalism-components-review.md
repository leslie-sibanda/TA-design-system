# Reference Review: Neobrutalism Components

- **Reviewed:** 2026-09-22
- **Sources:** [documentation](https://www.neobrutalism.dev/docs/), [GitHub repository](https://github.com/ekmas/neobrutalism-components)
- **Decision:** Use selected documentation and registry patterns as references. Do not adopt the project as a dependency, fork, or visual foundation.

## Why it is useful

Neobrutalism Components demonstrates that a distinctive brand layer can sit on top of shadcn-compatible distribution. It combines a searchable documentation site, live examples, component source, install commands, theme presets, and generated registry metadata in one small project.

The project is also a useful warning. Its maintainer [ended active maintenance in July 2025](https://github.com/ekmas/neobrutalism-components/discussions/100), and the current registry still lists many Radix dependencies while the website describes newer components as using Base UI. TeacherActive should borrow the delivery patterns without inheriting this migration state or relying on the repository for updates.

## Adopt these patterns

### One page per component

Each component should have a predictable page with:

- A live preview
- Copyable source examples
- A package-manager-aware install command
- Variant and state examples
- API, accessibility, and usage guidance
- Links to related components and patterns

The useful idea is the repeatable page anatomy. TeacherActive pages need stronger guidance about semantic variants, app themes, content rules, responsive behaviour, and accessibility than the reference site provides.

### Registry metadata as a generated product

The project keeps component metadata in code and uses a [generation script](https://github.com/ekmas/neobrutalism-components/blob/main/src/scripts/generate-registry-json.ts) to update the shadcn registry manifest. Its [registry](https://github.com/ekmas/neobrutalism-components/blob/main/registry.json) declares component files, npm dependencies, registry dependencies, hooks, and target paths.

TeacherActive should use the same broad approach with stricter boundaries:

- Canonical source remains in `packages/`.
- Registry definitions are typed metadata, not a second implementation.
- `/r/*.json` payloads are generated build artifacts.
- Documentation, package exports, registry items, and MCP resources resolve from the same component record.
- CI validates dependency references, target paths, source hashes, examples, and registry output.

### Installable theme presets

The reference site exposes colour presets as registry styles through its [installation workflow](https://www.neobrutalism.dev/docs/installation). This maps well to TeacherActive's multi-app requirement.

Publish each approved application theme as an installable registry item, for example `@teacheractive/theme-client-portal`. A theme item should install semantic token values, font declarations where licensed, theme metadata, and any required provider configuration. It must not duplicate component source or introduce app-specific conditions into generic components.

### CSS variables bridged into Tailwind

The project's [global stylesheet](https://github.com/ekmas/neobrutalism-components/blob/main/src/styling/globals.css) maps CSS custom properties into Tailwind v4 through `@theme inline`. Reuse that mechanism so runtime themes and Tailwind utilities share one token source.

TeacherActive should use semantic names such as `--color-action-primary`, `--color-surface-brand`, and `--color-text-muted`. Avoid broad visual names such as `--main`, because their meaning becomes ambiguous across products and colour modes.

### Stable part markers

The components add `data-slot` attributes to important parts. Adopt this convention for stable styling, tests, debugging, and agent inspection. Define names as part of each component's contract and avoid using generated class names or DOM position as selectors.

### Separate primitives, examples, patterns, and templates

The source separates UI components from examples and larger showcase/template content. Preserve that conceptual split in the TeacherActive repository:

- `packages/ui` for generic primitives and controls
- `packages/patterns` for reusable compositions
- `apps/docs` and `content/docs` for previews and educational examples
- `templates/` for optional application starters

### Styling and theme laboratory

The reference site's styling area makes tokens tangible. TeacherActive should provide a theme laboratory that can switch between registered app themes and inspect colour, typography, radius, spacing, elevation, density, motion, focus, and component states. Exported changes should produce a reviewable token proposal rather than silently changing production themes.

## Adapt rather than copy

| Reference pattern | TeacherActive adaptation |
| --- | --- |
| Flat component catalogue | Organise by foundations, primitives, forms, navigation, feedback, data display, patterns, and templates. |
| Visual variants such as `noShadow` or `reverse` | Use stable semantic APIs such as `intent`, `emphasis`, `size`, and `density`; themes decide the visual treatment. |
| One application containing docs and source | Keep the docs app separate from canonical packages while generating all surfaces from shared metadata. |
| Manual copy as a fallback | Support source installation through the registry, but make package imports the managed path for TeacherActive applications. |
| Colour preset selector | Switch complete app themes and colour modes, with contrast and token-completeness checks. |
| MDX compiled with Velite | Keep Fumadocs as planned; borrow the content model and code-preview pipeline, not this exact dependency choice. |

## Do not reuse

- Do not use Neobrutalism Components as a runtime dependency or maintenance upstream. The project is no longer maintained.
- Do not fork the complete repository. Its single-app layout does not meet the package, multi-app, MCP, evaluation, and governance boundaries in this plan.
- Do not copy the hard black borders, offset shadows, hover translation, or saturated surfaces as global product defaults. They conflict with the TeacherActive brand guidance and would become tiring in data-heavy applications.
- Do not expose visual implementation details as long-lived component variants.
- Do not mix Radix and Base UI casually. TeacherActive should use the accepted Base UI foundation and document any exception explicitly.
- Do not maintain hand-authored registry payloads alongside package source.
- Do not treat decorative assets as UI primitives. TeacherActive waves, curves, and triangle motifs belong in brand assets or selected compositions.

## Additions to the implementation plan

1. Define a typed component manifest that supplies docs navigation, package exports, registry metadata, examples, MCP records, and status information.
2. Generate and validate registry payloads from canonical package files.
3. Add one registry theme item per application and a base item for shared dependencies and token contracts.
4. Standardise `data-slot` names for component roots and parts.
5. Define a component documentation template before implementing the first component.
6. Add a theme laboratory to the documentation-site scope.
7. Include provenance and version metadata in agent-readable component records.
8. Track upstream primitive versions and migration state explicitly so the system cannot drift between Base UI and other primitive libraries unnoticed.

## Licensing note

The reference repository uses the [MIT License](https://github.com/ekmas/neobrutalism-components/blob/main/LICENSE). Architectural ideas do not require copied source. If implementation code is copied or substantially adapted later, retain the required copyright and license notice and record its provenance in the relevant component metadata.
