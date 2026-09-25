# TA Design System Documentation and Agent Access Site

## Summary

Create a Next.js documentation site using Fumadocs, a TeacherActive-owned component system built on Base UI, and the shadcn registry format for distribution. Fumadocs provides the MDX documentation structure, navigation, search, and code examples. Shared component behaviour and APIs remain generic, while semantic token themes give each TeacherActive application its own visual treatment without forking component code.

The site will support two agent integration layers:

- **WebMCP:** browser agents can discover and use tools while viewing the site.
- **Static agent documentation:** agents with HTTP access can retrieve public component Markdown, `llms.txt` and approved metadata. [ADR-0007](./adr/ADR-0007-static-agent-access-without-external-mcp.md) defers the external MCP server.

The implementation remains greenfield. The repository contains architecture records, brand assets and an approved HTML design prototype, but no scaffolded Next.js app, canonical component implementation or working MCP/WebMCP service. See the [approved design and current status](./design/site-design-status.md) before implementation.

## Hosting and delivery decision

[ADR-0006](./adr/ADR-0006-github-pages-static-deployment.md) selects GitHub Pages. Build Next.js with static export, enumerate all public routes at build time and use client-side search over a generated index. All public asset and data URLs must respect the project base path. Route-handler examples below describe output contracts, not permission to require a runtime server; Markdown, registry and agent-discovery records must be emitted as static files.

Use the installed frontend skills and TDD. GitHub Actions verifies pull requests and deploys only the tested static artifact from main. No external MCP server is required in the initial scope; browser WebMCP remains progressive enhancement over static agent documentation. No CI workflow or deployed application exists yet.

## Core architecture

- Use the official Fumadocs Next.js starter as the documentation shell:

  ```bash
  npx create-fumadocs-app@latest
  ```

- Use Next.js App Router, TypeScript, Tailwind CSS v4, Base UI primitives, and the shadcn registry format.
- Use Base UI for accessible interactive behaviour, TeacherActive components for the public API and visual styling, and shadcn only as the installation/distribution mechanism. Do not copy shadcn's default appearance or make HeroUI a runtime dependency.

