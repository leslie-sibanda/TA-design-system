# Testing and Evaluation Standard

## Test-first development and CI/CD

Use TDD for behaviour changes: agree the public test boundary, observe one failing behaviour test, implement the minimal passing change, then repeat. Use the installed frontend skills for React performance, component composition, interface accessibility and documentation. These skills do not replace deterministic checks.

GitHub Actions must run lint, types, unit/integration tests, static-export contracts and browser/accessibility checks on pull requests and main. Test the actual Pages artifact under the configured project base path, not a Next.js development server. Only a successful main-branch verification may deploy that artifact. Follow [ADR-0006](../adr/ADR-0006-github-pages-static-deployment.md) for permissions and deployment boundaries.

Test WebMCP discovery and read-only retrieval where supported, plus ordinary HTTP documentation access without it. The external MCP server and its transport/build tests are deferred by ADR-0007. Do not disable contrast checks to accept the known white-on-orange design issue.

## Deterministic checks

- Type-check all packages and applications.
- Unit-test component state and utility logic.
- Integration-test Base UI wrappers and composed behaviour.
- Contract-test package exports, registry schemas, registry installation, static routes and WebMCP tool schemas.
- Run automated accessibility checks for every component state.
- Run browser tests for keyboard interaction, overlays, forms, responsive layout, and WebMCP fallbacks.
- Build the documentation site, packages, public agent records and registry payloads from a clean checkout.

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

