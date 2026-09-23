# Approved site design and implementation status

- **Recorded:** 2026-09-23
- **Design status:** Accepted visual direction following interactive review
- **Implementation status:** Next.js/Fumadocs static scaffold implemented on the implementation branch; shared components and agent exports remain pending

This record captures the agreed documentation-site design and the remaining implementation work. It supplements the [master plan](../agent-ready-design-system-plan.md) and [documentation-site architecture](../architecture/documentation-site.md). Design approval does not approve an unimplemented component API or waive release checks.

## Audience and structure

The primary audience is design and system owners. The site is a documentation portal, not a governance dashboard or marketing showcase. Engineers and agents must also be able to discover components, understand their contracts and retrieve examples.

Use neobrutalism.dev as a navigation and page-structure reference, and shadcn/Fumadocs as documentation-layout references. Do not adopt neobrutalist styling or replace the TeacherActive identity.

The agreed page structure is:

| Surface | Decision |
| --- | --- |
| Homepage, intended `/` | Standalone page without a documentation sidebar or portal-card grid |
| Top navigation | Icon-only TeacherActive logo linking home, Components, Pages, Styling and search |
| Homepage content | Large full TeacherActive wordmark above the headline, short introduction and two calls to action |
| Components, intended `/components` | Catalogue with links to component detail pages |
| Component sidebar | Components heading, All components link and a flat alphabetical component list; no Actions/Forms/Navigation/Feedback subheadings |
| Pages, intended `/pages` | Page examples and templates, separate from the component catalogue |
| Styling, intended `/styling` | Component canvas with Customize and Copy actions; controls stay collapsed initially |
| Other documentation | Getting started, foundations, themes, theme laboratory, registry/installation and contributing |

The prototype uses hash navigation, not production routes. Category labels in the catalogue can remain; the request to remove them applies to sidebar grouping.

## Visual decisions

Keep the site calm and predominantly white, with blue headings, neutral body text, restrained borders and limited decoration. Keep the approved homepage plain; do not add dashboards, floating-card grids or decorative brand shapes without another review.

Use these verified guide values and supplied assets:

- TA Blue: `#005292`
- TA Orange: `#F57D00`
- Arial body typography; Arial Bold / Arial Black heading direction, adapted to readable UI sizes rather than copied presentation point sizes
- Full wordmark: `assets/teacheractive-logo.png`, used prominently on the homepage
- Symbol-only icon: `assets/teacheractive-icon.png`, used in the navbar

Asset provenance, dimensions and limitations are recorded in the [asset inventory](./assets/README.md). The Canva icon replaced the manually extracted icon. The earlier screenshot wordmark is superseded by the supplied transparent wordmark. Do not stretch, recolour or recreate either logo.

The selected sidebar item uses a soft background without the solid blue inset stripe. The approved preview uses white text on the original orange button background, including hover; the darker orange proposal was rejected.

### Contrast decision resolved for implementation

White text on `#F57D00` has approximately **2.69:1** contrast. This fails WCAG AA for both normal text (4.5:1) and large text (3:1). The visual preference is recorded, but it is not a production accessibility exception.

On 2026-09-23, the design owner approved **brand orange with dark text** for the real application. Production uses `#182B3A` on `#F57D00`, approximately 5.43:1. The historical HTML prototype retains white labels and is not the production accessibility baseline. Automated homepage axe checks pass with the new pairing; full component and theme verification remains required.

## Component page layout

The current catalogue contains Alert, Button, Input and Tabs. Each has a detail page and links from the catalogue, desktop sidebar, mobile navigation and preview search.

Component pages use this hierarchy:

1. Name, purpose and lifecycle status
2. Overview with a visual example
3. Example source directly beneath the example, following the approved Button layout
4. Usage guidance
5. States and accessibility
6. Reference, including API documentation and View Markdown / Copy Markdown actions
7. Installation guidance

Button currently demonstrates code beneath its preview. Input, Tabs and Alert have guidance and state tables, but their source-example panels still need to follow that pattern. The previews are not implementations of the canonical shared components. Tabs explicitly shows static anatomy rather than functional tab behaviour.

### Proposed Button API

The accepted table layout has Prop, Type and Default columns. The displayed API remains proposed until implemented and validated against Base UI and the component-authoring standard.

| Prop | Proposed values | Default |
| --- | --- | --- |
| `variant` | `default`, `outline`, `ghost`, `destructive`, `secondary`, `link` | `default` |
| `size` | `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg` | `default` |

A link-styled Button still performs an action; navigation uses an actual link. Icon-only buttons need an accessible name. Resolve the relationship between this proposed `variant` API and the repository's semantic variant guidance before freezing exports.

## Responsive direction

Use one responsive design, not separate mobile and desktop applications. Preserve the approved desktop layout while adapting spacing and navigation:

