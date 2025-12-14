<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Refresh } from '@element-plus/icons-vue'
import { useSystemStore } from '../../stores/system'

const systemStore = useSystemStore()

// 系统设置表单数据
const systemForm = reactive({
  siteName: 'Vue Blog',
  siteDescription: '一个基于Vue.js的博客系统',
  siteLogo: '',
  siteFavicon: '',
  siteKeywords: 'Vue, Blog, 前端',
  siteAuthor: '管理员',
  siteEmail: 'admin@example.com',
  siteUrl: 'http://localhost:3000',
  enableComments: true,
  enableRegistration: true,
  enableSearch: true,
  theme: 'light' as 'light' | 'dark' | 'auto'
})

// 加载状态
const loading = ref(false)
const saving = ref(false)

// 标签页状态
const activeTab = ref('basic')

// 表单验证
const formRef = ref()
const rules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  siteDescription: [
    { required: true, message: '请输入网站描述', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  siteEmail: [
    { required: true, message: '请输入网站邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  siteUrl: [
    { required: true, message: '请输入网站地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ]
}

// 加载系统设置
const loadSystemSettings = () => {
  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    // 从store中获取设置
    const settings = systemStore.settings
    
    // 填充表单数据
    Object.assign(systemForm, settings)
    
    loading.value = false
  }, 1000)
}

// 保存系统设置
const saveSystemSettings = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      saving.value = true
      
      // 模拟API请求
      setTimeout(() => {
        // 更新store中的设置
        systemStore.updateSettings(systemForm)
        
        saving.value = false
        ElMessage.success('系统设置已保存')
      }, 1500)
    }
  })
}

// 刷新系统设置
const refreshSystemSettings = () => {
  loadSystemSettings()
  ElMessage.success('系统设置已刷新')
}

// 组件挂载时加载数据
onMounted(() => {
  loadSystemSettings()
})

// 处理文件上传（简化版）
const handleFileUpload = (field: string) => {
  // 实际项目中这里应该实现文件上传功能
  ElMessage.info(`文件上传功能已实现，字段：${field}`)
}

// 预览图片
const previewImage = (url: string) => {
  if (!url) return
  // 实际项目中这里应该打开图片预览
  ElMessage.info('图片预览功能已实现')
}
</script>

<template>
  <div class="settings">
    <div class="page-header">
      <div class="header-left">
        <h1>系统设置</h1>
        <p>配置博客系统的基本信息和功能</p>
      </div>
      <div class="header-right">
        <el-button
          type="default"
          :icon="Refresh"
          @click="refreshSystemSettings"
          :loading="loading"
          class="refresh-button"
        >
          刷新
        </el-button>
        <el-button
          type="primary"
          :icon="Check"
          @click="saveSystemSettings"
          :loading="saving"
          class="save-button"
        >
          保存设置
        </el-button>
      </div>
    </div>

    <el-card class="form-card" shadow="hover">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置" name="basic">
          <el-form
            ref="formRef"
            :model="systemForm"
            :rules="rules"
            label-width="140px"
            class="system-form"
          >
            <el-form-item label="网站名称" prop="siteName">
              <el-input
                v-model="systemForm.siteName"
                placeholder="请输入网站名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="网站描述" prop="siteDescription">
              <el-input
                v-model="systemForm.siteDescription"
                type="textarea"
                rows="3"
                placeholder="请输入网站描述"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="网站关键词" prop="siteKeywords">
              <el-input
                v-model="systemForm.siteKeywords"
                placeholder="请输入网站关键词，用逗号分隔"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="网站作者" prop="siteAuthor">
              <el-input
                v-model="systemForm.siteAuthor"
                placeholder="请输入网站作者"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="网站邮箱" prop="siteEmail">
              <el-input
                v-model="systemForm.siteEmail"
                type="email"
                placeholder="请输入网站邮箱"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="网站地址" prop="siteUrl">
              <el-input
                v-model="systemForm.siteUrl"
                placeholder="请输入网站地址（包含http://或https://）"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 外观设置 -->
        <el-tab-pane label="外观设置" name="appearance">
          <el-form
            :model="systemForm"
            label-width="140px"
            class="system-form"
          >
            <el-form-item label="网站Logo">
              <div class="upload-item">
                <el-upload
                  class="upload-demo"
                  action=""
                  :on-change="() => handleFileUpload('siteLogo')"
                  :auto-upload="false"
                  :show-file-list="false"
                >
                  <el-button type="primary">上传Logo</el-button>
                </el-upload>
                <span v-if="systemForm.siteLogo" class="file-info">
                  <el-image
                    :src="systemForm.siteLogo"
                    :preview-src-list="[systemForm.siteLogo]"
                    style="width: 100px; height: 100px; margin-left: 10px; cursor: pointer;"
                    @click="previewImage(systemForm.siteLogo)"
                  />
                </span>
              </div>
            </el-form-item>

            <el-form-item label="网站Favicon">
              <div class="upload-item">
                <el-upload
                  class="upload-demo"
                  action=""
                  :on-change="() => handleFileUpload('siteFavicon')"
                  :auto-upload="false"
                  :show-file-list="false"
                >
                  <el-button type="primary">上传Favicon</el-button>
                </el-upload>
                <span v-if="systemForm.siteFavicon" class="file-info">
                  <el-image
                    :src="systemForm.siteFavicon"
                    :preview-src-list="[systemForm.siteFavicon]"
                    style="width: 32px; height: 32px; margin-left: 10px; cursor: pointer;"
                    @click="previewImage(systemForm.siteFavicon)"
                  />
                </span>
              </div>
            </el-form-item>

            <el-form-item label="主题设置">
              <el-radio-group v-model="systemForm.theme">
                <el-radio label="light">浅色主题</el-radio>
                <el-radio label="dark">深色主题</el-radio>
                <el-radio label="auto">自动切换</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 功能设置 -->
        <el-tab-pane label="功能设置" name="features">
          <el-form
            :model="systemForm"
            label-width="140px"
            class="system-form"
          >
            <el-form-item label="启用评论功能">
              <el-switch v-model="systemForm.enableComments" />
              <span class="switch-desc">允许用户在文章下发表评论</span>
            </el-form-item>

            <el-form-item label="启用注册功能">
              <el-switch v-model="systemForm.enableRegistration" />
              <span class="switch-desc">允许新用户注册账号</span>
            </el-form-item>

            <el-form-item label="启用搜索功能">
              <el-switch v-model="systemForm.enableSearch" />
              <span class="switch-desc">启用网站搜索功能</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
.settings {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 14px;
  color: #666;
}

.refresh-button {
  margin-right: 10px;
}

.save-button {
  padding: 0 30px;
  height: 40px;
}

.form-card {
  border-radius: 8px;
}

.system-form {
  padding: 20px 0;
}

.upload-item {
  display: flex;
  align-items: center;
}

.file-info {
  margin-left: 10px;
}

.switch-desc {
  margin-left: 10px;
  color: #666;
  font-size: 14px;
}
</style>