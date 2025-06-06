<template>
  <div class="ds-root">
    <!-- 左侧会话栏 -->
    <aside class="ds-sidebar">
      <div class="ds-logo">DeepSeek</div>
      <el-button class="ds-newchat" type="primary" @click="newSession"
        >+ 新建对话</el-button
      >
      <div class="ds-session-list">
        <div
          v-for="session in sessions"
          :key="session.id"
          :class="[
            'ds-session-item',
            { active: session.id === currentSessionId },
          ]"
          @click="switchSession(session.id)"
        >
          <span class="ds-session-title">{{ session.title || "新会话" }}</span>
        </div>
      </div>
    </aside>

    <!-- 主对话区 -->
    <main class="ds-main">
      <header class="ds-header">
        <span class="ds-header-title">DeepSeek 对话</span>
        <el-button type="info" @click="clearCurrentSession" size="small"
          >清空当前会话</el-button
        >
      </header>
      <section
        class="ds-chat-messages"
        ref="messagesContainer"
        v-if="currentSession"
      >
        <div
          v-for="(message, index) in currentSession && currentSession.messages"
          :key="index"
          :class="[
            'ds-message',
            message.role === 'user' ? 'user' : 'assistant',
          ]"
        >
          <div class="ds-message-role">
            {{ message.role === "user" ? "用户" : "DeepSeek" }}
          </div>
          <div
            class="ds-message-content"
            v-html="formatMessage(message.content)"
          ></div>
        </div>
        <div v-if="loading" class="ds-message assistant">
          <div class="ds-message-role">DeepSeek</div>
          <div class="ds-message-content">
            <el-icon class="is-loading"><Loading /></el-icon> 思考中...
          </div>
        </div>
      </section>
      <div v-else>加载会话中...</div>
      <footer class="ds-chat-input">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="2"
          placeholder="请输入您的问题..."
          @keyup.enter.ctrl="sendMessage"
        ></el-input>
        <div class="ds-input-actions">
          <el-button type="primary" @click="sendMessage" :loading="loading"
            >发送</el-button
          >
          <span class="ds-input-tip">Ctrl + Enter 发送</span>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import { Loading } from "@element-plus/icons-vue";
import axios from "axios";
import { marked } from "marked";

// 本地存储key
const STORAGE_KEY = "deepseek_sessions";

// 会话结构：{ id, title, messages: [{role, content}] }
const sessions = ref([]);
const currentSessionId = ref(null);
const inputMessage = ref("");
const loading = ref(false);
const messagesContainer = ref(null);

// 默认欢迎消息
const welcomeMessage =
  "我是 DeepSeek, 很高兴见到你!\n\n我可以帮你写代码、读文件、写各种创意内容, 请把你的任务交给我吧~";

const saveSessions = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.value));
};
const loadSessions = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    sessions.value = JSON.parse(data);
    // 如果加载到会话，确保第一个会话有欢迎消息（如果原本没有）
    if (sessions.value.length > 0 && sessions.value[0].messages.length === 0) {
      sessions.value[0].messages.push({
        role: "assistant",
        content: welcomeMessage,
      });
    }
  } else {
    // 初始化一个新会话并添加欢迎消息
    sessions.value = [
      {
        id: Date.now(),
        title: "新会话",
        messages: [{ role: "assistant", content: welcomeMessage }],
      },
    ];
  }
  // 确保 currentSessionId 指向一个存在的会话，或设为 null 如果 sessions 为空
  currentSessionId.value =
    sessions.value.length > 0 ? sessions.value[0].id : null;
};

const currentSession = computed(() => {
  // 确保即使 sessions 为空，也返回一个带有空 messages 数组的默认对象
  const foundSession = sessions.value.find(
    (s) => s.id === currentSessionId.value
  );
  return (
    foundSession ||
    (sessions.value.length > 0
      ? sessions.value[0]
      : { id: null, title: "加载中...", messages: [] })
  );
});

const formatMessage = (content) => marked(content);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning("请输入消息");
    return;
  }
  if (!currentSession.value) {
    ElMessage.error("当前会话未加载或不存在。");
    loading.value = false;
    return;
  }
  const userMessage = inputMessage.value;
  currentSession.value.messages.push({ role: "user", content: userMessage });
  inputMessage.value = "";
  loading.value = true;
  saveSessions();
  await scrollToBottom();
  try {
    const response = await axios.post("http://localhost:8000/api/chat", {
      message: userMessage,
      history: currentSession.value.messages.slice(0, -1), // 发送历史消息
    });
    currentSession.value.messages.push({
      role: "assistant",
      content: response.data.response,
    });
    saveSessions();
  } catch (error) {
    ElMessage.error(
      "发送消息失败：" +
        (error.response?.data?.detail || error.message || "未知错误")
    );
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
};

const newSession = () => {
  const newId = Date.now();
  // 创建新会话并添加欢迎消息
  const sessionToAdd = {
    id: newId,
    title: "新会话",
    messages: [{ role: "assistant", content: welcomeMessage }],
  };
  sessions.value.unshift(sessionToAdd);
  currentSessionId.value = newId;
  saveSessions();
};

const switchSession = (id) => {
  currentSessionId.value = id;
  saveSessions();
  scrollToBottom();
};

const clearCurrentSession = () => {
  if (!currentSession.value) {
    ElMessage.error("当前会话未加载或不存在。");
    return;
  }
  currentSession.value.messages = [];
  // 清空后添加欢迎消息
  currentSession.value.messages.push({
    role: "assistant",
    content: welcomeMessage,
  });
  saveSessions();
};

// 自动保存标题（以首条用户消息为标题）
watch(
  () => currentSession.value,
  (session) => {
    // 只有当会话存在，并且消息长度大于 1，且没有标题时才生成标题
    if (
      session &&
      session.messages &&
      session.messages.length > 1 &&
      !session.title
    ) {
      const first = session.messages.find((m) => m.role === "user"); // 找到第一条用户消息
      if (first) {
        session.title =
          first.content.slice(0, 12) + (first.content.length > 12 ? "..." : "");
        saveSessions();
      }
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  loadSessions();
  scrollToBottom();
});
</script>

<style scoped>
.ds-root {
  display: flex;
  height: 100vh;
  background: #f7f8fa;
}
.ds-sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 0 0;
}
.ds-logo {
  font-size: 22px;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 24px;
}
.ds-newchat {
  width: 80%;
  margin-bottom: 18px;
}
.ds-session-list {
  flex: 1;
  width: 100%;
  overflow-y: auto;
}
.ds-session-item {
  padding: 12px 32px;
  cursor: pointer;
  color: #333;
  transition: background 0.2s;
}
.ds-session-item.active,
.ds-session-item:hover {
  background: #f0f6ff;
  color: #2563eb;
}
.ds-session-title {
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ds-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.ds-header {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  font-size: 18px;
  font-weight: 500;
}
.ds-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 32px 0 32px 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: #f7f8fa;
}
.ds-message {
  max-width: 60%;
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 8px;
  word-break: break-all;
}
.ds-message.user {
  align-self: flex-end;
  background: none;
}
.ds-message.assistant {
  align-self: flex-start;
  background: none;
}
.ds-message-role {
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}
.ds-message-content {
  background: #fff;
  border-radius: 8px;
  padding: 14px 18px;
  font-size: 15px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}
.ds-message.user .ds-message-content {
  background: #2563eb;
  color: #fff;
}
.ds-chat-input {
  background: #fff;
  border-top: 1px solid #e4e7ed;
  padding: 18px 32px 18px 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ds-input-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}
.ds-input-tip {
  color: #909399;
  font-size: 12px;
}
</style>