- Compact phone header with icon, search and menu button
- Modal side navigation with close control, Escape dismissal and focus management
- Proportional homepage logo and responsive headline sizes
- Stacked, full-width homepage actions on phones
- Larger touch targets and single-column content at narrow widths
- Horizontally scrollable code and tables without widening the whole page
- Narrower sidebar and content spacing on tablets

The prototype switches to phone navigation at 760 CSS pixels and adjusts tablet layout through 1100 pixels. These are current design values, not immutable device categories. Test intermediate widths, text scaling, keyboard focus, reduced motion and forced colours during implementation.

## Accepted Styling playground

The simplified neobrutalism.dev-style workflow was accepted on 2026-09-23. Use a component canvas with Customize and Copy actions, not a persistent theme-management dashboard.

Customize reveals colour presets, a custom action colour, corner shape, shadow and reset controls. All preview components respond together through scoped tokens. Documentation navigation retains the TeacherActive theme. Keep contrast warnings inside Customize and in copied CSS, rather than displaying a large checks dashboard.

Copy produces draft CSS, with selectable text if clipboard access fails. Drafts remain in memory. Do not register themes, persist edits or mutate an application when experimenting. Presets are starting points, not approved app themes.

The initial comparison panel, app-ID form, typography/density controls and download workflow were removed from this surface after review. Formal theme registration and exhaustive theme-lab verification remain separate engineering capabilities, not requirements for this first Styling interface.

Current fixtures include actions, notifications, fields, activity, feedback, a slider and expandable content. These are prototype HTML, not released shared components. The real canvas must use canonical components and theme mappings.

## Markdown and agent access

Every component exposes View Markdown and Copy Markdown in its Reference section, not beside the page title. Markdown should include the same usage guidance, examples, API tables, status and limitations as the human documentation.

The prototype derives Markdown from displayed HTML and opens a dialog. Production will generate it from canonical documentation and metadata, with public `.md` URLs and read-only agent records. See the [Markdown contract](../architecture/component-markdown.md) and [WebMCP ADR](../adr/ADR-0005-webmcp-component-documentation.md).

## Prototype and verification state

The approved site baseline, `visual-design-v11.html`, is preserved as [`preview/index.html`](./preview/index.html), with relative links to the supplied assets. The accepted simplified Styling extension lives in `preview/styling.js` and `preview/styling.css`. Follow the [preview instructions](./preview/README.md) to serve it independently of the companion. This snapshot is design material, not canonical application source; this document is the durable decision record.

Working companion sessions are under `.superpowers/brainstorm/`. Local sessions contain tokens and runtime state and are excluded from Git.

A Superpowers visual-companion server serves the preview on a session-specific localhost port. It requires a session URL and stops after inactivity. Session keys and local browser links are not stable documentation URLs. Restarting the companion may create a new session directory; copy the latest HTML and assets when necessary.

Prototype checks were limited to JavaScript syntax, selected template rendering, served-content checks and contrast calculations. The visual direction was reviewed interactively. The implementation now has type, lint, unit, exported-artifact, accessibility and browser checks; see the [current handoff](../../delivery/handoffs/current.md) for the exact verified scope. Manual screen-reader review and a real GitHub deployment remain pending.

The Next.js/Fumadocs application includes the branded homepage, responsive navigation, static catalogue/detail routes and a generated static search index. Component pages clearly label proposed APIs rather than presenting them as released packages. Pages and Styling are honest placeholders. No shared component API, registry endpoint, Markdown HTTP endpoint, MCP server or WebMCP registration has been implemented. The historical prototype still uses its short preview search list and illustrative fixtures; its behaviour is not evidence of production functionality.

## Delivery requirements

Deploy the real site to GitHub Pages as a Next.js static export, as specified in [ADR-0006](../adr/ADR-0006-github-pages-static-deployment.md). Use the installed frontend skills, test-driven implementation and automated GitHub Actions verification/deployment. Static search and base-path handling are required. [ADR-0007](../adr/ADR-0007-static-agent-access-without-external-mcp.md) defers the external MCP server entirely; initial access is browser WebMCP plus public Markdown and `llms.txt`.

The [scaffold plan](../superpowers/plans/2026-09-23-nextjs-site-scaffold.md) includes these requirements. The implementation uses a small GitHub Actions caller with separate reusable verification and deployment workflows, as requested by the owner. Repository Pages configuration and an actual deployment have not been performed.

## Next implementation steps

1. Review the scaffold and run the GitHub workflow, including CI-only WebKit verification, before release.
2. Implement canonical Base UI components, confirm their APIs and replace proposal-only examples with live previews.
3. Build the scoped Styling canvas from those shared components and theme mappings.
4. Generate static Markdown and discovery records, then progressively enhance with read-only WebMCP tools. Do not build an external MCP server in the initial scope.
5. Add registry and component/theme release checks as those surfaces are implemented.
