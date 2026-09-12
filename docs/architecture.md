# 架构与数据说明

## 运行方式

项目为纯静态 HTML / CSS / JavaScript；无前端框架、无第三方运行时依赖、无后端 API。`dist/` 是权威运行源码和静态托管目录，`outputs/` 的单文件版本由构建脚本把 CSS 与所有 JS 内联生成。

## 文件职责

- `dist/index.html`：网页入口与脚本加载顺序。
- `dist/style.css`：桌面、手机、弹窗、A4 打印样式。
- `dist/data.js`：六章课程目录、题目构造器 `Q` / `SQ` / `C1`、可变题量题型注册器 `TS`，以及兼容旧章节的 `T`。
- `dist/chapter1-bank-1.js`～`chapter1-bank-6.js`：第一章完整材料题库。
- `dist/chapter1-figures.js`：第一章题图解析入口 `F()`。
- `dist/chapter1-figures-1.js`～`chapter1-figures-7.js`：从原 PDF 提取的第一章题图数据，按题目 ID 分片保存。
- `dist/chapter2.js`～`chapter6.js`：第二至第六章既有题库。
- `dist/reviews.js`：单元综合复习题；第一章 `1.0` 由完整材料专题题库替代。
- `dist/diagrams.js`：后续章节及适合结构化表达题目的 SVG 示意图。
- `dist/app.js`：章节/题型/题目形式筛选、解析、组卷、打印、PDF 预览及 WebMCP 接口。
- `dist/pdf-export.js`：A4 自动分页、文字、原材料题图、结构化几何图绘制与离线 PDF 编码。

旧的 `chapter1a.js`～`chapter1d.js` 仅作为历史文件保留，`dist/index.html` 已不再加载它们。

## 题库数据结构

当前题型不再要求固定“1 道例题 + 3 道分层练习”。一个题型可以拥有任意数量的可选题目：

```text
topic
├─ id / section / chapter / part
├─ name
├─ rule       知识要点
├─ method     解题方法
├─ pitfall    易错提醒
├─ example    知识点代表题
└─ questions  0..N 道可选题目（实际校验要求至少 1 道）
```

题目主要字段：

```text
id             稳定题目 ID
qid            原材料题目 ID（第一章）
source         原材料来源，如“1.3 巩固训练2 第4题”
type           选择/填空/计算/证明/作图/解答
text           题干
answer         答案
steps[]        分步解析
options[]      选择题选项
figureId       原材料题图 ID
figure         解析后的本地 data:image 图像对象
diagram        可选结构化 SVG 图形描述
topicId/chapter/section
```

应用层已经取消 `difficulty` 状态、标签和筛选；第二至第六章旧源码仍以三个位置参数调用 `T()`，只是为了兼容旧数据文件，运行时不再附加“基础题 / 提高题 / 压轴题”字段。

## 第一章完整材料

第一章运行题库现为 **28 个知识点/专题、90 道可选原材料题目**，其中 **75 道带原材料题图**：

| 入口 | 题目数 | 内容 |
| --- | ---: | --- |
| `1.1` 认识三角形 | 27 | 概念、分类、内角、三边关系、角平分线、中线、高等 |
| `1.2` 图形的全等 | 10 | 全等形、对应关系、性质、折叠 |
| `1.3` 探究三角形全等的条件 | 20 | SSS、ASA、AAS、SAS 及综合应用 |
| `1.4` 三角形的尺规作图 | 3 | 已知三边、两角夹边、两边夹角 |
| `1.5` 利用三角形全等测距离 | 3 | 三类不可达距离测量 |
| `1.0` 单元复习与综合训练 | 27 | 角平分线与高线、六种全等模型、手拉手模型例题、七类辅助线技巧 |

材料的 `1.5 本章专题` 映射到项目 `1.0`；材料中 `1.3` 后部的尺规作图映射到项目 `1.4`；材料编号 `1.4 利用三角形全等测距离` 映射到项目 `1.5`。

带图题不再用通用示意图替代原图。第一章题目通过 `figureId` 关联 `chapter1-figures-*.js` 中的原材料裁图；网页、答案弹窗、浏览器打印和 PDF 导出共用同一题图对象。

## ID 兼容

原第一章核心题型继续使用 `t01`～`t07`；新增主题使用 `c1-*` 固定 ID。`T()` 的自动序列仍从原有位置递增，且跳过旧 `1.0` 第一章复习数据时仍保留序号推进，因此第二章及以后既有 `t08` 之后的题型 ID 不整体漂移。

第一章题目使用材料型 ID，例如 `c1-7-6`、`c1-12-e2`、`c1-13-15`。代表题本身使用 `${topicId}-example` 作为运行/数据库例题 ID，并保留 `sourceQuestionId` 指向对应原材料题号；如果代表题同时属于正式题目，它也会作为一条独立可选题出现在 `questions` 中。

## JSON 与 SQL 导出

`npm run export:data` 从实际运行文件加载题库并生成：

- `data/question-bank.json`：schemaVersion 2 的完整对象快照；
- `database/question-bank.sql`：SQLite 兼容导出。

SQL 表：

| 表 | 含义 |
| --- | --- |
| `chapters` | 6 章教材 |
| `sections` | 教材节次及综合复习入口 |
| `topics` | 知识点/专题及知识、方法、易错信息 |
| `questions` | 代表题与可选题，保存来源、题型、答案解析、选项、题图 ID/数据及结构化示意图 |

当前网页不会连接 SQL 数据库；JSON 和 SQL 是数据交换、备份、分析及未来迁移格式。

## 浏览器草稿

`localStorage` 键为 `xunti-paper-v1`，只保存选中题号、卷标题和留白设置。旧草稿在加载时会自动过滤当前题库中不存在的题号。没有云端同步或学生进度数据。

## 打印与 PDF

浏览器打印由当前选题动态生成学生卷或家长解析卷。题目原图随题目进入打印 DOM，并设置避免在图片内部分页。

`PaperPDF.create` 使用与页面相同的题目快照。布局器把原题图作为 `figure` 块、结构化图作为 `diagram` 块参与 A4 分页；生成 PDF 前会预加载所有本地 data URL 题图，按原宽高比例缩放绘制。最终 PDF 页面仍采用高分辨率 Canvas 图像封装，因此可以稳定保留中文、数学符号与原材料图，但 PDF 正文本身不可直接选择文字；页面另提供可复制的 HTML 文字版。

## 开发与迁移

题库源码修改完成后建议依次执行：

```bash
npm run export:data
npm run build:offline
npm test
npm start
```

`npm test` 会检查第一章 28 个题型、90 道可选题、75 道原材料题图、题号唯一、选择题结构、原图关联、所有包含“如图”的第一章题目是否具有原材料题图，以及 PDF/离线单文件结构。
