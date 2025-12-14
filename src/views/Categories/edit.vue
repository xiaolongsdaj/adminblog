<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 获取分类ID
const categoryId = route.params.id as string
const isEditMode = !!categoryId

// 分类表单数据
const categoryForm = reactive({
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
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入分类描述', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ]
}

// 加载分类数据（编辑模式）
const loadCategoryData = () => {
  if (!isEditMode) return

  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    // 模拟分类数据
    const mockCategory = {
      id: 1,
      name: '前端开发',
      description: '前端开发相关文章'
    }
    
    // 填充表单数据
    categoryForm.name = mockCategory.name
    categoryForm.description = mockCategory.description
    
    loading.value = false
  }, 1000)
}

// 保存分类
const saveCategory = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      saving.value = true
      
      // 模拟API请求
      setTimeout(() => {
        saving.value = false
        
        if (isEditMode) {
          ElMessage.success('分类更新成功')
        } else {
          ElMessage.success('分类创建成功')
        }
        
        // 返回分类列表页
        router.push('/categories')
      }, 1500)
    }
  })
}

// 返回分类列表
const goBack = () => {
  router.back()
}

// 组件挂载时加载数据
onMounted(() => {
  loadCategoryData()
})
</script>

<template>
  <div class="category-edit">
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
        <h1>{{ isEditMode ? '编辑分类' : '新增分类' }}</h1>
        <p>{{ isEditMode ? '修改现有分类的信息' : '创建一个新的分类' }}</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          :icon="Check"
          @click="saveCategory"
          :loading="saving"
          class="save-button"
        >
          {{ isEditMode ? '保存修改' : '创建分类' }}
        </el-button>
      </div>
    </div>

    <el-card class="form-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="categoryForm"
        :rules="rules"
        label-width="100px"
        class="category-form"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="categoryForm.name"
            placeholder="请输入分类名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="分类描述" prop="description">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入分类描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.category-edit {
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

.category-form {
  padding: 20px 0;
}
</style>