- Use the following AI-native SDLC repository structure:

  ```text
  TA-design-system/
  ├── README.md
  ├── AGENTS.md                         # Tool-neutral repository instructions
  ├── CLAUDE.md                         # Brief Claude-specific entry point
  ├── SECURITY.md                       # Reporting and security boundaries
  ├── .mcp.json                         # Deferred; do not create in initial scope
  ├── package.json
  ├── pnpm-lock.yaml
  ├── pnpm-workspace.yaml
  ├── turbo.json
  ├── components.json                   # shadcn project and registry configuration
  ├── registry.json                     # Public TeacherActive registry catalogue
  ├── next.config.ts
  ├── source.config.ts                  # Fumadocs content configuration
  ├── tsconfig.json
  │
  ├── .agents/                          # Tool-neutral reusable agent capabilities
  │   └── skills/
  │       ├── plan-component/
  │       │   └── SKILL.md
  │       ├── implement-component/
  │       │   └── SKILL.md
  │       ├── document-component/
  │       │   └── SKILL.md
  │       ├── review-component/
  │       │   └── SKILL.md
  │       └── release-registry/
  │           └── SKILL.md
  │
  ├── .claude/
  │   ├── settings.json                 # Shared permissions, hooks, and defaults
  │   ├── settings.local.json           # Personal overrides; gitignored
  │   ├── rules/
  │   │   ├── architecture.md
  │   │   ├── components.md
  │   │   ├── documentation.md
  │   │   ├── testing.md
  │   │   ├── accessibility.md
  │   │   └── security.md
  │   ├── skills/                       # Thin Claude entry points to canonical skills
  │   │   ├── plan-component/
  │   │   │   └── SKILL.md
  │   │   ├── implement-component/
  │   │   │   └── SKILL.md
  │   │   └── release-registry/
  │   │       └── SKILL.md
  │   └── agents/
  │       ├── planner.md
  │       ├── component-reviewer.md
  │       ├── accessibility-reviewer.md
  │       ├── qa.md
  │       └── security-reviewer.md
  │
  ├── content/                          # Content rendered by Fumadocs
  │   └── docs/
  │       ├── index.mdx
  │       ├── getting-started/
  │       ├── foundations/
  │       │   ├── colours.mdx
  │       │   ├── typography.mdx
  │       │   ├── spacing.mdx
  │       │   └── accessibility.mdx
  │       ├── themes/
  │       │   ├── overview.mdx
  │       │   ├── teacheractive.mdx
  │       │   ├── app-themes.mdx
  │       │   └── creating-a-theme.mdx
  │       ├── components/
  │       ├── patterns/
  │       ├── templates/
  │       └── contributing/
  │
  ├── docs/                             # Engineering and product source of truth
  │   ├── agent-ready-design-system-plan.md
  │   ├── product/
  │   │   ├── vision.md
  │   │   ├── requirements.md
  │   │   └── user-stories/
  │   ├── architecture/
  │   │   ├── overview.md
  │   │   └── decisions/
  │   │       └── ADR-0001-docs-registry-and-agent-architecture.md
  │   ├── design-system/
  │   │   ├── component-lifecycle.md
  │   │   ├── contribution-model.md
  │   │   └── versioning.md
  │   ├── security/
  │   │   ├── threat-model.md
  │   │   ├── data-classification.md
  │   │   └── abuse-cases.md
  │   └── operations/
  │       ├── deployment.md
  │       ├── observability.md
  │       └── rollback.md
  │
  ├── delivery/
  │   ├── backlog/
  │   ├── sprints/
  │   │   └── SPRINT-001/
  │   │       ├── brief.md              # Scope, user value, and exclusions
  │   │       ├── contract.md           # Acceptance and verification criteria
  │   │       ├── plan.md
  │   │       └── review.md             # Findings and their disposition
  │   ├── handoffs/
  │   │   └── current.md                # State, decisions, blockers, next action
  │   └── progress.md                   # Append-only delivery record
  │
  ├── apps/                             # Theme fixtures and integration examples
  │   ├── theme-lab/                    # Compare components across every app theme
  │   └── integration-fixtures/         # One minimal fixture per registered app theme
  │
  ├── packages/
  │   ├── ui/                           # Canonical generic component implementation
  │   │   └── src/
  │   │       ├── actions/
  │   │       ├── forms/
  │   │       ├── navigation/
  │   │       ├── data-display/
  │   │       ├── feedback/
  │   │       ├── overlays/
  │   │       ├── layout/
  │   │       └── index.ts
  │   ├── tokens/                       # Typed token contract and primitive values
  │   │   └── src/
  │   │       ├── primitive.css
  │   │       ├── semantic.css
  │   │       ├── component.css
  │   │       └── tokens.ts
  │   ├── themes/                       # Brand base plus app-level token mappings
  │   │   └── src/
  │   │       ├── teacheractive.css
  │   │       ├── apps/
  │   │       │   └── <app-id>.css
  │   │       ├── manifest.ts           # Registered theme IDs and metadata
  │   │       └── index.ts
  │   ├── icons/                        # Approved TeacherActive icon wrappers/assets
  │   ├── patterns/                     # Reusable product patterns, not primitives
  │   └── test-utils/                   # Shared render, a11y, and theme test helpers
  │
  ├── registry/                         # Registry manifests and generated payloads
  │   └── teacheractive/
  │       ├── items/                    # Metadata pointing to canonical package files
  │       ├── blocks/                   # Optional app and workflow compositions
  │       ├── themes/                   # Base and per-app installable themes
  │       └── registry.json             # Included by the root catalogue
  │
  ├── src/
  │   ├── app/                          # Next.js App Router routes
  │   │   ├── (docs)/
  │   │   ├── api/search/             # Build-time static index; no request-time search
  │   │   ├── r/[name]/route.ts         # Registry item JSON endpoints
  │   │   ├── llms.txt/route.ts
  │   │   └── llms-full.txt/route.ts
  │   ├── components/
  │   │   ├── docs/                     # Docs shell, previews, code blocks
  │   │   └── site/                     # Header, navigation, search, footer
  │   ├── lib/
  │   │   ├── registry/                 # Catalogue loading and validation
  │   │   ├── search/
  │   │   └── webmcp/                   # Feature detection and browser tools
  │   └── types/
  │
  ├── mcp/                             # Deferred architecture; do not scaffold initially
  │   ├── src/
  │   │   ├── server.ts                 # MCP server entry point
  │   │   ├── resources/                # Read-only resource handlers
  │   │   ├── tools/                    # Search and retrieval tools
  │   │   ├── policy/                   # Path allowlist and output controls
  │   │   └── schemas/                  # Tool input/output schemas
  │   ├── tests/
  │   └── README.md
  │
  ├── evals/
  │   ├── suites/
  │   │   ├── component-quality.yaml
  │   │   ├── documentation-grounding.yaml
  │   │   ├── registry-installation.yaml
  │   │   ├── static-agent-retrieval.yaml
  │   │   └── safety.yaml
  │   ├── tasks/                        # Inputs and expected outcomes
  │   ├── graders/                      # Deterministic and model-based graders
  │   ├── fixtures/
  │   ├── baselines/                    # Accepted reference measurements
  │   └── reports/                      # Generated and gitignored
  │
  ├── tests/
  │   ├── unit/
  │   ├── integration/
  │   ├── contract/                     # Registry, WebMCP, and static route contracts
  │   ├── accessibility/
  │   └── security/
  ├── e2e/                              # Browser and WebMCP journeys
  ├── public/                           # Logos, icons, fonts, and static assets
  │
  ├── scripts/
  │   ├── bootstrap
  │   ├── check
  │   ├── build-registry
  │   ├── validate-registry
  │   ├── eval
  │   └── release
  │
  └── .github/
      ├── CODEOWNERS
      ├── pull_request_template.md
      └── workflows/
          ├── verify.yml                # Types, lint, tests, build
          ├── registry.yml              # Registry build and install checks
          ├── evals.yml                 # Agent and retrieval evaluations
          ├── security.yml              # Dependency and policy checks
          └── release.yml               # Version and deployment workflow
  ```

