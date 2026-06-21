# Stargazer Interpreter · 星解者

> [中文说明](README.zh-CN.md)

A [WorkBuddy](https://www.codebuddy.ai) skill for interpreting Lenormand card readings from [Stargazer's Oracle](https://stargazer.estework.site/). Follows the [Agent Skills](https://agentskills.io) open standard.

Paste a Stargazer AI prompt → get a traditional combination-reading interpretation → delivered as a Kami-styled A4 PDF with Geometric Silence SVG card faces.

## Features

- **6 spread types**: 1-card Yes/No, 2-card, 3-card, 5-card, 9-card Box Spread (3×3), A-or-B choice
- **Bilingual**: Auto-detects Chinese or English prompts
- **Combination-first reading**: Adjacent card pair chains, not isolated card meanings
- **Geometric Silence SVG cards (default)**: Inline SVG card faces — cream/sage/rose Swiss International Style, no borders, no polarity labels — 36 cards bundled in `cards/`
- **Clean chapter structure**: Each analytical perspective starts on its own page via `break-before`, with balanced content (≥50% fill per page)
- **Kami-styled PDFs**: Warm parchment (#f5f4ed) + ink-blue accent (#1B365D) + Chiron Sung HK variable font

## Preview

| Spread | Cards | Preview |
|--------|-------|---------|
| 3-Card | 星星 → 心 → 鑰匙 | [PDF](previews/lenormand-three-前进方向-2026-06-20.pdf) |
| 5-Card | 船 → 蛇 → 月亮 → 十字架 → 星星 | [PDF](previews/lenormand-five-人生转折-2026-06-20.pdf) |
| 9-Card (EN) | Clover·Star·Sun / Ship·Key·Garden / Tree·Moon·Anchor | [PDF](previews/preview-nine-en.pdf) |

## Install

Tell your agent:

> Install the stargazer-interpreter skill from https://github.com/locoda/stargazer-interpreter

Requires: Node.js + Puppeteer + Google Chrome for PDF generation (installed automatically on first use).

## Usage

1. Go to [Stargazer's Oracle](https://stargazer.estework.site/), draw a spread, copy the AI prompt
2. Paste it into WorkBuddy with "帮我解读" or "interpret this spread"
3. The skill auto-triggers and produces an A4 PDF

## Structure

```
├── SKILL.md                     # Main skill instructions (v2.1)
├── README.md                    # English documentation
├── README.zh-CN.md              # 中文文档
├── cards/
│   ├── card-01-rider.svg ...    # 36 Geometric Silence SVG card faces
│   └── previews/                # 36 PNG card previews
├── previews/                    # Sample reading PDFs
├── references/
│   ├── lenormand-cards.md       # 36-card database with meanings
│   ├── spread-parsing.md        # Prompt parsing rules
│   └── visual-templates.md      # HTML/CSS templates + page balance rules
└── scripts/
    └── generate-pdf.js          # Puppeteer HTML→PDF converter
```

## License

MIT

## Credits & References

**Typography**
- [Chiron Sung HK (昭源宋體)](https://github.com/chiron-fonts/chiron-sung-hk) — variable serif font for headings and body text. Derived from [Source Han Serif](https://github.com/adobe-fonts/source-han-serif) / [Noto Serif CJK](https://github.com/googlefonts/noto-cjk). Licensed under [SIL OFL 1.1](https://scripts.sil.org/OFL).

**Design**
- Visual style inspired by [Kami](https://github.com/tw93/Kami) — warm parchment + ink-blue A4 typesetting aesthetic by [tw93](https://github.com/tw93). Kami is MIT-licensed.

**Data**
- [Stargazer's Oracle](https://stargazer.estework.site/) — the online Lenormand reading platform.
- Lenormand card meanings from traditional interpretations in the public domain.
