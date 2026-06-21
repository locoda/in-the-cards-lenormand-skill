# Stargazer Interpreter · 星解者

> [English](README.md) · [简体中文](README.zh-CN.md)

遵循 [Agent Skills](https://agentskills.io) 開放標準的 Lenormand 雷諾曼解讀技能，為 [Stargazer's Oracle（觀星者神諭）](https://stargazer.estework.site/) 而生。相容任何支援 Agent Skills 的 AI 助理，不綁定特定平臺。

貼上 Stargazer 提示詞 → 完成解讀並儲存為結構化資料，渲染為精美的 Kami 風格 A4 PDF、獨立網頁、或 1080×1440 社群卡片。

## 設計

所有產品共享統一視覺語言，靈感來自兩個源頭：

- **[Kami](https://github.com/tw93/Kami)** — 暖羊皮紙底色 (#f5f4ed)、墨藍強調色 (#1B365D)、昭源宋體排版。乾淨、文雅、留白從容。
- **幾何沉默 (Geometric Silence)** — 一套 36 張原創 Lenormand 牌組，建築藍圖風格。灰鼠尾草綠 (#7A8B7A) 線條繪製於米白底色 (#F5F0E8) 之上，塵玫瑰色 (#C4A0A0) 點綴。瑞士國際主義風格遇上了科研標本圖版。無任何神祕紋飾——純粹幾何抽象。

二者共同營造出學術、溫暖、安靜優雅的閱讀體驗。

## 功能特色

- **6 種牌陣**：1 張是非題 · 2 張對牌 · 3 張線性 · 5 張線性 · 9 張九宮格（3×3）· 二選一
- **雙語自動辨識**：中英文提示詞自動偵測，輸出語言與輸入一致
- **組合優先解讀**：相鄰牌對鏈式解讀，名詞+形容詞模型，中立誠實不做空洞安慰
- **一次解讀，三種產出**：A4 PDF（預設）· 獨立網頁 · 1080×1440 社群卡輪播
- **解讀持久化**：結構化 JSON + 人類可讀 Markdown 雙存，隨時再生為任意產品型態
- **種子 HTML**：複製即用，不再從零建構 HTML
- **幾何沉默牌組 (Geometric Silence)**：36 張原創 SVG 牌面，建築藍圖風格
- **昭源字體系列**：Chiron Sung HK（昭源宋體）正文 + Chiron Hei HK（昭源黑體）標籤，透過 Google Fonts CDN 載入，國內自動切換鏡像

## 預覽

| 類型 | 牌陣 | 牌面 | 連結 |
|------|------|------|------|
| A4 PDF | 5 張 | 月亮 → 棺材 → 樹 → 雲 → 男人 | [PDF](https://stargazer-interpreter.1mether.me/previews/lenormand-five-創作瓶頸-2026-06-20.pdf) |
| A4 PDF | 二選一 (EN) | Ship·Bear vs Mountain·Ring·Book | [PDF](https://stargazer-interpreter.1mether.me/previews/lenormand-choice-speak-or-hold-2026-06-20.pdf) |
| 社群卡片 | 3 張每日運勢 | 完整 4 頁輪播 | [P1](https://stargazer-interpreter.1mether.me/previews/lenormand-xhs-每日運勢-2026-06-20-01.png) · [P2](https://stargazer-interpreter.1mether.me/previews/lenormand-xhs-每日運勢-2026-06-20-02.png) · [P3](https://stargazer-interpreter.1mether.me/previews/lenormand-xhs-每日運勢-2026-06-20-03.png) · [P4](https://stargazer-interpreter.1mether.me/previews/lenormand-xhs-每日運勢-2026-06-20-04.png) |

## 安裝

對你的 AI 助理說：

> 幫我從 GitHub 安裝 stargazer-interpreter 技能：github.com/locoda/stargazer-interpreter

或手動複製到你的 agent 技能目錄：

```bash
git clone https://github.com/locoda/stargazer-interpreter.git ~/your-agent/skills/stargazer-interpreter/
```

需要 Node.js + Puppeteer（首次生成 PDF 或社群卡片時自動安裝 Chromium）。

## 使用方式

### 首次解讀

貼上 Stargazer 提示詞 — agent 自動執行 Phase 1（解析）+ Phase 2（解讀+儲存），預設生成 A4 PDF。

```
使用者: 幫我解讀這個牌陣

你是一位傳統 Lenormand 占卜師。請為我解讀今天的每日運勢。
【日期】2026/06/20
【牌陣】每日運勢 3 張（由左至右連讀）
1. 幸運草 (Clover)
2. 小孩 (Child)
3. 蛇 (Snake)
```

### 從已儲存的解讀生成不同產品

```
使用者: 把上次的解讀生成社群卡片
使用者: 用 #2 解讀生成網頁版
```

### 一次生成多個產品

```
使用者: 幫我解讀這個牌陣，生成 PDF 和社群卡片
[Stargazer 提示詞...]
```

### 三階段架構

```
Stargazer 提示詞
    │
    ▼
[Phase 1] 解析 → 結構化牌面資料
    │
    ▼
[Phase 2] 解讀 → 儲存 (JSON + MD)
    │
    ▼
[Phase 3] 從儲存的解讀生成產品
           ├── A4 PDF（預設）
           ├── 獨立網頁
           └── 社群卡片（1080×1440 輪播）
```

## 目錄結構

```
├── SKILL.md                         # 主技能指令
├── README.md                        # 英文文檔
├── README.zh-CN.md                  # 簡體中文文檔
├── README.zh-TW.md                  # 繁體中文文檔
├── assets/
│   ├── seed-a4-pdf.html             # A4 PDF HTML 骨架
│   ├── seed-social-card.html        # 1080×1440 社群卡片骨架
│   └── seed-web-page.html           # 網頁版骨架
├── cards/
│   └── card-01-rider.svg ...        # 36 張 Geometric Silence SVG
├── references/
│   ├── lenormand-cards.md           # 36 張牌資料庫
│   ├── spread-parsing.md            # 提示詞解析規則
│   ├── design-system.md             # 共享字體／顏色／牌名表
│   ├── reading-schema.md            # 解讀 JSON 結構
│   └── template-a4-pdf.md           # A4 PDF 章節與分頁平衡規則
└── scripts/
    ├── generate-pdf.js              # HTML → A4 PDF (Puppeteer)
    ├── render-social-cards.js       # HTML → 1080×1440 PNG (Puppeteer)
    ├── validate.js                  # 產物驗證（靜態 + Puppeteer）
    └── manage-readings.js           # 解讀索引 CLI
```

> **前端頁面與預覽檔案** 維護在 `site` 分支，透過 Cloudflare Pages 部署於 [stargazer-interpreter.1mether.me](https://stargazer-interpreter.1mether.me)。可檢視 [線上 Demo](https://stargazer-interpreter.1mether.me/demo/)。

## 授權條款

MIT

## 致謝與參考

**字體**
- [昭源宋體 (Chiron Sung HK)](https://github.com/chiron-fonts/chiron-sung-hk) — 可變宋體，SIL OFL 1.1
- [昭源黑體 (Chiron Hei HK)](https://github.com/chiron-fonts/chiron-hei-hk) — 可變黑體，SIL OFL 1.1

**設計**
- [Kami](https://github.com/tw93/Kami) — 視覺風格啟發，MIT
- 幾何沉默 (Geometric Silence) — 原創牌組設計

**資料**
- [Stargazer's Oracle（觀星者神諭）](https://stargazer.estework.site/)
- 雷諾曼牌義參考公有領域傳統解讀
