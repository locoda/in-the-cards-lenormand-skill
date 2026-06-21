# Stargazer Interpreter · 星解者

> [English](README.md) · [展示页](https://github.com/locoda/stargazer-interpreter)

遵循 [Agent Skills](https://agentskills.io) 开放标准的 Lenormand 雷诺曼解读技能，为 [Stargazer's Oracle（观星者神谕）](https://stargazer.estework.site/) 而生。兼容任何支持 Agent Skills 的 AI 助手，不绑定特定平台。

粘贴 Stargazer 提示词 → 完成解读并保存为结构化数据，渲染为精美的 Kami 风格 A4 PDF、独立网页、或 1080×1440 社交卡片。

## 设计

所有产品共享统一视觉语言，灵感来自两个源头：

- **[Kami](https://github.com/tw93/Kami)** — 暖羊皮纸底色 (#f5f4ed)、墨蓝强调色 (#1B365D)、昭源宋体排版。干净、文雅、留白从容。
- **几何沉默 (Geometric Silence)** — 一套 36 张原创 Lenormand 牌组，建筑蓝图风格。灰鼠尾草绿 (#7A8B7A) 线条绘制于米白底色 (#F5F0E8) 之上，尘玫瑰色 (#C4A0A0) 点缀。瑞士国际主义风格遇上了科研标本图版。无任何神秘纹饰——纯粹几何抽象。

二者共同营造出学术、温暖、安静优雅的阅读体验。

## 功能特性

- **6 种牌阵**：1 张是非题 · 2 张对牌 · 3 张线性 · 5 张线性 · 9 张九宫格（3×3）· 二选一
- **双语自动识别**：中英文提示词自动检测，输出语言与输入一致
- **组合优先解读**：相邻牌对链式解读，名词+形容词模型，中立诚实不做空洞安慰
- **一次解读，三种产出**：A4 PDF（默认）· 独立网页 · 1080×1440 社交卡轮播
- **解读持久化**：结构化 JSON + 人类可读 Markdown 双存，随时再生为任意产品形态
- **种子 HTML**：复制即用，不再从零构造 HTML
- **几何沉默牌组 (Geometric Silence)**：36 张原创 SVG 牌面，建筑蓝图风格
- **昭源字体系列**：Chiron Sung HK（昭源宋體）正文 + Chiron Hei HK（昭源黑體）标签

## 预览

| 类型 | 牌阵 | 牌面 | 链接 |
|------|------|------|------|
| A4 PDF | 5 张 | 月亮 → 棺材 → 樹 → 雲 → 男人 | [PDF](previews/lenormand-five-創作瓶頸-2026-06-20.pdf) |
| A4 PDF | 二选一 (EN) | Ship·Bear vs Mountain·Ring·Book | [PDF](previews/lenormand-choice-speak-or-hold-2026-06-20.pdf) |
| 社交卡片 | 3 张每日運勢 | 完整 4 页轮播 | [P1](previews/lenormand-xhs-每日運勢-2026-06-20-01.png) · [P2](previews/lenormand-xhs-每日運勢-2026-06-20-02.png) · [P3](previews/lenormand-xhs-每日運勢-2026-06-20-03.png) · [P4](previews/lenormand-xhs-每日運勢-2026-06-20-04.png) |

## 安装

对你的 AI 助手说：

> 帮我从 GitHub 安装 stargazer-interpreter 技能：github.com/locoda/stargazer-interpreter

或手动克隆到你的 agent 技能目录：

```bash
git clone https://github.com/locoda/stargazer-interpreter.git ~/your-agent/skills/stargazer-interpreter/
```

需要 Node.js + Puppeteer（首次生成 PDF 或社交卡片时自动安装 Chromium）。

## 使用方式

### 首次解读

粘贴 Stargazer 提示词 — agent 自动执行 Phase 1（解析）+ Phase 2（解读+保存），默认生成 A4 PDF。

```
用户: 帮我解读这个牌阵

你是一位傳統 Lenormand 占卜師。請為我解讀今天的每日運勢。
【日期】2026/06/20
【牌陣】每日運勢 3 張（由左至右連讀）
1. 幸運草 (Clover)
2. 小孩 (Child)
3. 蛇 (Snake)
```

### 从已有解读生成不同产品

```
用户: 把上次的解读生成社交卡片
用户: 用 #2 解读生成网页版
```

### 一次生成多个产品

```
用户: 帮我解读这个牌阵，生成 PDF 和社交卡片
[Stargazer 提示词...]
```

### 三阶段架构

```
Stargazer 提示词
    │
    ▼
[Phase 1] 解析 → 结构化牌面数据
    │
    ▼
[Phase 2] 解读 → 保存 (JSON + MD)
    │
    ▼
[Phase 3] 从保存的解读生成产品
           ├── A4 PDF（默认）
           ├── 独立网页
           └── 社交卡片（1080×1440 轮播）
```

## 目录结构

```
├── SKILL.md                         # 主技能指令
├── README.md                        # 英文文档
├── README.zh-CN.md                  # 中文文档
├── assets/
│   ├── seed-a4-pdf.html             # A4 PDF HTML 骨架
│   ├── seed-social-card.html        # 1080×1440 社交卡片骨架
│   └── seed-web-page.html           # 网页版骨架
├── cards/
│   ├── card-01-rider.svg ...        # 36 张 Geometric Silence SVG
│   └── previews/                    # 36 张 PNG 预览
├── previews/                        # 解读样例输出
├── public/                          # Landing page（Cloudflare Pages 部署）
│   ├── index.html
│   ├── cards/                       # 网页展示用牌面 SVG
│   └── previews/                    # 产品展示预览素材
├── references/
│   ├── lenormand-cards.md           # 36 张牌数据库
│   ├── spread-parsing.md            # 提示词解析规则
│   ├── design-system.md             # 共享字体/颜色/牌名表
│   ├── reading-schema.md            # 解读 JSON 结构
│   └── template-a4-pdf.md           # A4 PDF 章节与分页平衡规则
└── scripts/
    ├── generate-pdf.js              # HTML → A4 PDF (Puppeteer)
    ├── render-social-cards.js       # HTML → 1080×1440 PNG (Puppeteer)
    └── manage-readings.js           # 解读索引 CLI
```

## 许可证

MIT

## 致谢与参考

**字体**
- [昭源宋體 (Chiron Sung HK)](https://github.com/chiron-fonts/chiron-sung-hk) — 可变宋体，SIL OFL 1.1
- [昭源黑體 (Chiron Hei HK)](https://github.com/chiron-fonts/chiron-hei-hk) — 可变黑体，SIL OFL 1.1

**设计**
- [Kami](https://github.com/tw93/Kami) — 视觉风格启发，MIT
- 几何沉默 (Geometric Silence) — 原创牌组设计

**数据**
- [Stargazer's Oracle（观星者神谕）](https://stargazer.estework.site/)
- 雷诺曼牌义参考公有领域传统解读