### Repository ownership rules

- `packages/ui/` is the canonical implementation of generic components; documentation, fixtures, packages, and registry payloads all consume the same source.
- `packages/tokens/` defines the stable token contract. Components may consume semantic and component tokens, but never app-specific colour values.
- `packages/themes/` maps the token contract to the TeacherActive brand and each app. An app theme can change colour, typography, radius, density, elevation, and motion without changing component markup or behaviour.
- `packages/patterns/` contains reusable compositions. Business-specific workflows stay in their owning application unless at least two applications share the same contract.
- `registry/teacheractive/` describes installable components, patterns, and themes and points to canonical package files; generated registry payloads must never become a second editable source.
- `apps/theme-lab/` renders every component state across every supported app theme and is the visual-regression reference surface.
- `content/docs/` contains public product documentation rendered by Fumadocs.
- `docs/` contains product, architecture, security, and operational records used by people and agents.
- `.agents/skills/` contains canonical tool-neutral workflows. Claude-specific skills remain short adapters that point to the canonical process instead of maintaining a second implementation.
- `delivery/` records planned and completed work. Every implementation starts from a sprint brief and acceptance contract and ends with review findings and a current handoff.
- `evals/` measures whether agents can correctly discover, explain, install, and use components. It does not replace deterministic tests.
- `mcp/` and `.mcp.json` are deferred; do not scaffold them. Initial agents read approved static records through HTTP or feature-detected WebMCP.

## Design foundation and multi-app theming

### Foundation decision

- Build generic TeacherActive components on unstyled Base UI primitives. Base UI owns keyboard interaction, focus management, ARIA behaviour, positioning, and popup mechanics.
- Own the component API, styling, tokens, tests, documentation, and release lifecycle under the `@teacheractive` namespace.
- Use HeroUI as a quality reference for polished component anatomy, state coverage, documentation, and theme ergonomics. Do not inherit its default visual language, dependency graph, or component API.
- Use the shadcn registry schema and CLI for copy-into-project installation. Publish the same source as workspace/npm packages for applications that prefer managed shared dependencies.

### Brand translation

Translate the supplied 2025 TeacherActive brand guide into a digital interface system with these characteristics:

