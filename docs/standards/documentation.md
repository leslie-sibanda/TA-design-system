# Documentation Standard

## Component page contract

Every stable component page includes:

- Purpose and when to use or avoid it.
- Live preview using canonical package source.
- Package and registry installation instructions.
- Basic usage with complete imports.
- Public API and default values.
- Variants, states, responsive behaviour, and theming guidance.
- Accessibility and keyboard behaviour.
- Error, empty, loading, disabled, and high-content examples where applicable.
- Related components and migration notes.

## Writing rules

- Describe user intent before implementation details.
- Use the same names as exported APIs and registry items.
- Keep examples executable and free of hidden dependencies.
- Use synthetic data and avoid real personal information.
- Mark experimental, preview, stable, and deprecated status clearly.
- Prefer one canonical explanation linked from other pages over duplicated guidance.

## Synchronisation

Docs, source, examples, registry metadata, MCP resources, and `llms.txt` indexes must be updated in the same change. CI should fail when a stable registry item lacks its required page or when documented examples no longer compile.

