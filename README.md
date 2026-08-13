# 海克斯科技人格测试（HXTI）

科研不是人生全部，累了就当叠心之钢

## 在线体验

👉 [点击开始测试](https://DiSecXi.github.io/HXTI/)

## 说明


可通过点击心之钢图标不断叠钢


## 项目结构

```
├── data/                    # 测试数据
│   ├── questions.json       # 题目和选项
│   ├── dimensions.json      # 15个维度定义（当前不显示）
│   ├── types.json           # 人格类型和匹配模式
│   └── config.json          # 评分参数和显示配置
├── src/                     # 源代码
│   ├── engine.js            # 评分算法（纯函数）
│   ├── quiz.js              # 答题流程控制
│   ├── result.js            # 结果页渲染
│   ├── chart.js             # 雷达图（Canvas API）（当前不显示）
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
```
中间产生的任何报错直接问AI就能解决

## 致谢

- 开源代码提供：https://github.com/pingfanfan（但本人进行了全面的修改）
- 原创测试：B站UP主 [@蛆肉儿串儿](https://space.bilibili.com/417038183)（UID: 417038183）
- 原版地址：[B站SBTI测试页面](https://www.bilibili.com/blackboard/era/WijKT2bWuCJWPg8B.html)
- Hao W 提供部分创意灵感
- Yue Y 文本修正，配色建议
- KIMI，ChatGPT

## 声明

本测试仅供娱乐，请勿用于任何严肃场景。本项目为开源二创，如有侵权请联系删除。
本项目完全开源，基于 B站UP主 [@蛆肉儿串儿](https://space.bilibili.com/417038183) 的原创测试。
并基于https://github.com/pingfanfan 的SBTI开源项目，但本人进行了全面修改，包括：问题内容，人格内容，计算方式，UI样式，交互方式等。

## 备注
第5/31题是固定插入题目中的，如果选择透明人，则还会被插入第6/32题，但是在回测时应该忽略第5/31题以及第6/32题，并且如果第5/31题没有选择小透明，则第6/32题不会出现，而且在回测中仍然要忽略第5/31题。


## License

[MIT](LICENSE)
