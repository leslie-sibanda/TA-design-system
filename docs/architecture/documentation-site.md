# Documentation-Site Architecture

## Purpose

The documentation site is the human and agent-readable catalogue for foundations, components, patterns, templates, themes, and contribution guidance. It is a consumer of canonical packages, not the owner of component implementations.

## Information architecture

- **Getting started:** installation, package and registry consumption, first theme, and app setup.
- **Foundations:** brand language, colours, typography, spacing, radii, elevation, motion, icons, and accessibility.
- **Components:** generic controls grouped by capability.
- **Patterns:** proven compositions and workflow guidance.
- **Themes:** base TeacherActive theme, registered app themes, comparison, and theme-authoring guidance.
- **Templates:** optional application shells and page structures.
- **Contributing:** lifecycle, standards, testing, compatibility, and releases.

## Page model

Component pages combine MDX guidance with live examples imported from canonical package source. The site generates search records, registry links, structured metadata, and agent resources from the same content graph.

## Experience principles

- Use a calm documentation shell inspired by high-quality developer tools, with TeacherActive typography, colour, and icon treatment.
- Keep navigation predictable and code examples easy to copy.
- Let users switch app themes in previews without changing the documentation chrome unexpectedly.
- Reserve wave and triangle motifs for brand moments, section framing, and empty states.
- Preserve true white space, blue information hierarchy, and orange action emphasis from the brand guide.
- Support desktop and mobile navigation, keyboard search, deep links, reduced motion, and accessible code presentation.

## Agent surfaces

Every public page has a stable URL and structured metadata. Search, `llms.txt`, MCP, WebMCP, and registry endpoints reference the same canonical component ID so human and agent navigation produce consistent results.

