<template>
  <div class="deploy">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>部署 DeepSeek 模型</h2>
        </div>
      </template>

      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
        <el-form-item label="模型文件" prop="modelFile">
          <el-upload
            class="upload-demo"
            drag
            action="/api/upload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将模型文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">支持上传 DeepSeek 模型文件</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="服务器地址" prop="serverUrl">
          <el-input
            v-model="form.serverUrl"
            placeholder="请输入服务器地址，例如：http://localhost:8000"
          ></el-input>
        </el-form-item>

        <el-form-item label="模型配置">
          <el-input
            v-model="form.config"
            type="textarea"
            :rows="6"
            placeholder="请输入模型配置（JSON格式）"
          ></el-input>
        </el-form-item>

        <el-form-item label="部署选项">
          <el-checkbox v-model="form.options.autoStart"
            >自动启动服务</el-checkbox
          >
          <el-checkbox v-model="form.options.enableMonitoring"
            >启用监控</el-checkbox
          >
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleDeploy" :loading="deploying"
            >开始部署</el-button
          >
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import axios from "axios";

const formRef = ref(null);
const deploying = ref(false);

const form = reactive({
  serverUrl: "http://localhost:8000",
  modelPath: "",
  config: JSON.stringify(
    {
      model_name: "deepseek-coder",
      max_length: 2048,
      temperature: 0.7,
      top_p: 0.95,
    },
    null,
    2
  ),
  options: {
    autoStart: true,
    enableMonitoring: true,
  },
});

const rules = {
  serverUrl: [
    { required: true, message: "请输入服务器地址", trigger: "blur" },
    {
      pattern: /^https?:\/\/.+/,
      message: "请输入有效的URL地址",
      trigger: "blur",
    },
  ],
};

const handleUploadSuccess = (response) => {
  form.modelPath = response.model_path;
  ElMessage.success("模型上传成功");
};

const handleUploadError = (error) => {
  ElMessage.error("模型上传失败：" + (error.message || "未知错误"));
};

const beforeUpload = (file) => {
  // 这里可以添加文件类型和大小的验证
  return true;
};

const handleDeploy = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (!form.modelPath) {
        ElMessage.warning("请先上传模型文件");
        return;
      }

      deploying.value = true;
      try {
        const response = await axios.post(`${form.serverUrl}/api/deploy`, {
          modelPath: form.modelPath,
          config: JSON.parse(form.config),
          options: form.options,
        });

        ElMessage.success("部署成功！");
      } catch (error) {
        ElMessage.error("部署失败：" + (error.message || "未知错误"));
      } finally {
        deploying.value = false;
      }
    }
  });
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  form.modelPath = "";
};
</script>

<style scoped>
.deploy {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-form {
  margin-top: 20px;
}

.upload-demo {
  width: 100%;
}
</style>
