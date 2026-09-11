# Maths · 循题七上数学家长组卷

面向家长的鲁教版五四制数学七年级上册同步题库应用。按教材内容选择课时和题型，先查看例题，再勾选练习题组卷，分别打印学生练习卷和家长答案解析卷。

## 使用

- **离线使用**：下载整个仓库后，用浏览器打开 `outputs/循题-七上数学家长组卷.html`，无需安装依赖或联网。
- **本地开发**：安装 Node.js（开发时使用 Node 24），在仓库根目录执行 `npm start`，打开 `http://127.0.0.1:4173/`。
- **重新导出离线文件**：`npm run build:offline`。
- **校验题库及离线文件**：`npm test`。
- **导出结构化题库及 SQL**：`npm run export:data`。

没有第三方运行时依赖，不需要 `npm install`。打印窗口可选择实体打印机或保存为 PDF。

## 已实现

- 六章教材目录、26 节和六章复习；按内容拆分建议课时。
- 49 个题型、49 道讲解例题和 147 道练习题。
- 每个题型包含基础、提高、压轴三个层级练习，支持选择、填空、计算、证明、作图、解答六类形式。
- 知识要点、解题方法、易错提醒、答案与分步解析。
- 当前节、当前章、全册范围筛选；跨章节组卷、调整题序和按形式整理。
- 学生卷与家长答案卷分开输出；标题、留白和是否附例题可配置。
- 组卷草稿保存在当前浏览器的 localStorage；无账号、自动判题或学习进度判定。

## 目录

| 路径 | 内容 |
| --- | --- |
| `dist/` | 应用源文件及可直接托管的静态网页；这里的文件是手写源文件，不应作为普通构建缓存删除 |
| `outputs/` | 可独立打开的离线应用与使用说明 |
| `data/question-bank.json` | 从实际应用导出的完整教材、题型、例题、练习及解析 |
| `database/question-bank.sql` | SQLite 兼容数据库结构及全量数据，可导入成数据库文件 |
| `docs/` | 需求确认、架构说明、开发过程和验证记录 |
| `scripts/` | 可重复执行的数据导出及历史归档恢复脚本 |
| `work/*.mjs` | 创建过程中使用的预览、检查、离线导出和打包脚本，保留原样 |
| `work/site-package/` | 当时准备发布的历史静态包快照，不是当前权威源文件 |
| `work/xunti-site.tar.gz.base64` | 历史二进制发布包的完整 Base64 归档，可无损恢复 |
| `.openai/hosting.json` | 当时创建的 Sites 配置记录，不包含凭据，不代表已经上线 |
| `docs/upload-manifest.json` | 上传文件清单、字节数、SHA-256 和 Git blob SHA-1，便于核对 |

## 题库与数据库

应用当前从 `dist/data.js`、`chapter2.js`～`chapter6.js`、`reviews.js` 读取题库，`diagrams.js` 补充示意图。修改题库后运行 `npm run export:data` 与 `npm run build:offline`，同步导出文件。

当前没有后端数据库、用户表或服务器端学生记录。`database/question-bank.sql` 是本次归档时补充的结构化数据导出；应用不会自动连接此数据库。

可用 Python 3 导入 SQL：

```python
import pathlib, sqlite3
db = sqlite3.connect('question-bank.sqlite')
db.executescript(pathlib.Path('database/question-bank.sql').read_text(encoding='utf-8'))
print(db.execute('SELECT role, COUNT(*) FROM questions GROUP BY role').fetchall())
db.close()
```

恢复历史发布包：`node scripts/restore-archives.mjs`。发布包保留创建时的原始字节，可能早于最终离线网页中的少量文案修改。

## 内容边界与状态

题库为首批原创内容，未穷尽所有考法与变式，难度分级以题型内部递进为主。已完成数据结构检查、部分数值核对和主要操作的浏览器检查；没有进行全题库独立教研审核。教材章、节顺序来自用户提供的封面和目录照片，课时安排按知识点拆分。

GitHub 仓库保存源码与资料，不等于已开通网页托管。此前 Sites 在线发布因本地版本目录写入限制未完成。本次上传不会自动启用 GitHub Pages，也不会改变仓库可见性。
