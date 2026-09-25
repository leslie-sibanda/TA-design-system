# Component Authoring Standard

## API design

- Use generic names and props based on user intent and component semantics.
- Prefer composition over app-specific flags.
- Keep controlled and uncontrolled state behaviour explicit and consistent.
- Forward refs where consumers require DOM access.
- Preserve native HTML semantics and form behaviour.
- Document defaults, variants, states, and unsupported combinations.

## Implementation

- Use Base UI primitives for supported interactive behaviour.
- Style through TeacherActive semantic or component tokens.
- Animate through `@teacheractive/motion` presets or the motion tokens. Give every animation a reduced-motion variant that reaches the same end state, and a non-gesture alternative for drag or swipe ([ADR-0008](../adr/ADR-0008-motion-library-and-shared-animations.md)).
- Use app themes for presentation differences and patterns for reusable workflows.
- Keep layout classes with the consumer when layout is not intrinsic to the component.
- Avoid hidden dependencies on app routing, data fetching, authentication, or global state.
- Export components through stable package subpaths and matching registry items.

## Variants

Use a small shared vocabulary where applicable:

- `intent`: visual/semantic purpose such as primary, secondary, danger, or neutral.
- `size`: supported control size.
- `density`: comfortable or compact information density.
- `state`: derived from component behaviour rather than manually styled by consumers.

Do not add a variant for a single screen. Add a theme token, compose a pattern, or keep the styling local to the application.

## Completion criteria

A component is incomplete without accessibility behaviour, theme coverage, tests, documentation, examples, package exports, registry metadata, and agent-readable metadata.

