# Layered Motion System Design

## Status

Draft for review. This document proposes an architecture; it does not authorize implementation or dependency installation.

## Context and intent

TeacherActive is building a shared, generic component system for multiple applications. The system should provide more value than a catalogue of animation snippets: teams need a small, approved vocabulary of motion, composable ways to apply it, and polished animation for interaction patterns where motion is part of the component experience.

Motion for React (`motion` from Motion, documented at https://motion.dev/docs/react) is a candidate implementation dependency. TeacherActive must own the public API, accessibility contract, token mapping, documentation, and release boundaries rather than exposing the vendor API as its design-system contract.

The repository is currently greenfield for canonical UI packages. Its architecture places generic components in `packages/ui/`, tokens in `packages/tokens/`, proven compositions in `packages/patterns/`, and uses Base UI for accessible interactive behaviour. This proposal preserves those boundaries.

## Goals

- Define reusable motion values and presets aligned with TeacherActive tokens.
- Let consuming teams opt into approved motion around existing UI.
- Add motion to selected shared components when animation is intrinsic to an interaction.
- Respect reduced motion and preserve keyboard, focus, screen-reader, forced-colour, and theme behaviour.
- Keep the public API vendor-neutral where practical and avoid spreading raw animation values across products.

## Non-goals

- Animate every shared component or add generic `animated` flags to components without demonstrated need.
- Replace Base UI interaction behaviour or use animation to communicate state by itself.
- Provide a general-purpose timeline/editor or expose every Motion API through the design system.
- Require Motion in applications that do not use animated components or wrappers.
- Establish product-specific animation or app-specific colour values in shared packages.

## Proposed architecture

### Motion tokens

Add motion tokens to `packages/tokens/` as semantic design-system values. The initial contract should cover a deliberately small set of durations, easing curves, and spatial distances, with naming based on intent rather than raw numbers. Initial values must be reviewed against actual component use before being fixed as public contract. Tokens may be represented in the package's existing CSS/typed-token formats, with a stable mapping available to runtime consumers.

Motion tokens describe timing and movement, not component behaviour. They must not encode app-specific colour or theme identity. App themes may override motion values only if the token contract explicitly allows it and accessibility validation remains intact; the default proposal is shared motion values across themes.

### Motion package and dependency boundary

Create `packages/motion/` as the optional home for approved React animation utilities, preset definitions, reduced-motion helpers, and compositional wrappers. It may depend on `packages/tokens/` and Motion for React. It must not depend on `packages/ui/`, applications, docs, or registry output.

`packages/ui/` may depend on the motion package only for selected components whose interaction animation is part of their expected behaviour. Basic components remain usable without importing the motion package. The package manifests and exports should make this optional boundary explicit. If implementation or bundling constraints make an optional peer dependency impractical, document and test the chosen dependency strategy before adoption.

Do not re-export the full Motion API. Expose TeacherActive-named, typed presets and wrappers, and keep vendor-specific details behind that boundary where possible. Advanced use cases can use Motion directly in consuming applications; they are outside the design-system guarantee.

### Presets and wrappers

Start with a small reviewed catalogue, such as fade, short vertical entrance, scale entrance, presence/exit, and child staggering. Exact names, parameters, and supported use cases are a follow-up implementation decision, validated against components and usage examples. Presets should consume motion tokens and avoid arbitrary per-call values by default.

Provide wrappers only where they give teams a coherent composition API, for example a reveal wrapper and a staggered-list wrapper. Wrappers must preserve the child element's semantics and refs as applicable, expose no confusing boolean-prop matrix, and avoid changing layout. Use composition patterns rather than adding animation props to unrelated components.

### Selected UI components

Built-in animation is appropriate for interaction-heavy components where entry/exit or state transition is part of expected behaviour, such as dialogs, popovers/menus, tooltips, toasts, accordions/collapsibles, and a tabs indicator. This list is a candidate set, not a commitment to implement all of them. Add animation only alongside the relevant component implementation and only when it works with Base UI's state, focus, dismissal, and presence lifecycle.

Do not add generic `animated` props to buttons, inputs, cards, or other components merely to create animated variants. Decorative motion belongs in opt-in wrappers or product composition until reuse justifies a pattern.

## Accessibility and interaction contract

- Respect `prefers-reduced-motion` globally and provide a deterministic reduced-motion behaviour for every preset and animated component. Reduced motion should remove or substantially minimize non-essential movement while preserving state changes and interaction feedback.
- Motion must never delay availability of controls, block dismissal, trap focus, or interfere with Base UI keyboard and focus behaviour.
- Overlays must retain correct focus entry, containment, Escape handling, and restoration regardless of animation completion or cancellation.
- Do not rely on motion, position, or transition alone to convey state. Ensure state is exposed semantically and visually without animation.
- Avoid large, continuous, parallax, or vestibular-triggering movement as defaults. Document any exceptional motion and its rationale.
- Verify keyboard interaction, screen-reader semantics, 200% zoom/text scaling, forced colours, and every registered theme for affected components.

## Documentation and distribution

Document motion foundations and guidance in `content/docs/` when the system is implemented. Each preset and animated component should state its purpose, reduced-motion behaviour, usage constraints, and whether it is opt-in or intrinsic. Update package exports, examples, registry metadata, and agent-readable component metadata together. Registry output remains generated from canonical package sources and must not become a second implementation source.

## Testing and release criteria

- Unit tests for preset configuration, token mapping, and reduced-motion behaviour.
- Integration tests for wrappers and animated Base UI components, including interrupted/cancelled transitions and controlled/uncontrolled state where applicable.
- Accessibility tests for normal and reduced-motion modes, keyboard use, overlay focus contracts, and all component states.
- Browser tests under normal and reduced-motion preferences; verify no interaction waits on animation completion.
- Theme/visual regression coverage for supported component states across registered themes.
- Bundle/dependency checks to ensure non-animated consumers do not pay an unintended runtime or bundle cost.
- Contract tests for stable exports, registry metadata, and generated distribution.

Follow `docs/standards/accessibility.md`, `docs/standards/component-authoring.md`, and `docs/standards/testing-and-evals.md` for the full applicable gates.

## Alternatives considered

1. **Motion directly in every UI component.** Rejected: it adds dependency and API weight even where animation is not intrinsic, and encourages decorative flags.
2. **A snippets-only animation catalogue.** Rejected: it leaves consistency, reduced-motion handling, and interaction integration to every consuming team.
3. **Motion as an optional layered capability.** Recommended: shared tokens and presets provide consistency, wrappers provide composition, and only selected components own intrinsic interaction motion.
4. **No animation dependency; CSS transitions only.** Viable for simple state transitions, but insufficient as the sole system if presence, sequencing, and reusable React composition are needed. Prefer CSS where it meets the interaction need; Motion adoption should be justified by component use cases and bundle analysis.

## Open decisions for implementation planning

- Confirm the exact Motion package/version and licensing/security review.
- Decide peer, optional peer, or direct dependency strategy based on workspace distribution and registry installation behaviour.
- Finalize token format and initial values against implemented components.
- Choose the first wrapper and first interaction component as a narrow pilot; do not commit to the full candidate list up front.
- Confirm public package naming and registry representation.

## Success measures

- Product teams can apply a small set of documented, accessible motion behaviours without inventing timing and easing values.
- Common interaction components have coherent transitions without compromising Base UI behaviour.
- Reduced-motion users receive the same functional information and controls without non-essential movement.
- Non-animated consumers do not incur unnecessary runtime cost, and the animation API remains small enough to maintain.