- True white and TeacherActive blue form the primary surfaces; orange is the decisive action and emphasis colour.
- Light blue, teal, yellow, and approved status colours support information hierarchy and feedback rather than competing with the primary palette.
- Typography uses the exact approved brand families and weights once font assets are available. Until then, fallback fonts are documented and treated as temporary.
- Headings are confident and compact, with blue headings and selective orange subheadings. Product UI uses a quieter scale than campaign graphics.
- Controls use clear borders, restrained radii, strong focus indicators, and minimal shadow. Avoid generic purple gradients, glass effects, and excessive floating cards.
- Curves, waves, and the TeacherActive triangle motif appear in page framing, empty states, feature areas, and selected brand moments. They are not applied to every control.
- Icons use the approved blue/orange treatment and consistent optical size. Generic icon libraries may provide geometry only when the result matches the brand icon rules.
- Photography and illustration follow the brand guide's education, people, diversity, and candid-workplace direction. Decorative assets remain separate from functional icons.

Readable labels in the supplied screenshots confirm TA Blue `#005292`, TA Orange `#F57D00` and the Arial typography direction. Do not sample rendered pixels to derive production tokens. Remaining palette details and clear-space rules still need verification. Supplied raster logos and provenance are recorded in the [asset inventory](./design/assets/README.md); use approved vector originals when available. The [design status](./design/site-design-status.md) records the white-on-orange contrast exception, accepted and confirmed by the design owner on 2026-09-25.

### Token model

Use three stable layers of CSS custom properties:

1. **Primitive tokens** define approved brand values such as palette steps, font families, spacing, radii, shadows, and motion durations.
2. **Semantic tokens** describe purpose, including `--surface`, `--surface-raised`, `--text`, `--text-muted`, `--border`, `--action`, `--focus-ring`, `--success`, `--warning`, and `--danger`.
3. **Component tokens** exist only when a component cannot be expressed cleanly through semantic tokens, such as `--button-primary-background` or `--dialog-shadow`.

Components consume semantic or component tokens only. App themes map those tokens under a root selector:

```html
<html data-ta-theme="client-portal" data-ta-mode="light">
```

Provide a typed `TeacherActiveThemeProvider` with this public contract:

```ts
const teacherActiveThemes = ["teacheractive", ...registeredAppThemes] as const;
type TeacherActiveTheme = (typeof teacherActiveThemes)[number];

type TeacherActiveMode = "light" | "dark" | "system";
```

The provider applies `data-ta-theme` and `data-ta-mode`, persists an allowed user preference when requested, and supports server-rendered initial values without a flash of the wrong theme. Dark mode is implemented only for apps that approve a complete accessible dark token set.

### Reuse and variation rules

- Keep component names and props generic: `Button`, `Select`, `Dialog`, `DataTable`, and `StatusBadge`, not `ClientPortalButton` or `CandidateDialog`.
- Express normal visual differences through tokens and documented variants such as `intent`, `size`, and `density`.
- Permit app-owned compositions around shared components. Do not add one-off app props to generic primitives.
- Fork a component only when an app requires materially different semantics or interaction behaviour. Record that decision in an ADR.
- Test every component against the base TeacherActive theme and all supported app themes in the theme lab.
- Maintain one accessibility contract across themes: focus visibility, target size, reduced motion, forced colours, text scaling, and contrast cannot be weakened by app overrides.

### Initial component scope

Build the library in capability layers:

- **Foundations:** theme provider, typography, icons, focus ring, visually hidden content, portal root, separators, and responsive layout utilities.
- **Actions:** button, icon button, button group, link, toggle, and toggle group.
- **Forms:** field, label, description, error, input, input group, textarea, checkbox, radio group, switch, select, combobox, autocomplete, date picker, time input, slider, and file upload.
- **Navigation:** tabs, breadcrumb, pagination, sidebar primitives, navigation menu, command menu, and step indicator.
- **Data display:** badge, status badge, avatar, card, list, table, data table, key-value list, metric, timeline, and calendar.
- **Feedback:** alert, toast, progress, spinner, skeleton, empty state, and validation summary.
- **Overlays:** dialog, alert dialog, drawer, sheet, popover, tooltip, hover card, dropdown menu, and context menu.
- **Layout:** container, stack, cluster, grid, panel, scroll area, collapsible, accordion, and resizable region.

Complex product features such as booking approval, vetting records, callback requests, candidate summaries, and financial dashboards are documented and distributed as optional patterns or blocks. They compose generic components and do not define the primitive API.

### Distribution contracts

Support both consumption models from the same source:

```ts
import { Button } from "@teacheractive/ui/button";
import { TeacherActiveThemeProvider } from "@teacheractive/themes";
import "@teacheractive/themes/apps/<app-id>.css";
```

