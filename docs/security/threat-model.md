# Threat Model

## Protected assets

- Component and theme source integrity.
- Registry payload integrity and install commands.
- Documentation accuracy and provenance.
- Repository credentials, environment values, and unpublished assets.
- Consumer applications that install packages or registry items.

## Trust boundaries

- External content entering documentation, issues, examples, or agent prompts.
- Registry payloads crossing from the documentation service into consumer repositories.
- MCP clients requesting repository resources.
- WebMCP agents invoking page-scoped tools in a live browser session.
- CI publishing packages, registry files, or the documentation site.

## Principal threats

- Path traversal or over-broad MCP resource access.
- Prompt injection embedded in documentation or imported content.
- Malicious or accidental registry dependencies installing unexpected files.
- Generated payloads drifting from reviewed source.
- Cross-site scripting through MDX, examples, search indexes, or preview rendering.
- Secret disclosure through logs, build output, MCP responses, or client bundles.
- Supply-chain compromise of dependencies or publishing credentials.
- App theme overrides weakening focus, contrast, or status meaning.

## Required controls

- Deny-by-default path allowlists and schema validation for agent tools.
- Read-only MCP and WebMCP capabilities in the initial release.
- Sanitised MDX and isolated execution for interactive examples.
- Registry validation, dependency review, reproducible generation, and install smoke tests.
- Least-privilege CI credentials with protected release environments.
- Secret scanning and dependency/security checks in CI.
- Accessibility and visual checks for every registered theme.

## Deferred risks

Authenticated remote MCP, write-capable tools, automated publishing, and third-party registry submissions require separate threat modelling before implementation.

