<script setup>
import { ElContainer, ElHeader, ElMain } from "element-plus";
</script>

<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <h1>DeepSeek 部署平台</h1>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
}

.el-header {
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>
