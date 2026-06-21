# Stargazer Interpreter · 星解者 v3.1

> [English](README.md)

一个 [WorkBuddy](https://www.codebuddy.ai) 技能，用于解读来自 [Stargazer's Oracle（观星者神谕）](https://stargazer.estework.site/) 的雷诺曼（Lenormand）牌阵。遵循 [Agent Skills](https://agentskills.io) 开放标准。

粘贴 Stargazer AI 提示词 → 生成 A4 PDF、交互式网页、或 1080×1440 小​​红书社交卡片。

## 功能特性

- **6 种牌阵**：1 张是非题、2 张对牌、3 张线性、5 张线性、9 张九宫格（3×3）、二选一
- **双语**：自动识别中文或英文提示词
- **组合优先解读**：相邻牌对链式解读 + 名词·形容词模型
- **一次解读，三种产出**：A4 PDF（默认）、独立网页、1080×1440 社交卡片
- **解读持久化**：保存为结构化 JSON + Markdown，后续可重新生成任意产品
- **种子 HTML 骨架**：复制即用，不再从零构造 HTML
- **Geometric Silence SVG 牌面**：粗线条内联 SVG（`cards/` 目录），米白/鼠尾草绿/灰玫瑰色
- **昭源字体系列**：正文用昭源宋體，标签用昭源黑體
- **Kami 风格 PDF**：暖羊皮纸 (#f5f4ed) + 墨蓝强调色 (#1B365D)

## 预览

| 类型 | 牌阵 | 牌面 | 链接 |
|------|------|------|------|
| A4 PDF | 3 张每日運勢 | 幸運草 → 小孩 → 蛇 | [PDF](previews/lenormand-three-每日運勢-2026-06-20.pdf) |
| A4 PDF | 5 张 | 月亮 → 棺材 → 樹 → 雲 → 男人 | [PDF](previews/lenormand-five-創作瓶頸-2026-06-20.pdf) |
| 社交卡片 | 3 张每日運勢 | 幸運草 → 小孩 → 蛇 | [PNG](previews/lenormand-xhs-每日運勢-cover.png) |

## 安装

对你的 AI 助手说：

> 帮我安装 stargazer-interpreter 技能，地址是 https://github.com/locoda/stargazer-interpreter

```bash
# WorkBuddy
git clone https://github.com/locoda/stargazer-interpreter.git ~/.workbuddy/skills/stargazer-interpreter/
```

需要 Node.js + Puppeteer（首次使用自动安装 Chromium）。

## 使用方式 — 对话示例

### 首次解读

```
用户: 帮我解读这个牌阵

你是一位傳統 Lenormand 占卜師。請為我解讀今天的每日運勢。
【日期】2026/06/20
【牌陣】每日運勢 3 張（由左至右連讀）
1. 幸運草 (Clover)
2. 小孩 (Child)
3. 蛇 (Snake)
```

→ Agent 执行 Phase 1–2（解析 + 解读 + 保存），默认生成 A4 PDF。

### 从已有解读生成不同产品

```
用户: 把上次的解读生成社交卡片
```

→ Agent 加载保存的解读 JSON，压缩内容适配 1080×1440，生成轮播 PNG。

```
用户: 列出最近的解读
```

→ Agent 运行 `manage-readings.js list`，展示解读索引。

```
用户: 用 #2 解读生成网页版
```

→ Agent 从索引加载 #2 解读，生成自包含网页。

### 一次生成多个产品

```
用户: 帮我解读这个牌阵，生成 PDF 和社交卡片

[Stargazer 提示词...]
```

→ Agent 跑完整流程，交付两种产品。

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
           ├── A4 PDF（默认，Kami 风格）
           ├── 独立网页
           └── 社交卡片（1080×1440 轮播）
```

## 目录结构

```
├── SKILL.md                         # 主技能指令（v3.1）
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
├── references/
│   ├── lenormand-cards.md           # 36 张牌数据库
│   ├── spread-parsing.md            # 提示词解析规则
│   ├── design-system.md             # 共享字体/颜色/牌名表
│   ├── reading-schema.md            # 解读 JSON 结构
│   └── template-*.md                # 模板参考文档
└── scripts/
    ├── generate-pdf.js              # HTML → A4 PDF
    ├── render-social-cards.js       # HTML → 1080×1440 PNG
    └── manage-readings.js           # 解读索引 CLI
```

## 许可证

MIT

## 致谢与参考

**字体**
- [昭源宋體 (Chiron Sung HK)](https://github.com/chiron-fonts/chiron-sung-hk) — 可变宋体，SIL OFL 1.1
- [昭源黑體 (Chiron Hei HK)](https://github.com/chiron-fonts/chiron-hei-hk) — 可变黑体，SIL OFL 1.1

**设计**
- 视觉风格受到 [Kami](https://github.com/tw93/Kami) 启发 — MIT

**数据**
- [Stargazer's Oracle（观星者神谕）](https://stargazer.estework.site/)
- 雷诺曼牌义参考公有领域传统解读
