# Stargazer Interpreter · 星解者

> [中文说明](README.zh-CN.md) · [繁體中文](README.zh-TW.md)

An [Agent Skills](https://agentskills.io) compatible skill that interprets Lenormand card readings from [Stargazer's Oracle](https://stargazer.estework.site/). Works with any AI agent that supports the Agent Skills open standard — not tied to a specific platform.

Paste a Stargazer prompt → get a full interpretation, saved as structured data, rendered into beautiful Kami-styled A4 PDFs, interactive web pages, or 1080×1440 social cards.

## Design

Every product shares a unified visual language inspired by two sources:

- **[Kami](https://github.com/tw93/Kami)** — warm parchment background (#f5f4ed), ink-blue accent (#1B365D), Chiron Sung HK serif typography. Clean, literary, minimal.
- **Geometric Silence** — a custom 36-card Lenormand deck in architectural blueprint style. Muted sage green (#7A8B7A) linework on cream (#F5F0E8), with dusty rose (#C4A0A0) accents. Swiss International Style meets scientific specimen plates. No mystical ornament — pure geometric abstraction.

Together they create a reading experience that feels scholarly, warm, and quietly beautiful.

## Features

- **6 spread types**: 1-card Yes/No · 2-card pair · 3-card linear · 5-card linear · 9-card Box Spread (3×3) · A-or-B choice
- **Bilingual**: Auto-detects Chinese or English prompts; all output matches the prompt language
- **Combination-first reading**: Adjacent card pair chains with Noun+Adjective model, neutral honest tone
- **3 product types from one reading**: A4 PDF (default) · self-contained web page · 1080×1440 social card carousel
- **Persistent readings**: Saved as structured JSON + human-readable Markdown; regenerate into any product format anytime
- **Seed-based HTML**: Copy + fill HTML skeletons — no fragile from-scratch construction
- **Geometric Silence deck**: 36 original SVG cards in architectural blueprint style
- **Chiron font pair**: Chiron Sung HK (昭源宋體) serif + Chiron Hei HK (昭源黑體) sans

## Preview

| Product | Spread | Cards | Link |
|---------|--------|-------|------|
| A4 PDF | 5-Card | 月亮 → 棺材 → 樹 → 雲 → 男人 | [PDF](previews/lenormand-five-創作瓶頸-2026-06-20.pdf) |
| A4 PDF | A-or-B (EN) | Ship·Bear vs Mountain·Ring·Book | [PDF](previews/lenormand-choice-speak-or-hold-2026-06-20.pdf) |
| Social Card | 3-Card Daily | All 4 carousel pages | [P1](previews/lenormand-xhs-每日運勢-2026-06-20-01.png) · [P2](previews/lenormand-xhs-每日運勢-2026-06-20-02.png) · [P3](previews/lenormand-xhs-每日運勢-2026-06-20-03.png) · [P4](previews/lenormand-xhs-每日運勢-2026-06-20-04.png) |

## Install

Tell your agent:

> Install the stargazer-interpreter skill from GitHub: github.com/locoda/stargazer-interpreter

Or clone manually into your agent's skills directory:

```bash
git clone https://github.com/locoda/stargazer-interpreter.git ~/your-agent/skills/stargazer-interpreter/
```

Requires: Node.js + Puppeteer (auto-installs Chromium on first PDF/social card render).

## Usage

### First-time reading

Paste a Stargazer prompt — the agent runs Phase 1 (parse) + Phase 2 (interpret + save), generates A4 PDF by default.

```
User: Interpret this spread

You are a traditional Lenormand reader. Read for me...
---
Question: How will my career change in the next 3 months?
Date: 2026-06-20
Spread: 3-card linear
1. Clover
2. Child
3. Snake
```

### Generate a different product

```
User: Generate social cards from the latest reading
User: Generate web page from reading #2
```

### Request multiple products

```
User: Interpret this spread, generate PDF and social cards
[Stargazer prompt...]
```

### Three-phase workflow

```
Stargazer Prompt
    │
    ▼
[Phase 1] Parse → structured card data
    │
    ▼
[Phase 2] Interpret → save reading (JSON + MD)
    │
    ▼
[Phase 3] Generate products from saved reading
           ├── A4 PDF (default)
           ├── Web Page
           └── Social Card (1080×1440 carousel)
```

## Structure

```
├── SKILL.md                         # Main instructions
├── README.md                        # English docs
├── README.zh-CN.md                  # 中文文档
├── assets/
│   ├── seed-a4-pdf.html             # A4 PDF HTML skeleton
│   ├── seed-social-card.html        # 1080×1440 social card skeleton
│   └── seed-web-page.html           # Web page skeleton
├── cards/
│   ├── card-01-rider.svg ...        # 36 Geometric Silence SVG cards
│   └── previews/                    # 36 PNG card previews
├── previews/                        # Sample reading outputs
├── public/                          # Landing page (deployed via Cloudflare Pages)
│   ├── index.html
│   ├── cards/                       # Card SVGs for web display
│   └── previews/                    # Preview assets for showcase
├── references/
│   ├── lenormand-cards.md           # 36-card database
│   ├── spread-parsing.md            # Prompt parsing rules
│   ├── design-system.md             # Shared fonts, colors, card slugs
│   ├── reading-schema.md            # JSON schema for persisted readings
│   └── template-a4-pdf.md           # A4 PDF chapter & page balance rules
└── scripts/
    ├── generate-pdf.js              # HTML → A4 PDF (Puppeteer)
    ├── render-social-cards.js       # HTML → 1080×1440 PNGs (Puppeteer)
    └── manage-readings.js           # Reading index CLI
```

## License

MIT

## Credits & References

**Typography**
- [Chiron Sung HK (昭源宋體)](https://github.com/chiron-fonts/chiron-sung-hk) — variable serif, SIL OFL 1.1
- [Chiron Hei HK (昭源黑體)](https://github.com/chiron-fonts/chiron-hei-hk) — variable sans, SIL OFL 1.1

**Design**
- [Kami](https://github.com/tw93/Kami) — visual style inspiration, MIT
- Geometric Silence — original card deck design

**Data**
- [Stargazer's Oracle](https://stargazer.estework.site/) — online Lenormand platform
- Lenormand card meanings from traditional interpretations (public domain)
