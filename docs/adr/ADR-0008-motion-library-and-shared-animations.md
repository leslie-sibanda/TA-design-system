# ADR-0008: Use Motion for shared animation, owned by this repository

- **Status:** Proposed
- **Date:** 2026-09-25
- **Design:** [Layered motion system design](../superpowers/specs/2026-09-25-layered-motion-system-design.md) holds the detailed architecture. This ADR records the decisions that are hard to reverse.

## Context

TeacherActive products need one motion language. Base UI ([ADR-0001](./ADR-0001-base-ui-foundation.md)) supplies behaviour and accessibility. Its popups animate with CSS transitions on `data-starting-style` and `data-ending-style`, which Base UI recommends because a transition can be cancelled midway. Base UI also supports JavaScript libraries such as Motion, through `keepMounted`, the `render` prop and `AnimatePresence`.

The [Motion Kit](https://github.com/TeacherActive/teacheractive-motion-kit) defines house motion with hand-written CSS keyframes. That covers simple transitions but gives apps no shared, tested implementation of presence and exit animation, springs, staggering, layout change or scroll-linked effects.

[Motion](https://motion.dev/) (npm `motion`, imported from `motion/react`) covers those needs. On 2026-09-25 npm listed version 13.4.4 under the MIT licence, with a peer range of React 18 or 19. Motion+ is a separate paid tier.

## Decision

Use Motion as the animation library for shared TeacherActive motion that CSS cannot express. This repository owns the shared implementation and its rules.

- **Layered and optional.** Add `packages/motion` (`@teacheractive/motion`, a private workspace package) as the only place that imports `motion`. Consumers see TeacherActive-named presets and wrappers, not the vendor API. `packages/ui` depends on it only for components whose interaction animation is intrinsic. Basic components work without it. A lint rule and a contract test enforce the import boundary.
- **CSS first.** Use CSS transitions on motion tokens for hover, press, colour changes and Base UI popup entry and exit. Use Motion for presence that CSS cannot handle, sequencing and stagger, springs, layout change, gestures and scroll-linked effects. Adopting Motion for a component needs a stated reason and a bundle check.
- **Tokens first.** Durations, easing and distances live in `packages/tokens`. The motion package reads the same values, and a test fails if they diverge. Seed values come from the Motion Kit (240ms entrance, 170ms exit, 160ms confirmation, easing `cubic-bezier(0.22, 0.9, 0.28, 1)`) and are confirmed against real components before they become public contract. Motion values are shared across themes by default. A theme may override them only if the token contract explicitly allows it and accessibility validation still passes.
- **Reduced motion is configured once.** The provider wraps the app in `MotionConfig` with `reducedMotion="user"`. Motion's default is `"never"`, so omitting this silently ignores the user's setting. Motion disables transform and layout animation under reduced motion but keeps opacity and colour animation. Every preset therefore defines a deterministic reduced variant that removes non-essential movement and preserves state changes and feedback.
- **Never gate the interaction.** Motion must not delay a control, block dismissal, trap focus or change Base UI keyboard and focus behaviour. Do not use motion alone to communicate state. Overlays keep correct focus entry, containment, Escape handling and restoration whether an animation completes or is cancelled.
- **Small by default.** Ship `m` with `LazyMotion` and `domAnimation`. Motion documents the full `motion` component at 34kb and `m` at about 4.6kb plus 15kb for `domAnimation`. Use `domMax` (+25kb, needed for layout animation and drag) only where a component needs it, and say so in its documentation.
- **Presentation only.** Motion animates styling. It does not change DOM structure, roles or focus order, in line with the [theme model](../domain/theme-model.md).
- **No gesture-only interaction.** Drag, swipe and long-press motion needs a tap or keyboard alternative.
- **Mobile is verified, not assumed.** Every preset and app example is checked at a phone viewport with touch input and reduced motion.
- **Free tier only.** Do not depend on Motion+ APIs or assets. A paid dependency needs a new ADR.
- **Distribution.** Nothing is published to npm ([ADR-0010](./ADR-0010-shadcn-registry-only-distribution.md)). Motion presets ship as a registry item that depends on the npm package `motion`. Only registry items for animated components list that item under `registryDependencies`, so a non-animated item never pulls in `motion`.
- **Narrow pilot.** Ship one wrapper and one intrinsic component first, then extend. The candidate list in the design is not a commitment.

## Considered options

- **CSS only, as the Motion Kit does today.** Zero JavaScript, and Base UI's preferred method for popups. It cannot do sequencing, springs, layout change or reusable React composition, so each app would rebuild those and behaviour would drift. It stays the default wherever it is enough.
- **Motion in every component.** Adds dependency and API weight where animation is not intrinsic and invites decorative flags.
- **Animation code inside each app.** No consistency, no single reduced-motion setting and no shared tests.

## Consequences

- Motion is a runtime dependency with lock-in, confined to `packages/motion`, so replacing it means changing one package.
- The dependency direction gains an optional edge from motion to shared UI. Non-animated consumers must not pay a runtime or bundle cost, and a check enforces it.
- Component pages document purpose, reduced-motion behaviour, constraints and whether motion is opt-in or intrinsic. A Motion foundations page is added under `content/docs/foundations/`.
- Verification adds: the import-boundary test, token-to-preset parity, preset unit tests for reduced variants, tests of interrupted and cancelled transitions, and Playwright runs with reduced motion on and off at desktop and phone viewports that confirm no interaction waits on an animation.
- Record a bundle-size budget for the docs site when the first preset ships.
- When the first animated component ships, widen the CI-only WebKit project beyond `smoke.spec.ts` to cover the mobile menu focus trap, search, and the responsive and reduced-motion checks. The local `mobile` project is Chromium emulation, so WebKit in CI is the only real Safari-engine coverage.

## Open items

- Pilot chosen on 2026-09-25: `Reveal` and staggered-list wrappers, Dialog on CSS only, and the Tabs sliding indicator as the Motion-inside-Base-UI case.
- Base UI detects the end of a Motion animation through `element.getAnimations()`, and needs a near-1 opacity such as `0.9999` if opacity is not animated. Prove the exit path with a test on the first overlay that uses Motion, including cancellation.
- Decide whether reduced-motion variants use an instant change or a short opacity fade. Validate on the pilot for contrast and comfort.
- This repository owns shared motion ([ADR-0009](./ADR-0009-canonical-home-for-shared-ui-and-motion.md)). The Motion Kit's hooks and keyframes are a reference.