```bash
pnpm dlx shadcn@latest add @teacheractive/button
pnpm dlx shadcn@latest add @teacheractive/theme-<app-id>
```

Workspace/npm packages provide controlled upgrades across known TeacherActive applications. Registry installation provides source ownership for standalone projects and agent-driven scaffolding. Both outputs must be generated and tested from `packages/` source in the same release.

## Documentation experience

Build a shadcn/Fumadocs-style documentation site following the [approved design](./design/site-design-status.md):

- A plain standalone homepage without a sidebar, with the full TeacherActive wordmark and two primary entry links.
- Top navigation with the icon-only logo, Components, Pages and search.
- A documentation sidebar with a flat alphabetical component list beneath Components; do not add component category subheadings.
- Search with keyboard shortcut support.
- Component pages containing purpose, usage guidance, live preview, installation command, source code, API/reference information, accessibility notes, variants, states, responsive examples, and related components. Place example code beneath the Overview preview and Markdown actions in Reference.
- Theme controls for light/dark mode if required by the TeacherActive brand.
- Copy buttons for imports, CLI commands, and source examples.
- A component index and searchable registry catalogue.
- Dedicated design-token pages for colour, typography, spacing, elevation, radii, and iconography.

Each custom component should have a matching documentation page and registry item. The docs page should use the same source files that the registry distributes so the examples cannot drift from the installable code.

Add a theme laboratory that switches between registered application themes and exposes colour, typography, spacing, radius, elevation, density, motion, focus, and component states. Changes made in the laboratory should export a reviewable token proposal rather than mutate production themes directly.

Use a typed component manifest to generate the component catalogue, documentation navigation, package exports, registry metadata, public agent records, status badges, and provenance details. Add stable `data-slot` markers to public component parts for styling, testing, debugging, and agent inspection.

## shadcn registry

Use the official registry format:

- Add a root `registry.json` and include item definitions from `registry/teacheractive/`.
- Publish a `registry:base` item with `extends: none` that pins Base UI, the TeacherActive token contract, theme provider, icon policy, utilities, and project configuration.
- Publish generic controls as `registry:ui`, reusable multi-file patterns as `registry:block`, and each app theme as `registry:theme`.
- Point registry file definitions to canonical files under `packages/`; generate deployable `/r/*.json` payloads during build.
- Include registry dependencies, npm dependencies, CSS variables, hooks, utilities, and related files where required.
- Validate the registry in CI with:

  ```bash
  pnpm dlx shadcn@latest registry validate
  ```

- Support installation such as:

  ```bash
  pnpm dlx shadcn@latest add @teacheractive/component-name
  ```

- Prefer a namespaced hosted registry once deployed:

  ```json
  {
    "registries": {
      "@teacheractive": "https://design.teacheractive.com/r/{name}.json"
    }
  }
  ```

The registry may also be consumed directly from the GitHub repository during development.

## Static agent access

Generate public component Markdown, discovery files and approved metadata at build time from canonical content. Agents with ordinary HTTP access can retrieve these without an open browser tab. Browser agents may use WebMCP while the site is open.

This is not an MCP transport. Agents that require an external MCP server are outside the initial integration scope. Do not build stdio or HTTP MCP transports, server packages or server-specific tests. Reconsider only for a concrete consuming-agent need under a new decision, as recorded in [ADR-0007](./adr/ADR-0007-static-agent-access-without-external-mcp.md).

## WebMCP browser integration

Add a WebMCP adapter to the documentation site, using feature detection so the site works normally in browsers without WebMCP. [ADR-0005](./adr/ADR-0005-webmcp-component-documentation.md) defines shared read-only component documentation retrieval, public Markdown fallbacks and the distinction from external MCP. Exact registration APIs must be verified during implementation.

Expose browser tools such as:

- `searchDocumentation`
- `listComponents`
- `getComponentDetails`
- `getComponentSource`
- `getInstallCommand`
- `getDesignToken`
- `openComponent`
- `copyInstallCommand`
- `copySourceExample`

Tools should return structured JSON and deep links into the documentation site. They should not expose arbitrary file reads or unrestricted code execution.

Expose approved read-only tools where browser support exists. Retrieval must not have hidden navigation, clipboard or write side effects. Any future state-changing capability requires a separate architecture and security decision; do not assume an external server will be built.

