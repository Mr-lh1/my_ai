import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// 允许跨域
app.use(cors());
app.use(express.json());

// 健康检查接口
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 聊天接口
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  // 检查是否是特定问题
  if (message === "你是谁") {
    return res.json({ response: "我是历辰佳" });
  }

  // 构建对话历史
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    ...(history || []),
    { role: "user", content: message },
  ];

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer sk-ce96bd2e36fd4f7abe610361651fab67`,
        },
      }
    );

    res.json({ response: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      detail:
        "聊天服务出错: " + (err.response?.data?.error?.message || err.message),
    });
  }
});

// 开发环境下的本地服务器
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Node.js DeepSeek 后端已启动: http://localhost:${PORT}`);
  });
}

// 导出 app 用于 Vercel
export default app;
