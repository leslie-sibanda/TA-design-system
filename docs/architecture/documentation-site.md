# Documentation-Site Architecture

## Purpose

The documentation site is the human and agent-readable catalogue for foundations, components, patterns, templates, themes, and contribution guidance. It is a consumer of canonical packages, not the owner of component implementations.

## Approved design and current state

The [site design record](../design/site-design-status.md) captures the approved visual direction, responsive behaviour and implementation gaps. The current site is a local HTML prototype, not a scaffolded Next.js application.

The primary audience is design and system owners. Use a plain standalone homepage without a sidebar or portal-card grid. Top navigation contains the symbol-only logo, Components, Pages, Styling and search. The homepage uses the full wordmark above its headline. Component documentation uses a flat alphabetical sidebar list without category subheadings.

Pages is the top-level destination for page examples and templates. Components is a separate catalogue and documentation destination. Other documentation remains discoverable within the documentation navigation.

## Information architecture

- **Getting started:** installation, package and registry consumption, first theme, and app setup.
- **Foundations:** brand language, colours, typography, spacing, radii, elevation, motion, icons, and accessibility.
- **Components:** generic controls grouped by capability.
- **Patterns:** proven compositions and workflow guidance.
- **Themes:** base TeacherActive theme, registered app themes, comparison, and theme-authoring guidance.
- **Templates:** optional application shells and page structures.
- **Contributing:** lifecycle, standards, testing, compatibility, and releases.

Styling is a lightweight component canvas with Customize and Copy actions. Controls are initially collapsed and adjust scoped preview tokens. It is not a dashboard for theme governance. Formal app-theme registration and full theme-lab checks remain separate from draft exploration.

## Hosting and delivery

[ADR-0006](../adr/ADR-0006-github-pages-static-deployment.md) selects GitHub Pages with Next.js static export. Pre-render documentation routes and generate search data and public agent files at build time. Browser search and WebMCP use those static records. Agents with HTTP access can retrieve Markdown and discovery files; an external MCP server is deferred under ADR-0007. Runtime server features are outside this hosting contract.

GitHub Actions must verify pull requests and deploy only the tested static artifact from main. Apply the installed frontend skills and TDD at the public behaviour boundaries defined in the scaffold plan.

## Page model

The production site will combine MDX guidance with live examples imported from canonical package source. Component pages place example code beneath the Overview preview, followed by usage guidance, states/accessibility and Reference. API tables and View Markdown / Copy Markdown actions belong in Reference.

The site generates search records, registry links, structured metadata and agent resources from the same content graph. Prototype component APIs remain illustrative until implemented and validated.

## Experience principles

- Use a calm documentation shell inspired by high-quality developer tools, with TeacherActive typography, colour, and icon treatment.
- Keep navigation predictable and code examples easy to copy.
- Let users switch app themes in previews without changing the documentation chrome unexpectedly.
- Reserve wave and triangle motifs for brand moments, section framing, and empty states.
- Preserve true white space, blue information hierarchy, and orange action emphasis from the brand guide.
- Support desktop and mobile navigation, keyboard search, deep links, reduced motion, and accessible code presentation.

## Agent surfaces

The accepted [component Markdown design contract](./component-markdown.md) defines View Markdown and Copy Markdown actions, public per-component Markdown URLs and shared read-only records for WebMCP. [ADR-0005](../adr/ADR-0005-webmcp-component-documentation.md) records why WebMCP is progressive enhancement rather than the only access mechanism. [ADR-0007](../adr/ADR-0007-static-agent-access-without-external-mcp.md) defers the external server. Production implementation is pending.

Every public page has a stable URL and structured metadata. Search, `llms.txt`, Markdown, WebMCP and registry files reference the same canonical component ID so human and agent navigation produce consistent results.

