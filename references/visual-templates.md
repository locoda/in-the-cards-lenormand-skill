# Visual Templates — Lenormand Reading PDF Layouts

HTML templates for generating Kami-styled Lenormand reading PDFs. All templates share a common CSS foundation and A4 page format.

## Global Design Constants

```css
/* -- Kami Lenormand Theme -- */
--parchment:   #f5f4ed;   /* page background */
--near-black:  #141413;   /* body text */
--dark-warm:   #3d3d3a;   /* secondary text */
--stone:       #6b6a64;   /* meta, page numbers */
--brand:       #1B365D;   /* ink-blue accent */
--border:      #e8e6dc;   /* page borders */
--border-soft: #e5e3d8;   /* soft borders */

/* Card polarity colors */
--positive:    #E1F5EE;   /* soft teal fill */
--positive-stroke: #5DCAA5;
--negative:    #FAECE7;   /* soft terracotta fill */
--negative-stroke: #D85A30;
--neutral:     #EEEDFE;   /* soft purple fill */
--neutral-stroke: #AFA9EC;

/* Typography */
--serif: "Chiron Sung HK WS", "Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", Georgia, serif;
```

## Font Loading

```html
<style>
/* Chiron Sung HK (昭源宋體) — variable font via jsDelivr CDN */
@import url('https://cdn.jsdelivr.net/npm/chiron-sung-hk-webfont@latest/css/vf.css');
</style>
```

Font family: `"Chiron Sung HK WS"`
Weight range: 200–900 (variable)
PADG axis: 0–10 for character spacing (body text benefits from 5)

---

## Base Page Structure

Every PDF HTML follows this skeleton:

```html
<!DOCTYPE html>
<html lang="{zh-CN|en}">
<head>
<meta charset="UTF-8">
<title>Lenormand Reading — {question_summary}</title>
<meta name="generator" content="Stargazer Interpreter">
<!-- CSS: font-face + @page + base styles -->
</head>
<body>

<!-- 1. Cover + Card Grid (single page) -->
<section class="cover">
  <!-- cover text: label, title, date -->
  <div class="cover-top">...</div>
  <!-- card grid layout inline -->
  <div class="cover-cards">...</div>
  <!-- cover footer -->
  <div class="cover-bottom">...</div>
</section>

<!-- 2. Interpretation Chapters (flow continuously, separated by section rules) -->
<section class="chapter">
  <h2>{chapter_title}</h2>
  <p>...</p>
  <blockquote class="combination">...</blockquote>
  ...
</section>

</body>
</html>
```

### @page Rules

```css
@page {
  size: A4;
  margin: 20mm 22mm 22mm 22mm;
  background: var(--parchment);

  @top-right {
    content: string(section-title);
    font-family: var(--serif);
    font-size: 8pt;
    color: var(--stone);
  }

  @bottom-center {
    content: counter(page) "  ·  Lenormand Reading";
    font-family: var(--serif);
    font-size: 9pt;
    color: var(--stone);
  }
}

@page:first {
  @top-right { content: ""; }
  @bottom-center { content: ""; }
}

/* If cover+cards overflows, subsequent pages get full header/footer */
@page:nth(1) {
  @top-right { content: ""; }
  @bottom-center { content: ""; }
}
```

---

## Cover Page Template

```html
<section class="cover">
  <div class="cover-top">
    <p class="cover-label">{spread_type_display}</p>
    <h1 class="cover-title">{question_text}</h1>
    <p class="cover-date">{date_display}</p>
  </div>
  <div class="cover-bottom">
    <p class="cover-meta">Lenormand Reading · Stargazer Interpreter</p>
    <p class="cover-cards-preview">{card_names_list}</p>
  </div>
</section>
```

Cover CSS:
```css
.cover {
  string-set: section-title "";
  break-after: page;
}
.cover-top {
  margin-bottom: 8mm;
}
.cover-label {
  font-size: 10pt;
  color: var(--brand);
  letter-spacing: 2pt;
  text-transform: uppercase;
  margin-bottom: 8mm;
}
.cover-title {
  font-size: 28pt;
  font-weight: 500;
  color: var(--near-black);
  line-height: 1.3;
  max-width: 85%;
  border-left: 4pt solid var(--brand);
  padding-left: 12mm;
}
.cover-date {
  font-size: 11pt;
  color: var(--stone);
  margin-top: 6mm;
}
/* Card grid inside cover — constrained, compact */
.cover-cards {
  margin: 10mm 0 8mm 0;
}
.cover-cards h2 {
  font-size: 13pt;
  font-weight: 500;
  color: var(--brand);
  text-align: center;
  margin-bottom: 5mm;
  border-bottom: 1pt solid var(--border);
  padding-bottom: 2mm;
  display: inline-block;
}
.cover-bottom {
  border-top: 1pt solid var(--border);
  padding-top: 6mm;
}
.cover-meta {
  font-size: 9pt;
  color: var(--stone);
}
.cover-cards-preview {
  font-size: 14pt;
  color: var(--dark-warm);
  margin-top: 3mm;
  letter-spacing: 1pt;
}
```

