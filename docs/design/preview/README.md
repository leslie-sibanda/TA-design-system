# Approved design preview

This standalone HTML snapshot preserves the reviewed visual design. It is not the Next.js application or a production component implementation.

From the repository root, run:

```bash
python3 -m http.server 8080 --bind 127.0.0.1 --directory docs/design
```

Open `http://localhost:8080/preview/`. Logos load from the adjacent `assets/` directory. Hash links switch between preview pages. Clipboard actions depend on browser permissions; selectable Markdown remains available as a fallback.

The preview preserves the approved companion draft, `visual-design-v11.html`, with relative asset paths. It now also includes a accepted Styling playground at `#styling`, implemented in `styling.js` and `styling.css`. Local companion sessions, tokens and logs remain excluded from Git. Do not copy the monolithic HTML into the production application.

The Styling playground keeps drafts in memory. Following design feedback, it shows a component canvas with Customize and Copy actions. Customize reveals colour presets, a custom action colour, corner radius, shadow and reset controls. Copy exports draft CSS through the clipboard, with selectable text as a fallback. Contrast warnings stay in Customize and the exported CSS. The earlier comparison dashboard was removed. Presets are not registered app themes. The canvas uses prototype fixtures, not the actual component package, and CSS export does not apply changes to an app. Reloading clears edits.

Known limitations include illustrative APIs, static Tabs anatomy, incomplete component code examples, limited search and unverified browser interactions. White button text on brand orange fails AA contrast. See the [design status](../site-design-status.md) for the full decision record and remaining verification.
