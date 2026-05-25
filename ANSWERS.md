# ANSWERS.md

## 1. How to run

No install required. Open `index.html` directly in any modern browser:

```bash
open index.html
```

Or serve it locally with Node:

```bash
npx serve .
# → http://localhost:3000
```

Or Python:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

No build step, no dependencies, no package.json.

---

## 2. Stack & design choices

**Stack:** Vanilla HTML/CSS/JS, single file, zero dependencies. I chose this because the task is fundamentally a calculation UI — no routing, no state management, no server. A framework would add build tooling overhead for a problem that's just DOM manipulation and arithmetic. The result is something you can open directly from the filesystem with no setup at all.

**Two specific visual/interaction decisions:**

**Decision 1 — Dark result panel, light input panel.**
The two-column layout splits the screen into an input zone (light, open, editable) and a result zone (dark, resolved, final). This visual contrast does real work: it signals "this side is where you act, this side is where you read." The large per-person figure sits at ~60% of the result panel's height, making it unmissable on both desktop and mobile. I wanted the number to feel like a receipt printout — something you show someone — not just another data field. The dark background also creates a stable reading surface so the eye isn't distracted by the inputs while reading results.

**Decision 2 — Stepper buttons flanking the people field, rather than a plain number input.**
The number of people is almost always adjusted by ±1 (one more person just sat down, someone left). Tap targets solve this faster than keyboard entry, especially on mobile. The stepper integrates into the input's border so it reads as one cohesive control, not three separate things. Direct keyboard entry still works — the input sits between the buttons and is fully focusable — so power users can type "12" without tapping twelve times.

---

## 3. Responsive & accessibility

**360px phone vs. 1440px laptop:**
At ≤640px, the two-column layout collapses to a single column: inputs stacked above results. The result panel's per-person figure scales down via `clamp(3rem, 8vw, 4.5rem)` so it fits without horizontal scroll. Input fields remain 48px tall (comfortable touch targets). Card padding shrinks from 1.75rem to 1.25rem. The reset button stays full-width in both layouts.

At 1440px, the two-column grid expands to max-width 860px and centers on the page. The typographic hierarchy benefits from more breathing room — the display-font heading sits at ~3rem and the per-person figure at 4.5rem.

**Accessibility consideration I handled:**
All error messages use `role="alert"` and `aria-live="polite"`, so screen readers announce validation errors as they appear — without requiring focus to move to the error. Fields also get `aria-invalid="true"` when in error state and `aria-describedby` pointing to their error element. Preset buttons use `aria-pressed` to communicate toggle state. The stepper's `−` and `+` buttons have explicit `aria-label` attributes since their text content alone is ambiguous. Tab order follows visual reading order: bill → tip presets → custom tip → people stepper → reset.

**Accessibility consideration I skipped:**
I didn't implement a visible focus indicator on the preset buttons that's distinct enough for WCAG 2.1 AA (3:1 contrast ratio against adjacent colors). The `:focus-visible` ring is present but I didn't audit its contrast ratio in every theme/mode combination. With another day, I'd run the focus states through a contrast checker and possibly add an inset outline or offset ring with a guaranteed-compliant color.

---

## 4. AI usage

I used Claude (this model) throughout. Here's specifically where and what changed:

**Where AI helped:**
- Initial HTML structure and the CSS variable system for light/dark theming
- The `fmt()` locale-string formatter and number input `keydown` guard (blocking `e`, `+`, `-`)
- Drafting the `aria-live` / `aria-describedby` wiring

**One specific change I made to AI output:**
The AI initially generated the people field as a plain `<input type="number">` with browser default spin buttons (the ↑↓ arrows). I replaced this with a custom stepper that wraps the input with explicit `−` / `+` buttons sharing a unified border. The reason: browser spin buttons are tiny (often 8–10px wide), hidden on mobile, and don't work at all on iOS Safari by default. The custom stepper gives explicit 44px touch targets, hides the native arrows via `-webkit-appearance: none`, and keeps keyboard-accessible direct entry. The visual change also ties directly to the layout decision described in question 2 — the stepper reads as a single compound control rather than three isolated elements.

---

## 5. Honest gap

**The per-person rounding note is easy to miss.**
When the grand total doesn't divide evenly, the app shows a small note below the per-person figure: "3 of 6 pay Rs 250.01." This is correct and honest, but the note is small (0.75rem, muted color) and easy to overlook — especially on mobile where you might glance at the big number and hand your phone to a friend.

With another day, I'd redesign this into a small breakdown table inside the result panel: a two-row display showing "4 people × Rs 250.01" and "2 people × Rs 250.00" side by side. That makes the distribution visually scannable, removes ambiguity, and adds real utility when splitting with larger groups where the cent difference matters for who pays what.
