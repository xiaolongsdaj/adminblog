<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { Check, Upload, ArrowLeft } from '@element-plus/icons-vue'
import 'vditor/dist/index.css'
import Vditor from 'vditor'

const route = useRoute()
const router = useRouter()

// 获取文章ID
const articleId = route.params.id as string
const isEditMode = !!articleId

// 文章表单数据
const articleForm = reactive({
  title: '',
  category: '',
  tags: [] as string[],
  status: 'draft',
  coverImage: '',
  summary: '',
  content: ''
})

// 分类选项
const categoryOptions = [
  { label: '前端开发', value: '前端开发' },
  { label: '后端开发', value: '后端开发' },
  { label: 'UI框架', value: 'UI框架' },
  { label: '性能优化', value: '性能优化' },
  { label: '数据库', value: '数据库' }
]

// 标签选项
const tagOptions = [
  { label: 'Vue', value: 'Vue' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'Element Plus', value: 'Element Plus' },
  { label: '前端', value: '前端' },
  { label: '性能优化', value: '性能优化' }
]

// 状态选项
const statusOptions = [
  { label: '草稿', value: 'draft' },
  { label: '待审核', value: 'pending' },
  { label: '已发布', value: 'published' }
]

// 文件上传列表
const fileList = ref<Array<any>>([])

// Vditor实例
const vditorRef = ref<HTMLElement | null>(null)
let vditor: Vditor | null = null

// 加载状态
const loading = ref(false)
const saving = ref(false)

// 标签页状态
const activeTab = ref('basic')

// 表单验证
const formRef = ref()
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  summary: [
    { required: true, message: '请输入文章摘要', trigger: 'blur' },
    { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
}

// 初始化Vditor编辑器
const initVditor = () => {
  if (vditorRef.value) {
    vditor = new Vditor(vditorRef.value, {
      height: 600,
      mode: 'sv',
      toolbar: [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        'link',
        'image',
        'list',
        'ordered-list',
        'check',
        'outdent',
        'indent',
        'quote',
        'code',
        'table',
        'undo',
        'redo',
        'save',
        'fullscreen'
      ],
      after: () => {
        if (isEditMode) {
          // 如果是编辑模式，加载文章内容
          loadArticleData()
        }
      }
    })
  }
}

// 加载文章数据（编辑模式）
const loadArticleData = () => {
  if (!isEditMode) return

  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    // 模拟文章数据
    const mockArticle = {
      id: 1,
      title: 'Vue 3 Composition API 入门指南',
      category: '前端开发',
      tags: ['Vue', 'JavaScript', '前端'],
      status: 'published',
      coverImage: 'https://via.placeholder.com/800x400',
      summary: 'Vue 3 Composition API 是 Vue 3 引入的新特性，提供了更灵活的组件逻辑组织方式...',
      content: '# Vue 3 Composition API 入门指南\n\n## 什么是 Composition API\n\nComposition API 是 Vue 3 引入的新特性，它提供了一种更灵活的方式来组织组件逻辑...' 
    }
    
    // 填充表单数据
    articleForm.title = mockArticle.title
    articleForm.category = mockArticle.category
    articleForm.tags = mockArticle.tags
    articleForm.status = mockArticle.status
    articleForm.coverImage = mockArticle.coverImage
    articleForm.summary = mockArticle.summary
    
    // 设置编辑器内容
    if (vditor) {
      vditor.setValue(mockArticle.content)
    }
    
    loading.value = false
  }, 1000)
}

// 保存文章
const saveArticle = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      saving.value = true
      
      // 获取编辑器内容
      if (vditor) {
        articleForm.content = vditor.getValue()
      }
      
      // 模拟API请求
      setTimeout(() => {
        saving.value = false
        
        if (isEditMode) {
          ElMessage.success('文章更新成功')
        } else {
          ElMessage.success('文章创建成功')
        }
        
        // 返回文章列表页
        router.push('/articles')
      }, 1500)
    }
  })
}

// 上传封面图片
const handleCoverUpload = (_file: File) => {
  // 模拟图片上传
  const loading = ElLoading.service({
    lock: true,
    text: '上传中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    // 模拟上传成功后的图片URL
    articleForm.coverImage = 'https://via.placeholder.com/800x400'
    loading.close()
    ElMessage.success('封面图片上传成功')
  }, 1000)
  
  return false // 阻止默认上传
}

// 返回文章列表
const goBack = () => {
  router.back()
}

// 组件挂载时初始化编辑器
onMounted(() => {
  initVditor()
})



// 监听路由变化，重新加载数据
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadArticleData()
  }
})
</script>

<template>
  <div class="article-edit">
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
        <h1>{{ isEditMode ? '编辑文章' : '新增文章' }}</h1>
        <p>{{ isEditMode ? '修改现有文章的内容' : '创建一篇新的博客文章' }}</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          :icon="Check"
          @click="saveArticle"
          :loading="saving"
          class="save-button"
        >
          {{ isEditMode ? '保存修改' : '发布文章' }}
        </el-button>
      </div>
    </div>

    <el-card class="form-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="articleForm"
        :rules="rules"
        label-width="100px"
        class="article-form"
      >
        <!-- 基本信息 -->
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-form-item label="文章标题" prop="title">
              <el-input
                v-model="articleForm.title"
                placeholder="请输入文章标题"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="文章分类" prop="category">
              <el-select
                v-model="articleForm.category"
                placeholder="请选择文章分类"
                clearable
              >
                <el-option
                  v-for="option in categoryOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="文章标签">
              <el-select
                v-model="articleForm.tags"
                placeholder="请选择文章标签"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="option in tagOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="文章状态">
              <el-select
                v-model="articleForm.status"
                placeholder="请选择文章状态"
              >
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="封面图片">
              <el-upload
                v-model:file-list="fileList"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="(file: any) => handleCoverUpload(file.raw as File)"
                class="cover-upload"
              >
                <el-button :icon="Upload" type="primary">上传封面</el-button>
                <span class="tip">建议尺寸：800x400px</span>
              </el-upload>
              <div v-if="articleForm.coverImage" class="cover-preview">
                <img :src="articleForm.coverImage" alt="封面预览" class="cover-image" />
              </div>
            </el-form-item>

            <el-form-item label="文章摘要" prop="summary">
              <el-input
                v-model="articleForm.summary"
                type="textarea"
                rows="3"
                placeholder="请输入文章摘要"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-tab-pane>

          <!-- 文章内容 -->
          <el-tab-pane label="文章内容" name="content">
            <el-form-item prop="content">
              <div ref="vditorRef"></div>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.article-edit {
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

.article-form {
  padding: 20px 0;
}

.cover-upload {
  display: flex;
  align-items: center;
}

.tip {
  margin-left: 10px;
  color: #999;
  font-size: 12px;
}

.cover-preview {
  margin-top: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  max-width: 400px;
}

.cover-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

/* Vditor编辑器样式 */
:deep(.vditor) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.vditor-toolbar) {
  border-bottom: 1px solid #dcdfe6;
}
</style>