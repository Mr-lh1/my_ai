<template>
  <div class="status">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <h2>模型运行状态</h2>
              <el-button
                type="primary"
                @click="refreshStatus"
                :loading="loading"
              >
                刷新状态
              </el-button>
            </div>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="模型名称">{{
              status.modelName
            }}</el-descriptions-item>
            <el-descriptions-item label="运行状态">
              <el-tag :type="status.isRunning ? 'success' : 'danger'">
                {{ status.isRunning ? "运行中" : "已停止" }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="GPU使用率">
              <el-progress
                :percentage="status.gpuUsage"
                :status="getGpuStatus(status.gpuUsage)"
              />
            </el-descriptions-item>
            <el-descriptions-item label="内存使用率">
              <el-progress
                :percentage="status.memoryUsage"
                :status="getMemoryStatus(status.memoryUsage)"
              />
            </el-descriptions-item>
            <el-descriptions-item label="请求数">{{
              status.requestCount
            }}</el-descriptions-item>
            <el-descriptions-item label="平均响应时间"
              >{{ status.avgResponseTime }}ms</el-descriptions-item
            >
          </el-descriptions>

          <div class="charts-container">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="chart-card">
                  <template #header>
                    <div class="chart-header">
                      <span>GPU使用率趋势</span>
                    </div>
                  </template>
                  <div class="chart-placeholder">
                    <!-- 这里可以集成echarts等图表库 -->
                    <p>GPU使用率趋势图</p>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="chart-card">
                  <template #header>
                    <div class="chart-header">
                      <span>请求响应时间分布</span>
                    </div>
                  </template>
                  <div class="chart-placeholder">
                    <!-- 这里可以集成echarts等图表库 -->
                    <p>响应时间分布图</p>
                  </div>
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
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

const loading = ref(false);
const status = ref({
  modelName: "deepseek-coder",
  isRunning: true,
  gpuUsage: 75,
  memoryUsage: 60,
  requestCount: 1234,
  avgResponseTime: 150,
});

const getGpuStatus = (usage) => {
  if (usage > 90) return "exception";
  if (usage > 70) return "warning";
  return "success";
};

const getMemoryStatus = (usage) => {
  if (usage > 90) return "exception";
  if (usage > 70) return "warning";
  return "success";
};

const refreshStatus = async () => {
  loading.value = true;
  try {
    // 这里替换为实际的API调用
    const response = await axios.get("/api/status");
    status.value = response.data;
    ElMessage.success("状态更新成功");
  } catch (error) {
    ElMessage.error("获取状态失败：" + (error.message || "未知错误"));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  refreshStatus();
});
</script>

<style scoped>
.status {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.charts-container {
  margin-top: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-header {
  font-weight: bold;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.el-descriptions {
  margin-bottom: 20px;
}
</style>
