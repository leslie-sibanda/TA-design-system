# Component Taxonomy

## Foundations

Theme provider, typography, icon wrappers, focus treatment, portals, separators, and layout utilities establish shared contracts used by all components.

## Generic components

Generic components are organised by capability:

- Actions: buttons, links, toggles, and button groups.
- Forms: fields, inputs, selection controls, date/time controls, and validation.
- Navigation: tabs, breadcrumbs, pagination, sidebars, menus, and steppers.
- Data display: badges, avatars, cards, lists, tables, metrics, timelines, and calendars.
- Feedback: alerts, toasts, progress, loading states, empty states, and validation summaries.
- Overlays: dialogs, drawers, sheets, popovers, tooltips, hover cards, and menus.
- Layout: containers, stacks, clusters, grids, panels, scroll areas, collapsibles, and resizable regions.

Generic components use product-neutral names and props. Visual differences are expressed through documented variants and tokens.

## Patterns

Patterns compose generic components into reusable workflows. Examples include filter toolbars, page headers, approval panels, booking summaries, callback forms, and financial tables. A pattern may understand a workflow, but it must not make assumptions about a specific backend.

## App features

Features containing application-specific business rules, permissions, data fetching, routing, or mutations remain in their application. The design system may document how those features compose shared components without owning their runtime logic.

## Blocks and templates

Registry blocks package optional multi-file compositions. Templates establish application shells or page structures. Neither is part of the stable primitive API unless promoted through an ADR.

