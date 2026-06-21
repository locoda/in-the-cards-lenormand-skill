# Social Card Template — 1080×1440

> **Canonical seed file:** `assets/seed-social-card.html`. Copy it, fill in placeholders, render.

1080×1440 (3:4) carousel image set for Xiaohongshu / Rednote.
Built as single-file HTML with `.poster.xhs` sections, then captured as PNG via Playwright.

## Social Card Structure

```html
<!DOCTYPE html>
<html lang="{language}" data-theme="ink-classic">
<head>
<meta charset="UTF-8">
<style>
  /* Font loading — MUST include for Chiron Sung HK to render */
  @import url('https://cdn.jsdelivr.net/npm/chiron-sung-hk-webfont@latest/css/vf.css');

  :root {
    --bg: #faf8f3;
    --text: #1a1a1a;
    --brand: #1B365D;
    --border: #e0ddd3;
    --positive: #E1F5EE; --positive-text: #085041;
    --negative: #FAECE7; --negative-text: #6B2F1A;
    --neutral: #EEEDFE;  --neutral-text: #3C3489;
    --serif: "Chiron Sung HK WS", "Source Han Serif SC", "Noto Serif CJK SC", serif;
    --sans: -apple-system, "PingFang SC", sans-serif;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .poster.xhs {
    width: 1080px;
    height: 1440px;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* Cover page (page 1) */
  .cover-page {
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 120px 80px;
  }
  .cover-page .spread-badge {
    font-size: 28px;
    letter-spacing: 6px;
    color: var(--brand);
    text-transform: uppercase;
    margin-bottom: 40px;
    font-family: var(--sans);
  }
  .cover-page h1 {
    font-family: var(--serif);
    font-size: 72px;
    font-weight: 500;
    line-height: 1.25;
    color: var(--text);
    margin-bottom: 30px;
  }
  .cover-page .date {
    font-size: 32px;
    color: #999;
    font-family: var(--sans);
    margin-bottom: 60px;
  }
  .cover-page .cards-preview {
    font-family: var(--serif);
    font-size: 48px;
    color: var(--brand);
    letter-spacing: 4px;
    margin-bottom: 20px;
  }
  .cover-page .cards-names {
    font-size: 28px;
    color: #888;
    font-family: var(--sans);
  }

  /* Content page (page 2+) */
  .content-page {
    padding: 100px 80px;
    justify-content: flex-start;
  }
  .content-page h2 {
    font-family: var(--serif);
    font-size: 48px;
    font-weight: 500;
    color: var(--brand);
    margin-bottom: 50px;
    border-bottom: 2px solid var(--border);
    padding-bottom: 20px;
  }
  .content-page .body-text {
    font-family: var(--serif);
    font-size: 32px;
    line-height: 1.7;
    color: var(--text);
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .content-page .body-text p { margin: 0; }
  .content-page .combo-block {
    background: #f3f1e9;
    border-left: 4px solid var(--brand);
    padding: 24px 32px;
    margin: 20px 0;
    border-radius: 0 8px 8px 0;
  }
  .content-page .combo-block .pair-name {
    font-size: 28px;
    font-weight: 600;
    color: var(--brand);
    margin-bottom: 12px;
    font-family: var(--sans);
  }
  .content-page .combo-block .pair-text {
    font-size: 30px;
    color: var(--text);
    font-family: var(--serif);
  }
  .content-page .insight-box {
    background: var(--brand);
    color: #f5f4ed;
    padding: 32px 36px;
    border-radius: 12px;
    margin-top: 40px;
    font-family: var(--serif);
    font-size: 30px;
    line-height: 1.6;
  }

  /* SVG Card faces on cover */
  .cover-cards-row {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 24px;
  }
  .cover-card-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .cover-card-svg {
    border-radius: 8px;
  }
  .cover-card-name {
    font-family: var(--serif);
    font-size: 24px;
    color: var(--text);
    font-weight: 500;
  }
  .cover-card-pos {
    font-family: var(--sans);
    font-size: 20px;
    color: #aaa;
  }

  /* SVG card sizes for 3:4 social card */
  /* 3-card spread: 180×270px per card */

  /* Content page card references (compact SVG strip) */
  .card-svg-strip {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    align-items: center;
  }

  /* Footer band */
  .footer-band {
    position: absolute;
    bottom: 60px;
    left: 80px;
    right: 80px;
    font-size: 24px;
    color: #bbb;
    text-align: center;
    font-family: var(--sans);
  }

  /* Page separator for HTML preview */
  .page-break { width: 100%; height: 40px; }
</style>
</head>
<body>
<!-- Page 1: Cover -->
<section class="poster xhs cover-page">
  <!-- Hidden SVG defs (deduped for all inline SVGs) -->
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <pattern id="g" width="72" height="72" patternUnits="userSpaceOnUse">
        <path d="M72 0L72 72M0 72L72 72" fill="none" stroke="#7A8B7A" stroke-width="0.3" opacity=".12"/>
      </pattern>
      <pattern id="sg" width="18" height="18" patternUnits="userSpaceOnUse">
        <path d="M18 0L18 18M0 18L18 18" fill="none" stroke="#7A8B7A" stroke-width="0.2" opacity=".06"/>
      </pattern>
    </defs>
  </svg>

  <div class="spread-badge">{spread_label}</div>
  <h1>{question_or_title}</h1>
  <div class="date">{date_display}</div>

  <div class="cover-cards-row">
    <!-- Repeat for each card: -->
    <div class="cover-card-wrap">
      <svg class="cover-card-svg" viewBox="0 0 1024 1536" width="180" height="270">
        <!-- inline SVG from cards/card-NN-slug.svg, strip <defs> -->
      </svg>
      <span class="cover-card-name">{name_zh}</span>
      <span class="cover-card-pos">{position_label}</span>
    </div>
  </div>

  <div class="footer-band">Lenormand Reading · Stargazer</div>
</section>

<div class="page-break"></div>

<!-- Page 2+: One per chapter -->
<section class="poster xhs content-page">
  <h2>{chapter_title}</h2>
  <div class="body-text">
    <!-- paragraphs, combo blocks, insight box -->
  </div>
  <div class="footer-band">{page_number} / {total_pages}</div>
</section>
<!-- Repeat for each chapter -->
</body>
</html>
```

## Social Card Rendering Rules

- **Font loading is mandatory**: Always include `@import url('https://cdn.jsdelivr.net/npm/chiron-sung-hk-webfont@latest/css/vf.css');` in the `<style>` block. Without this, Chiron Sung HK will not render.
- **SVG card faces on cover**: Read the relevant SVG files from `cards/*.svg`, strip `<defs>…</defs>`, embed them inline. Add a single hidden `<svg>` with global defs at the top of the first poster to avoid ID collisions. Card size: 180×270px for 3-card, scale proportionally for other spreads.
- Page 1 is always the cover: spread type badge, question as title, date, SVG card faces with name + position labels below each
- Pages 2+ are content pages: one per interpretation chapter
- Short chapters (less than ~150 chars) should be merged with the next chapter to avoid thin pages
- `combination` sections render as `.combo-block` with pair name + meaning
- `takeaway` sections render as `.insight-box`
- Each page gets a `.footer-band` with page number
- After building the HTML, render to PNG with Playwright at 1080×1440:

```js
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1080, height: 1440 });
await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
const posters = await page.$$('.poster.xhs');
for (let i = 0; i < posters.length; i++) {
  await posters[i].screenshot({ path: outputPrefix + `-${String(i + 1).padStart(2, '0')}.png` });
}
await browser.close();
```

- Run `node manage-readings.js record-product <reading_id> --type social-card` after generation
