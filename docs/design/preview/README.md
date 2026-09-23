# Approved design preview

This standalone HTML snapshot preserves the reviewed visual design. It is not the Next.js application or a production component implementation.

From the repository root, run:

```bash
python3 -m http.server 8080 --bind 127.0.0.1 --directory docs/design
```

Open `http://localhost:8080/preview/`. Logos load from the adjacent `assets/` directory. Hash links switch between preview pages. Clipboard actions depend on browser permissions; selectable Markdown remains available as a fallback.

The snapshot preserves the latest companion draft, `visual-design-v11.html`, with relative asset paths. Local companion sessions, tokens and logs remain excluded from Git. Do not copy the monolithic HTML into the production application.

Known limitations include illustrative APIs, static Tabs anatomy, incomplete component code examples, limited search and unverified browser interactions. White button text on brand orange fails AA contrast. See the [design status](../site-design-status.md) for the full decision record and remaining verification.