---

## Card Grid Page Templates

### Card Rendering Component

Each card is rendered as a figure with Stargazer image + SVG fallback.

```html
<figure class="card {polarity}" data-card="{number}">
  <div class="card-inner">
    <img class="card-img"
         src="https://stargazer.estework.site/cards/{number_padded}_{slug}.webp"
         alt="{name_zh}"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
         loading="lazy">
    <div class="card-fallback" style="display:none;">
      <!-- Inline SVG fallback -->
      <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="140" rx="8" fill="{polarity_fill}" stroke="{polarity_stroke}" stroke-width="2"/>
        <text x="50" y="50" text-anchor="middle" font-family="serif" font-size="24" fill="{polarity_text}">{number}</text>
        <text x="50" y="80" text-anchor="middle" font-family="serif" font-size="10" fill="{polarity_text}">{name_zh}</text>
        <text x="50" y="98" text-anchor="middle" font-family="serif" font-size="8" fill="{polarity_text}">{name_en}</text>
      </svg>
    </div>
  </div>
  <figcaption class="card-caption">
    <span class="card-number">{number}</span>
    <span class="card-name">{name_zh}</span>
  </figcaption>
</figure>
```

Card polarity colors for fallback:
```
positive → fill: #E1F5EE, stroke: #5DCAA5, text: #085041
negative → fill: #FAECE7, stroke: #D85A30, text: #6B2F1A
neutral  → fill: #EEEDFE, stroke: #AFA9EC, text: #3C3489
```

Card CSS:
```css
/* Card grid is rendered inside .cover-cards — no page break */
.card {
  text-align: center;
  break-inside: avoid;
}
.card-inner {
  width: 130px;
  height: 182px; /* 100:140 ratio ~= card proportions */
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-fallback svg { width: 100%; height: 100%; }
.card-caption { margin-top: 4pt; font-size: 9pt; }
.card-number { color: var(--stone); margin-right: 4pt; }
.card-name { color: var(--dark-warm); font-weight: 500; }
```

### Spread Layout: 1-Card Yes/No

Rendered inside `.cover-cards`:

```html
<div class="cover-cards">
  <h2>Yes / No Reading</h2>
  <div class="spread-layout spread-yesno">
    <figure class="card card-large {polarity}" data-card="{number}">
      ...
    </figure>
    <div class="verdict-badge verdict-{verdict}">
      {verdict_text}
    </div>
  </div>
</div>
```

```css
.spread-yesno {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 10mm 0;
}
.card-large .card-inner {
  width: 160px;
  height: 224px;
}
.verdict-badge {
  margin-top: 6mm;
  padding: 2mm 8mm;
  border-radius: 4pt;
  font-size: 18pt;
  font-weight: 500;
  letter-spacing: 3pt;
}
.verdict-yes    { background: #E1F5EE; color: #085041; }
.verdict-no     { background: #FAECE7; color: #6B2F1A; }
.verdict-maybe  { background: #EEEDFE; color: #3C3489; }
```

### Spread Layout: 2-Card

Rendered inside `.cover-cards`:

```html
<div class="cover-cards">
  <h2>Two-Card Pair</h2>
  <div class="spread-layout spread-two">
    <figure class="card" data-card="{num1}">...</figure>
    <div class="card-arrow">+</div>
    <figure class="card" data-card="{num2}">...</figure>
  </div>
</div>
```

```css
.spread-two {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8mm;
  padding: 0 0 10mm 0;
}
.card-arrow {
  font-size: 24pt;
  color: var(--brand);
  font-family: var(--serif);
}
/* Position labels below card spreads */
.spread-labels {
  display: flex;
  justify-content: center;
  gap: 5mm;
  margin-top: 2mm;
}
.spread-labels span {
  width: 130px;
  text-align: center;
  font-size: 9pt;
  color: var(--stone);
}
```

### Spread Layout: 3-Card

Rendered inside `.cover-cards`:

```html
<div class="cover-cards">
  <h2>Three-Card Linear Spread</h2>
  <div class="spread-layout spread-three">
    <figure class="card" data-card="{num1}">...</figure>
    <div class="card-arrow">→</div>
    <figure class="card" data-card="{num2}">...</figure>
    <div class="card-arrow">→</div>
    <figure class="card" data-card="{num3}">...</figure>
  </div>
  <div class="spread-labels">
    <span>1</span><span></span><span>2</span><span></span><span>3</span>
  </div>
</div>
```

```css
.spread-three {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5mm;
  padding: 0 0 4mm 0;
}
```

### Spread Layout: 5-Card

