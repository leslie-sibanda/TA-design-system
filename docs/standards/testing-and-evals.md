# Testing and Evaluation Standard

## Deterministic checks

- Type-check all packages and applications.
- Unit-test component state and utility logic.
- Integration-test Base UI wrappers and composed behaviour.
- Contract-test package exports, registry schemas, registry installation, routes, and MCP schemas.
- Run automated accessibility checks for every component state.
- Run browser tests for keyboard interaction, overlays, forms, responsive layout, and WebMCP fallbacks.
- Build the documentation site, packages, MCP server, and registry payloads from a clean checkout.

## Theme verification

The theme lab must render every documented component state across every registered theme. Capture stable visual baselines at agreed desktop and mobile viewports. Review intentional visual changes before updating baselines.

## Agent evaluations

Evaluate whether supported agents can:

- Find the correct component for a described need.
- Explain when to use it and identify relevant accessibility constraints.
- Retrieve canonical source and examples.
- Produce the correct package import or registry install command.
- Select and apply an app theme without editing component internals.
- Refuse requests for disallowed paths, secrets, or write operations.

Agent evaluations supplement deterministic tests and cannot override a failing type, behaviour, accessibility, security, registry, or build check.

## Release gate

A release requires all applicable deterministic checks, visual reviews, registry smoke tests, and agent evaluation thresholds to pass. Flaky checks must be fixed or explicitly quarantined with an owner and expiry date.

