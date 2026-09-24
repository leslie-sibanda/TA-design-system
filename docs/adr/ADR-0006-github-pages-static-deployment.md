# ADR-0006: Deploy the documentation site as a static GitHub Pages export

- **Status:** Accepted; external-MCP scope updated by [ADR-0007](./ADR-0007-static-agent-access-without-external-mcp.md)
- **Date:** 2026-09-23

## Context

The design owner selected GitHub Pages for the documentation site. Pages serves static assets, not a Next.js server. The existing scaffold plan assumed a server-capable deployment and must change before implementation.

## Decision

Keep Next.js App Router and Fumadocs, but build with `output: 'export'`. GitHub Actions verifies the project and deploys the resulting `out/` artifact to GitHub Pages. Test that exact artifact before uploading it; do not deploy a second, untested build.

Use `trailingSlash: true` so exported pages resolve through directory indexes. Disable Next.js runtime image optimisation (`images.unoptimized: true`) and serve the supplied logos locally. Generate all dynamic documentation routes at build time using the installed Next.js/Fumadocs static-generation APIs.

The default deployment is a project site for repository `leslie-sibanda/ta-design-system`, with base path `/ta-design-system`. The expected URL is `https://leslie-sibanda.github.io/ta-design-system/`; this is a target, not a claim that Pages has been configured. Derive and validate the build-time base path explicitly. A custom domain or repository rename requires rebuilding with the corresponding path configuration.

Navigation, images, client-side search fetches, downloadable Markdown and registry links must respect the base path. Do not use a single-page-app 404 redirect workaround: real exported pages must support direct visits and reloads.

## Static content and agent access

- Generate the Fumadocs search index during the build and use its supported client-side static search mode. Do not deploy the starter's request-time search endpoint unchanged.
- Emit component Markdown, `llms.txt`, metadata and registry JSON as public static files when their implementation slices are delivered. No request-time filesystem access is available on Pages.
- Generate `out/components/button.md` as a real file rather than relying on runtime routing. Pages controls HTTP content-type headers, so `text/markdown` cannot be guaranteed; verify readable UTF-8 content instead.
- Keep WebMCP as feature-detected browser code using public static records. It does not require a Pages backend.
- Defer the external MCP server under ADR-0007. Public Markdown and `llms.txt` serve agents with HTTP access; browser agents may use WebMCP. GitHub Pages does not host an MCP server.
- Do not add Server Actions, request-time rendering, authentication sessions, middleware, dynamic redirects or server-only APIs to this deployment.

The approved design prototype remains a reference, not the deployable application. Upload only the generated public site, never the repository, local `.superpowers` sessions, private engineering documents or credentials.

## CI/CD and permissions

Run automated verification on pull requests and pushes to `main`. Pull requests have read-only repository permissions and cannot deploy. Use `pull_request`, not `pull_request_target`, to test contributed code.

The verification job installs the pinned pnpm dependencies with a frozen lockfile, then runs lint, type checks, unit/integration tests, static export and browser/accessibility checks against that export. Run browser tests with the real project base path, including direct nested-route loads and search. Upload test reports on failure.

Deploy only after verification succeeds on a push to `main` or an authorised manual dispatch of `main`. A separate deploy job uses the `github-pages` environment and only the required `pages: write` and `id-token: write` permissions. Use supported official setup/configure/upload/deploy Pages actions; pin reviewed action revisions and document version updates.

Use deployment concurrency to avoid competing releases. Restrict the Pages environment to the intended branch. Enable required checks in branch protection where repository settings allow it. These repository settings and Pages source selection require owner access; adding a workflow does not configure them automatically.

Rollback means reverting the responsible change and redeploying a verified static artifact. Do not repair production by editing generated Pages output.

## Development and testing process

Use the installed React best-practices, composition-patterns, web-design-guidelines and writing-guidelines skills where applicable. Next.js server-specific optimisation advice does not override the static-host constraint.

Use test-driven development at agreed public boundaries: routes and navigation, component interactions, theme CSS export, static content contracts and read-only agent records. Implement one failing behavioural test and its minimal passing change at a time. Do not substitute snapshots of implementation details for observable behaviour.

Automated testing supplements visual, keyboard and screen-reader review. The existing white-on-orange contrast issue remains a release blocker; a green pipeline must not be manufactured by disabling contrast checks.

## Alternatives considered

- **Server-capable Next.js hosting:** supports runtime APIs, but does not meet the selected GitHub Pages deployment requirement.
- **Replace Next.js with another static-site framework:** possible, but unnecessary because the required initial documentation features can be exported statically.
- **Deploy the HTML design prototype:** rejected because it lacks canonical components, validated contracts and production verification.

## Verification and consequences

Static export constrains future features. Any feature needing private data, authentication or server computation requires an external service and a separate architecture/security decision.

CI must check base-path correctness, all generated component routes, exported search data, broken links and the actual static 404 behaviour. Future Markdown and registry tests must verify exported bytes and public URLs. Browser-tool discovery remains conditional on WebMCP support and is not guaranteed by hosting on Pages.

No Pages workflow or application export exists yet. This ADR sets the implementation contract.

## Sources

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Fumadocs static build](https://fumadocs.dev/docs/deploying/static)
- [Fumadocs Orama static search](https://fumadocs.dev/docs/headless/search/orama#static-export)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

Reviewed on 2026-09-23. Validate exact starter and action APIs during implementation.