Rendered inside `.cover-cards`:

```html
<div class="cover-cards">
  <h2>Five-Card Linear Spread</h2>
  <p class="spread-note">Center card (position 3) = core theme</p>
  <div class="spread-layout spread-five">
    <figure class="card" data-card="{num1}">...</figure>
    <div class="card-arrow">→</div>
    <figure class="card" data-card="{num2}">...</figure>
    <div class="card-arrow">→</div>
    <figure class="card card-center" data-card="{num3}">...</figure>
    <div class="card-arrow">→</div>
    <figure class="card" data-card="{num4}">...</figure>
    <div class="card-arrow">→</div>
    <figure class="card" data-card="{num5}">...</figure>
  </div>
</div>
```

```css
.spread-five {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3mm;
  padding: 0 0 4mm 0;
}
.card-center .card-inner {
  border: 3pt solid var(--brand);
  box-shadow: 0 2px 12px rgba(27,54,93,0.2);
}
.spread-note {
  text-align: center;
  font-size: 9pt;
  color: var(--stone);
  margin-bottom: 4mm;
}
```

### Spread Layout: 9-Card Box Spread (3×3)

Rendered inside `.cover-cards`:

```html
<div class="cover-cards">
  <h2>3×3 Box Spread · 九宮格牌陣</h2>

  <!-- Column labels -->
  <div class="box-column-labels">
    <span class="col-label col-past">{past_label}</span>
    <span class="col-label col-present">{present_label}</span>
    <span class="col-label col-future">{future_label}</span>
  </div>

  <!-- 3×3 grid -->
  <div class="spread-layout spread-box">
    <div class="box-row">
      <figure class="card" data-card="{n1}">...</figure>
      <figure class="card" data-card="{n2}">...</figure>
      <figure class="card" data-card="{n3}">...</figure>
    </div>
    <div class="box-row">
      <figure class="card" data-card="{n4}">...</figure>
      <figure class="card card-center" data-card="{n5}">...</figure>
      <figure class="card" data-card="{n6}">...</figure>
    </div>
    <div class="box-row">
      <figure class="card" data-card="{n7}">...</figure>
      <figure class="card" data-card="{n8}">...</figure>
      <figure class="card" data-card="{n9}">...</figure>
    </div>
  </div>
</div>
```

```css
.spread-box { margin: 4mm 0 6mm 0; }
.box-row {
  display: flex;
  justify-content: center;
  gap: 4mm;
  margin-bottom: 4mm;
}
.box-column-labels {
  display: flex;
  justify-content: center;
  gap: 4mm;
  margin-bottom: 2mm;
  font-size: 10pt;
  color: var(--brand);
  font-weight: 500;
}
.col-label { width: 130px; text-align: center; }
.card-center .card-inner {
  border: 3pt solid var(--brand);
  box-shadow: 0 2px 12px rgba(27,54,93,0.2);
}
```

### Spread Layout: A-or-B (Choice)

Rendered inside `.cover-cards`:

```html
<div class="cover-cards">
  <h2>A-or-B Choice · 二選一</h2>

  <div class="choice-option">
    <h3 class="choice-label label-a">A. {optionA_text}</h3>
    <div class="spread-layout spread-three">
      <figure class="card" data-card="{a_num1}">...</figure>
      <div class="card-arrow">→</div>
      <figure class="card" data-card="{a_num2}">...</figure>
      <div class="card-arrow">→</div>
      <figure class="card" data-card="{a_num3}">...</figure>
    </div>
  </div>

  <div class="choice-divider"><span>VS</span></div>

  <div class="choice-option">
    <h3 class="choice-label label-b">B. {optionB_text}</h3>
    <div class="spread-layout spread-three">
      <figure class="card" data-card="{b_num1}">...</figure>
      <div class="card-arrow">→</div>
      <figure class="card" data-card="{b_num2}">...</figure>
      <div class="card-arrow">→</div>
      <figure class="card" data-card="{b_num3}">...</figure>
    </div>
  </div>
</div>
```

```css
.choice-option { margin-bottom: 6mm; }
.choice-label {
  text-align: center;
  font-size: 12pt;
  margin-bottom: 3mm;
}
.label-a { color: #0C447C; } /* ink-blue variant */
.label-b { color: #6B2F1A; } /* terracotta variant */
.choice-divider {
  text-align: center;
  margin: 6mm 0;
  position: relative;
}
.choice-divider span {
  display: inline-block;
  padding: 2mm 6mm;
  background: var(--border);
  border-radius: 4pt;
  font-size: 14pt;
  font-weight: 500;
  color: var(--stone);
  letter-spacing: 2pt;
}
```

---

## Interpretation Body Pages

### Chapter Template

Each analysis dimension gets its own chapter section.

