<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 获取标签ID
const tagId = route.params.id as string
const isEditMode = !!tagId

// 标签表单数据
const tagForm = reactive({
  name: '',
  description: ''
})

// 加载状态
const loading = ref(false)
const saving = ref(false)

// 表单验证
const formRef = ref()
const rules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入标签描述', trigger: 'blur' },
    { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
  ]
}

// 加载标签数据（编辑模式）
const loadTagData = () => {
  if (!isEditMode) return

  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    // 模拟标签数据
    const mockTag = {
      id: 1,
      name: 'Vue',
      description: 'Vue.js 框架相关标签'
    }
    
    // 填充表单数据
    tagForm.name = mockTag.name
    tagForm.description = mockTag.description
    
    loading.value = false
  }, 1000)
}

// 保存标签
const saveTag = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      saving.value = true
      
      // 模拟API请求
      setTimeout(() => {
        saving.value = false
        
        if (isEditMode) {
          ElMessage.success('标签更新成功')
        } else {
          ElMessage.success('标签创建成功')
        }
        
        // 返回标签列表页
        router.push('/tags')
      }, 1500)
    }
  })
}

// 返回标签列表
const goBack = () => {
  router.back()
}

// 组件挂载时加载数据
onMounted(() => {
  loadTagData()
})
</script>

<template>
  <div class="tag-edit">
    <div class="page-header">
      <div class="header-left">
        <el-button
          type="default"
          :icon="ArrowLeft"
          @click="goBack"
          class="back-button"
        >
          返回
        </el-button>
        <h1>{{ isEditMode ? '编辑标签' : '新增标签' }}</h1>
        <p>{{ isEditMode ? '修改现有标签的信息' : '创建一个新的标签' }}</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          :icon="Check"
          @click="saveTag"
          :loading="saving"
          class="save-button"
        >
          {{ isEditMode ? '保存修改' : '创建标签' }}
        </el-button>
      </div>
    </div>

    <el-card class="form-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="tagForm"
        :rules="rules"
        label-width="100px"
        class="tag-form"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input
            v-model="tagForm.name"
            placeholder="请输入标签名称"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="标签描述" prop="description">
          <el-input
            v-model="tagForm.description"
            type="textarea"
            rows="3"
            placeholder="请输入标签描述"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.tag-edit {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.back-button {
  margin-right: 20px;
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

.save-button {
  padding: 0 30px;
  height: 40px;
}

.form-card {
  border-radius: 8px;
}

.tag-form {
  padding: 20px 0;
}
</style>