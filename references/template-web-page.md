# Web Page Template

> **Canonical seed file:** `assets/seed-web-page.html`. Copy it, fill in placeholders.

Standalone interactive HTML page for viewing a reading in the browser.
Designed for sharing via link or local viewing — not for print.

## Web Page Structure

```html
<!DOCTYPE html>
<html lang="{language}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{question} — Lenormand Reading</title>
<style>
  :root {
    --bg: #faf9f5;
    --card: #ffffff;
    --text: #1a1a1a;
    --text-secondary: #6b6a64;
    --brand: #1B365D;
    --border: #e8e6dc;
    --positive: #E1F5EE;
    --positive-text: #085041;
    --negative: #FAECE7;
    --negative-text: #6B2F1A;
    --neutral: #EEEDFE;
    --neutral-text: #3C3489;
    --serif: "Chiron Sung HK WS", "Source Han Serif SC", "Noto Serif CJK SC", serif;
    --sans: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    line-height: 1.7;
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }
  header {
    text-align: center;
    padding: 4rem 0 3rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2.5rem;
  }
  header .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--brand);
    margin-bottom: 1rem;
  }
  header h1 {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 0.5rem;
  }
  header .date {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  .card-row {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin: 2rem 0;
  }
  .card-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 136px;
    border-radius: 8px;
    font-family: var(--serif);
  }
  .card-tile.positive { background: var(--positive); color: var(--positive-text); }
  .card-tile.negative { background: var(--negative); color: var(--negative-text); }
  .card-tile.neutral  { background: var(--neutral);  color: var(--neutral-text); }
  .card-tile .num { font-size: 1.8rem; font-weight: 600; }
  .card-tile .name { font-size: 0.75rem; margin-top: 0.3rem; }
  .card-tile .pos { font-size: 0.65rem; color: var(--text-secondary); margin-top: 0.5rem; }
  .chapter {
    margin: 3rem 0;
    padding: 2rem;
    background: var(--card);
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .chapter h2 {
    font-family: var(--serif);
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--brand);
    margin-bottom: 1.2rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  .chapter p {
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.8;
    text-align: justify;
  }
  .combo {
    margin: 1.2rem 0;
    padding: 1rem 1.2rem;
    background: #f7f6f0;
    border-left: 3px solid var(--brand);
    border-radius: 0 6px 6px 0;
  }
  .combo .label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--brand);
    margin-bottom: 0.4rem;
  }
  .takeaway {
    margin-top: 1.5rem;
    padding: 1rem 1.2rem;
    background: var(--brand);
    color: #f5f4ed;
    border-radius: 8px;
    font-size: 0.95rem;
  }
  .summary {
    text-align: center;
    font-family: var(--serif);
    font-size: 1.2rem;
    color: var(--brand);
    padding: 2rem;
    margin: 2rem 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  footer {
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.8rem;
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
  }
</style>
</head>
<body>
  <header>
    <div class="label">{spread_label}</div>
    <h1>{question}</h1>
    <div class="date">{date}</div>
  </header>

  <div class="card-row">
    <!-- Repeat .card-tile for each card -->
  </div>

  <div class="summary">{one_line_summary}</div>

  <!-- Repeat .chapter for each interpretation chapter -->

  <footer>
    Lenormand Reading · Stargazer Interpreter · Generated {generated_at}
  </footer>
</body>
</html>
```

## Web Page Rendering Rules

- Use `sections[].content` from chapters — each paragraph gets its own `<p>` tag
- `combination` sections render as `.combo` blocks with the `.label` showing the card pair name
- `takeaway` sections render as `.takeaway` blocks
- Cards are rendered in text mode (no SVG)
- The page is fully self-contained — no external dependencies

---
