# DeepSeek 部署平台

这是一个用于部署和管理 DeepSeek 模型的 Web 平台，使用 Vue 3 + Vite 构建前端，FastAPI 构建后端。

## 功能特点

- 模型部署管理
- 实时状态监控
- GPU 使用率监控
- 内存使用监控
- 请求统计

## 项目结构

```
deepseek-web/
├── src/                # 前端源代码
│   ├── views/         # 页面组件
│   ├── router/        # 路由配置
│   └── App.vue        # 主应用组件
├── backend/           # 后端源代码
│   ├── main.py        # FastAPI 应用
│   └── requirements.txt # Python 依赖
└── README.md          # 项目说明
```

## 安装和运行

### 前端

1. 安装依赖：
```bash
npm install
```

2. 运行开发服务器：
```bash
npm run dev
```

### 后端

1. 创建虚拟环境（可选）：
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. 安装依赖：
```bash
cd backend
pip install -r requirements.txt
```

3. 运行后端服务器：
```bash
python main.py
```

## 使用说明

1. 访问 http://localhost:5173 打开前端界面
2. 在部署页面配置模型参数
3. 点击部署按钮开始部署
4. 在状态页面监控模型运行情况

## 注意事项

- 确保服务器有足够的 GPU 内存
- 建议在生产环境中配置适当的安全措施
- 根据实际需求修改配置文件

## 开发计划

- [ ] 添加用户认证
- [ ] 支持多模型部署
- [ ] 添加模型版本管理
- [ ] 优化性能监控
- [ ] 添加日志管理

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 许可证

MIT License