WebMCP is an emerging browser standard, so the implementation should be progressive and non-blocking. The site must remain fully usable when WebMCP is unavailable.

## Agent-friendly documentation

Add:

- `llms.txt` for a concise site map and usage instructions.
- `llms-full.txt` or an equivalent generated reference for the full component catalogue.
- Stable URLs for every component and token.
- Per-component Markdown URLs generated from canonical documentation and metadata, with View Markdown and Copy Markdown in each component's Reference section. See the [Markdown contract](./architecture/component-markdown.md).
- Machine-readable JSON endpoints for component metadata and registry items.
- Clear page titles, descriptions, headings, and semantic form controls.
- Examples that include complete imports and dependency requirements.
- Version metadata so agents can distinguish current and deprecated components.

## AI-native delivery workflow

Use one traceable delivery loop for human and agent contributions:

1. **Frame the work:** create a sprint `brief.md` describing the user value, scope, exclusions, and affected components.
2. **Lock the contract:** define observable acceptance criteria, accessibility expectations, registry output, documentation requirements, and verification commands in `contract.md`.
3. **Plan the change:** record the implementation sequence, dependencies, migration impact, and rollback approach in `plan.md`. Add an ADR only when the change alters a lasting architectural decision.
4. **Implement from canonical package source:** create or update generic behaviour in `packages/ui/`, tokens in `packages/tokens/`, and app mappings in `packages/themes/`. Registry payloads, previews, and examples must resolve from those files.
5. **Verify deterministically:** run formatting, types, unit tests, contract tests, accessibility checks, registry validation, production build, and applicable browser journeys through the shared `scripts/check` entry point.
6. **Run specialist review:** use the component, accessibility, QA, and security reviewer roles when their documented triggers apply. Record findings and dispositions in the sprint `review.md`.
7. **Run agent evaluations:** verify that supported agents can find the component, explain its intended use, retrieve its source, generate the correct install command, and avoid unsafe file access.
8. **Handoff or release:** update `delivery/handoffs/current.md` with state and next action, append the outcome to `delivery/progress.md`, then use the release workflow when all contract gates pass.

The repository instructions must define precedence clearly: the user request comes first, followed by `AGENTS.md`, path-scoped rules, the active sprint contract, and task-specific skill instructions. Generated reports and local overrides must remain outside version control.

## Testing and acceptance criteria

- The Fumadocs site builds successfully.
- Every registry item passes shadcn registry validation.
- The shared `scripts/check` command reproduces all required local verification without agent-specific commands.
- Every documented component has a working preview, source example, valid install command, and complete registry metadata.
- Agents can retrieve published Markdown and discovery files through HTTP without browser WebMCP support.
- WebMCP accepts only approved record IDs and rejects arbitrary path/URL retrieval.
- WebMCP tools are discoverable in a WebMCP-capable Chrome environment.
- The site remains usable when WebMCP is unavailable.
- Search returns both documentation pages and component registry items.
- Component source shown in the docs matches the source distributed by the registry.
- Package and registry installation produce equivalent component APIs and styling contracts.
- Every shared component renders its documented states in every supported app theme without component-level forks.
- Theme overrides pass contrast, focus visibility, forced-colours, reduced-motion, text-scaling, and keyboard checks.
- The theme lab discovers every registered app theme from the theme manifest and catches visual regressions across the full set.
- Desktop and mobile documentation layouts work correctly.
- Agents can determine what components exist, how to install a component, where its source lives, which dependencies it needs, and which variants and tokens it supports.
- Agent evals confirm that repository instructions, documentation, registry metadata, and component source agree on supported usage.
- A representative sprint can be traced from brief and contract through implementation, review, handoff, and release evidence.

## Assumptions

- The site will be the primary home for the TeacherActive design system.
- Base UI is the behavioural primitive layer; HeroUI is a design-quality reference only.
- The TeacherActive base theme provides the default experience, and each application opts into an explicit app theme.
- Shared components remain product-agnostic. App-specific workflows compose them locally or enter `packages/patterns/` only after demonstrated reuse.
- Custom components will be installable through a namespaced shadcn registry.
- Repository and component access for agents is read-only initially.
- WebMCP is an enhancement for browser-based agents, not the only integration.
- Authentication, private registry access, component publishing workflows, and write-capable agent actions are deferred until the read-only system is proven.
