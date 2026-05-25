# SplitEase — Tip Calculator & Bill Splitter

A single-screen tip calculator and bill splitter. Enter a bill, pick a tip, split by people — results update live as you type.

## How to run

### Option 1 — Open directly (no install needed)

Just open `index.html` in any modern browser:

```bash
open index.html         # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

### Option 2 — Local dev server (recommended)

If you have Node.js installed:

```bash
npx serve .
```

Then open [http://localhost:3000](http://localhost:3000).

Or with Python:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

### Option 3 — Deploy to Vercel

```bash
npm i -g vercel
vercel
```

## Stack

- **Vanilla HTML/CSS/JS** — zero dependencies, no build step
- Single `index.html` file — open and run anywhere

## Browser support

Any modern browser (Chrome, Firefox, Safari, Edge). Uses CSS custom properties and `color-mix()` for theming — no IE11 support.
