<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <h2>欢迎使用 DeepSeek 部署平台</h2>
            </div>
          </template>
          <div class="card-content">
            <p>这是一个用于部署和管理 DeepSeek 模型的平台。您可以：</p>
            <el-row :gutter="20" class="feature-list">
              <el-col :span="8">
                <el-card shadow="hover">
                  <el-icon><Upload /></el-icon>
                  <h3>部署模型</h3>
                  <p>上传并部署您的 DeepSeek 模型到服务器</p>
                  <el-button type="primary" @click="$router.push('/deploy')"
                    >开始部署</el-button
                  >
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover">
                  <el-icon><Monitor /></el-icon>
                  <h3>监控状态</h3>
                  <p>实时监控模型运行状态和性能指标</p>
                  <el-button type="primary" @click="$router.push('/status')"
                    >查看状态</el-button
                  >
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover">
                  <el-icon><ChatDotRound /></el-icon>
                  <h3>开始对话</h3>
                  <p>与 DeepSeek 模型进行智能对话</p>
                  <el-button type="primary" @click="$router.push('/chat')"
                    >开始对话</el-button
                  >
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { Upload, Monitor, ChatDotRound } from "@element-plus/icons-vue";
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
}

.feature-list {
  margin-top: 30px;
}

.el-card {
  text-align: center;
  padding: 20px;
}

.el-icon {
  font-size: 40px;
  color: #409eff;
  margin-bottom: 15px;
}

h3 {
  margin: 15px 0;
  color: #303133;
}

p {
  color: #606266;
  margin-bottom: 20px;
}
</style>
