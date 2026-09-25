# Layered Motion System Design

## Status

Draft for review. This document proposes an architecture; it does not authorize implementation or dependency installation.

The decisions that are hard to reverse are recorded separately and take precedence over this document where they differ:

- [ADR-0008](../../adr/ADR-0008-motion-library-and-shared-animations.md): Motion as the animation library, owned here.
- [ADR-0009](../../adr/ADR-0009-canonical-home-for-shared-ui-and-motion.md): this repository is the canonical home for shared UI and motion.
- [ADR-0010](../../adr/ADR-0010-shadcn-registry-only-distribution.md): distribution through the shadcn registry only.

## Context and intent

TeacherActive is building a shared, generic component system for multiple applications. The system should provide more value than a catalogue of animation snippets: teams need a small, approved vocabulary of motion, composable ways to apply it, and polished animation for interaction patterns where motion is part of the component experience.

Motion for React (`motion` from Motion, documented at https://motion.dev/docs/react) is the chosen implementation dependency under ADR-0008. On 2026-09-25 npm listed version 13.4.4 under the MIT licence, with a peer range of React 18 or 19. TeacherActive must own the public API, accessibility contract, token mapping, documentation, and release boundaries rather than exposing the vendor API as its design-system contract.

The [Motion Kit](https://github.com/TeacherActive/teacheractive-motion-kit) is the reference for house motion values and per-component intent. It is a design source, not a second implementation, and its decisions do not bind this repository.

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

Seed values come from the Motion Kit: 240ms entrance, 170ms exit, 160ms confirmation, and easing `cubic-bezier(0.22, 0.9, 0.28, 1)`. Treat them as a starting point to validate against implemented components, not as fixed contract. The motion package must read the same values the CSS tokens declare, with a test that fails when the two drift.

Motion tokens describe timing and movement, not component behaviour. They must not encode app-specific colour or theme identity. App themes may override motion values only if the token contract explicitly allows it and accessibility validation remains intact; the default proposal is shared motion values across themes.

### Motion package and dependency boundary

Create `packages/motion/` as the optional home for approved React animation utilities, preset definitions, reduced-motion helpers, and compositional wrappers. It may depend on `packages/tokens/` and Motion for React. It must not depend on `packages/ui/`, applications, docs, or registry output.

`packages/ui/` may depend on the motion package only for selected components whose interaction animation is part of their expected behaviour. Basic components remain usable without importing the motion package. The package manifests and exports should make this optional boundary explicit.

The dependency strategy follows from registry-only distribution (ADR-0010). `packages/motion` is a private workspace package, never published. The presets ship as a registry item that declares the npm package `motion` as a dependency. Only registry items for animated components list that item under `registryDependencies`, so installing a non-animated component never pulls Motion into a consuming project. A lint rule and a contract test enforce that `motion` is imported in `packages/motion` and nowhere else.

Do not re-export the full Motion API. Expose TeacherActive-named, typed presets and wrappers, and keep vendor-specific details behind that boundary where possible. Advanced use cases can use Motion directly in consuming applications; they are outside the design-system guarantee.

### Choosing CSS or Motion

CSS is the default. Reach for Motion only when CSS cannot express the need.

Use CSS transitions on motion tokens for hover, press, colour and size changes, and for Base UI popup entry and exit. Base UI popups expose `data-starting-style` and `data-ending-style`, and Base UI recommends CSS transitions for them because a transition can be cancelled cleanly midway when a user interrupts it.

Use Motion for presence that CSS cannot handle on its own, sequencing and child staggering, spring physics, layout change, gestures, and scroll-linked effects.

Base UI does support Motion for popups: keep the popup mounted with `keepMounted` on `<Portal>`, compose through the `render` prop, and drive presence with `<AnimatePresence>` and a controlled `open` state. Base UI detects the end of an animation through `element.getAnimations()` and watches opacity, so a Motion animation that does not animate opacity needs a near-1 value such as `0.9999` to be detected. For manual control, pass `actionsRef` to the root and call `actionsRef.current.unmount()` from Motion's `onAnimationComplete`. Any component taking this route must prove exit and cancellation with a test.

Adopting Motion for a component needs a stated reason and a bundle check, recorded on that component's page.

### Presets and wrappers

Start with a small reviewed catalogue, such as fade, short vertical entrance, scale entrance, presence/exit, and child staggering. Exact names, parameters, and supported use cases are a follow-up implementation decision, validated against components and usage examples. Presets should consume motion tokens and avoid arbitrary per-call values by default.

Provide wrappers only where they give teams a coherent composition API, for example a reveal wrapper and a staggered-list wrapper. Wrappers must preserve the child element's semantics and refs as applicable, expose no confusing boolean-prop matrix, and avoid changing layout. Use composition patterns rather than adding animation props to unrelated components.

Presets ship `m` with `LazyMotion` and the `domAnimation` feature set by default. Motion documents the full `motion` component at 34kb against roughly 4.6kb for `m` plus 15kb for `domAnimation`. `domMax` adds about 25kb and is required for layout animation and drag; use it only for a component that needs it, and say so on that component's page.

### Selected UI components

Built-in animation is appropriate for interaction-heavy components where entry/exit or state transition is part of expected behaviour, such as dialogs, popovers/menus, tooltips, toasts, accordions/collapsibles, and a tabs indicator. This list is a candidate set, not a commitment to implement all of them. Add animation only alongside the relevant component implementation and only when it works with Base UI's state, focus, dismissal, and presence lifecycle.

Do not add generic `animated` props to buttons, inputs, cards, or other components merely to create animated variants. Decorative motion belongs in opt-in wrappers or product composition until reuse justifies a pattern.

### Deliberately still

Some things must not move, and that is a design decision rather than an omission. Status metadata — badges, status pills, risk and priority markers, chips — stays still so a glance reads the state, not the movement. Value atoms such as money amounts, dates and deltas stay still too: the Motion Kit rejected animating a changing figure on payroll numbers, because a number that visibly rolls reads as uncertainty. Where a component is deliberately still, say so on its page and in a code comment, so the next person does not read it as missing work.

## Accessibility and interaction contract

- Respect `prefers-reduced-motion` globally and provide a deterministic reduced-motion behaviour for every preset and animated component. Reduced motion should remove or substantially minimize non-essential movement while preserving state changes and interaction feedback.
- Motion must never delay availability of controls, block dismissal, trap focus, or interfere with Base UI keyboard and focus behaviour.
- Overlays must retain correct focus entry, containment, Escape handling, and restoration regardless of animation completion or cancellation.
- Do not rely on motion, position, or transition alone to convey state. Ensure state is exposed semantically and visually without animation.
- Avoid large, continuous, parallax, or vestibular-triggering movement as defaults. Document any exceptional motion and its rationale.
- Verify keyboard interaction, screen-reader semantics, 200% zoom/text scaling, forced colours, and every registered theme for affected components.
- Configure reduced motion once, in the provider, with Motion's `MotionConfig reducedMotion="user"`. Motion's own default is `"never"`, so leaving it unset silently ignores the user's setting. Under reduced motion Motion drops transform and layout animation but keeps opacity and colour, so every preset still declares what it does rather than relying on that default.
- Every drag, swipe or long-press interaction needs a tap or keyboard alternative. A gesture is never the only way to reach a behaviour.
- Verify motion at a phone viewport with touch input, not only at desktop width. Presets that behave differently on a phone document how.

## Documentation and distribution

Document motion foundations and guidance in `content/docs/` when the system is implemented. Each preset and animated component should state its purpose, reduced-motion behaviour, usage constraints, and whether it is opt-in or intrinsic. Update package exports, examples, registry metadata, and agent-readable component metadata together. Registry output remains generated from canonical package sources and must not become a second implementation source.

## Testing and release criteria

- Unit tests for preset configuration, token mapping, and reduced-motion behaviour.
- Integration tests for wrappers and animated Base UI components, including interrupted/cancelled transitions and controlled/uncontrolled state where applicable.
- Accessibility tests for normal and reduced-motion modes, keyboard use, overlay focus contracts, and all component states.
- Browser tests under normal and reduced-motion preferences; verify no interaction waits on animation completion. Run them with forced colours, and at desktop and phone viewports with touch. Fail on console errors and sideways page overflow.
- Real Safari-engine coverage for animated components. The local `mobile` Playwright project is an iPhone profile running on Chromium, so WebKit in CI is the only WebKit we have. Today it runs `smoke.spec.ts` alone; widen it when the first animated component ships to cover the focus trap, search, responsive and reduced-motion specs.
- Theme/visual regression coverage for supported component states across registered themes.
- Bundle/dependency checks to ensure non-animated consumers do not pay an unintended runtime or bundle cost.
- Contract tests for registry metadata and generated distribution, plus the registry smoke test that installs items into a clean project and builds it.
- Token-to-preset parity: a test that fails when a preset's timing stops matching the token it claims to use.

Follow `docs/standards/accessibility.md`, `docs/standards/component-authoring.md`, and `docs/standards/testing-and-evals.md` for the full applicable gates.

## Alternatives considered

1. **Motion directly in every UI component.** Rejected: it adds dependency and API weight even where animation is not intrinsic, and encourages decorative flags.
2. **A snippets-only animation catalogue.** Rejected: it leaves consistency, reduced-motion handling, and interaction integration to every consuming team.
3. **Motion as an optional layered capability.** Recommended: shared tokens and presets provide consistency, wrappers provide composition, and only selected components own intrinsic interaction motion.
4. **No animation dependency; CSS transitions only.** This is what the Motion Kit does today, and it is Base UI's own preference for popups. It costs no JavaScript and cancels cleanly, but it cannot express sequencing, springs, layout change or reusable React composition, so each product would rebuild those and drift apart. CSS therefore stays the default for everything it can do, and Motion adoption is justified per component by use case and bundle analysis.

## Proposed pilot

Prove the layering on three pieces of work before extending the catalogue:

1. **A `Reveal` wrapper and a staggered list, built with Motion.** These exercise presets, token mapping, the reduced-motion variant and the bundle boundary, without touching Base UI's presence lifecycle.
2. **Dialog, built on CSS tokens with no Motion.** This proves the CSS-first path on the component Base UI most expects to be animated that way, and keeps the overlay focus contract out of the vendor's hands.
3. **One Motion-inside-Base-UI component, chosen from toasts or the tabs indicator.** This is where the `keepMounted` / `AnimatePresence` / `getAnimations()` path gets proven, including cancellation.

Take them in that order. Each step should answer whether the next one is still the right shape.

## Open decisions for implementation planning

- Finalize token format and initial values against implemented components.
- Decide whether a reduced-motion variant is an instant state change or a short opacity fade. Validate on the pilot for both contrast and comfort.
- Decide the versioning and changelog convention for registry items, since the shadcn format has no package-style version resolution (ADR-0010).
- Confirm which of the candidate interaction components genuinely need Motion once Dialog has been built on CSS.

Resolved since the first draft: the package and version (`motion` 13.4.4, MIT), the dependency strategy (private workspace package plus a registry item), and public naming and registry representation (`packages/motion`, distributed as a registry item, nothing published to npm).

## Success measures

- Product teams can apply a small set of documented, accessible motion behaviours without inventing timing and easing values.
- Common interaction components have coherent transitions without compromising Base UI behaviour.
- Reduced-motion users receive the same functional information and controls without non-essential movement.
- Non-animated consumers do not incur unnecessary runtime cost, and the animation API remains small enough to maintain.
