# HXTI （海克斯科技_人格测试）人格测试

科研不是人生全部，累了就当叠心之钢

本项目完全开源，基于 B站UP主 [@蛆肉儿串儿](https://space.bilibili.com/417038183) 的原创测试。

## 在线体验

👉 [点击开始测试](https://DiSecXi.github.io/HXTI/)

## 说明

由于本项目基于https://github.com/pingfanfan 的SBTI项目，因此下面说明中存在一些与本项目不完全对应的内容，不过大体上没什么问题，

内含隐藏人格
内含彩蛋
可以通过点击心之钢图标不断叠钢

## 项目结构

```
├── data/                    # 测试数据（修改这里来定制）
│   ├── questions.json       # 题目和选项
│   ├── dimensions.json      # 15个维度定义
│   ├── types.json           # 人格类型和匹配模式
│   └── config.json          # 评分参数和显示配置
├── src/                     # 源代码
│   ├── engine.js            # 评分算法（纯函数）
│   ├── quiz.js              # 答题流程控制
│   ├── result.js            # 结果页渲染
│   ├── chart.js             # 雷达图（Canvas API）
│   ├── utils.js             # 工具函数
│   ├── main.js              # 入口
│   └── style.css            # 样式（CSS变量主题化）
├── docs/
│   └── analysis.md          # 数据分析报告
└── index.html
```

## 快速开始

```bash
# 克隆项目
git clone https://github.com/DiSecXi/HXTI.git
cd HXTI

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```
中间产生的任何报错直接问AI就能解决

## 致谢

- Hao Wang提供部分创意灵感
- 开源程序提供：https://github.com/pingfanfan
- 原创测试：B站UP主 [@蛆肉儿串儿](https://space.bilibili.com/417038183)（UID: 417038183）
- 原版地址：[B站SBTI测试页面](https://www.bilibili.com/blackboard/era/WijKT2bWuCJWPg8B.html)

## 声明

本测试仅供娱乐，请勿用于任何严肃场景。本项目为开源二创，如有侵权请联系删除。

## License

[MIT](LICENSE)