```html
<section class="chapter">
  <h2 data-short="{chapter_short_title}">{chapter_title}</h2>

  <!-- Interpretation paragraphs -->
  <p>{body_text_paragraph_1}</p>
  <p>{body_text_paragraph_2}</p>

  <!-- Card combination callout -->
  <blockquote class="combination">
    <p class="combo-label">{card1_name} + {card2_name}</p>
    <p>{combination_meaning}</p>
  </blockquote>

  <!-- Key takeaway -->
  <div class="takeaway">
    <p>{key_insight}</p>
  </div>
</section>
```

### Chapter CSS

```css
/* Chapters flow continuously; first h2 is flush, subsequent h2s have generous top margin */
.chapter h2 {
  string-set: section-title attr(data-short);
  font-size: 16pt;
  font-weight: 500;
  color: var(--brand);
  margin-top: 10mm;
  margin-bottom: 4mm;
  border-bottom: 1pt solid var(--border);
  padding-bottom: 2mm;
}
/* First chapter after cover has no extra top space */
.chapter:first-of-type h2 { margin-top: 0; }
.chapter p {
  font-size: 10.5pt;
  line-height: 1.55;
  letter-spacing: 0.3pt;
  color: var(--near-black);
  margin-bottom: 3mm;
  text-align: justify;
}
.combination {
  margin: 4mm 0;
  padding: 3mm 5mm;
  background: var(--border-soft);
  border-left: 3pt solid var(--brand);
  border-radius: 0 4pt 4pt 0;
}
.combo-label {
  font-size: 10pt;
  font-weight: 500;
  color: var(--brand);
  margin-bottom: 1mm;
}
.takeaway {
  margin-top: 6mm;
  padding: 4mm 6mm;
  background: var(--brand);
  color: #f5f4ed;
  border-radius: 4pt;
  font-size: 11pt;
  line-height: 1.5;
}
.takeaway p { color: inherit; }
```

---

## Interpretation Chapter Structure by Spread Type

### 1-Card Yes/No
Single chapter:
- **Verdict & Nuance**: Overall judgment + card meaning applied to question + subtle nuances

### 2-Card
Single chapter:
- **Combined Meaning**: Card 1+2 as a single sentence, overall meaning, practical guidance

### 3-Card
Three chapters:
1. **組合解讀 · Chain Reading** — Pair 1+2, then 2+3, then all three together
2. **整體意義 · Overall Meaning** — Synthesized message of the three cards
3. **提醒與建議 · Guidance** — Practical takeaway

### 5-Card
Three chapters:
1. **核心主題 · Core Theme** — Center card (position 3) as the heart of the matter
2. **組合鏈讀 · Chain Reading** — Pairs: 1+2, 2+3, 3+4, 4+5
3. **整體走向 · Overall Trajectory** — All 5 as one connected narrative + guidance

### 9-Card Box Spread
Five chapters:
1. **時間軸 · Time Axis** — Past (col 1: 1,4,7), Present (col 2: 2,5,8), Future (col 3: 3,6,9)
2. **三層意識 · Three Layers** — Conscious (row 1: 1,2,3), Reality (row 2: 4,5,6), Subconscious (row 3: 7,8,9)
3. **十字法 · Cross Method** — Core (pos 5), Cross arms (pos 2,4,6,8), Corners (pos 1,3,7,9)
4. **關鍵組合 · Key Combinations** — Notable card pairs and clusters
5. **整體解讀 · Overall Synthesis** — All 9 cards woven together

### A-or-B Choice
Three chapters:
1. **A 選項 · Option A** — Cards 1+2, 2+3 chain for Option A
2. **B 選項 · Option B** — Cards 1+2, 2+3 chain for Option B
3. **比較與傾向 · Comparison** — Side-by-side analysis + tendency + final reminder

---

## Image Path Map

Stargazer card image URLs follow this format:

```
Full:    https://stargazer.estework.site/cards/{NN}_{slug}.webp
Thumb:   https://stargazer.estework.site/cards/thumbs/{NN}_{slug}.webp
```

Where `{NN}` is zero-padded card number (01-36) and `{slug}` is the English lowercase name.

| # | Slug | # | Slug | # | Slug |
|---|------|---|------|---|------|
| 1 | rider | 13 | child | 25 | ring |
| 2 | clover | 14 | fox | 26 | book |
| 3 | ship | 15 | bear | 27 | letter |
| 4 | house | 16 | star | 28 | man |
| 5 | tree | 17 | stork | 29 | woman |
| 6 | clouds | 18 | dog | 30 | lily |
| 7 | snake | 19 | tower | 31 | sun |
| 8 | coffin | 20 | garden | 32 | moon |
| 9 | bouquet | 21 | mountain | 33 | key |
| 10 | scythe | 22 | crossroads | 34 | fish |
| 11 | whip | 23 | mice | 35 | anchor |
| 12 | birds | 24 | heart | 36 | cross |
