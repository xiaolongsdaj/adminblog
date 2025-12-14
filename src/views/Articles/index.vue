<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, Edit, Delete, Refresh, Check, DocumentAdd, Filter 
} from '@element-plus/icons-vue'

const router = useRouter()

// 文章列表数据
const articles = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 入门指南',
    author: 'admin',
    category: '前端开发',
    tags: ['Vue', 'JavaScript', '前端'],
    status: 'published',
    views: 1234,
    comments: 45,
    createdAt: '2024-01-15 14:30:00',
    updatedAt: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    title: 'Element Plus 组件库的高级用法',
    author: 'admin',
    category: 'UI框架',
    tags: ['Element Plus', 'Vue', 'UI'],
    status: 'published',
    views: 892,
    comments: 28,
    createdAt: '2024-01-14 10:20:00',
    updatedAt: '2024-01-14 10:20:00'
  },
  {
    id: 3,
    title: 'TypeScript 在 Vue 项目中的实践',
    author: 'admin',
    category: '前端开发',
    tags: ['TypeScript', 'Vue', '前端'],
    status: 'draft',
    views: 0,
    comments: 0,
    createdAt: '2024-01-13 16:45:00',
    updatedAt: '2024-01-13 16:45:00'
  },
  {
    id: 4,
    title: '前端性能优化实战',
    author: 'admin',
    category: '性能优化',
    tags: ['性能优化', '前端', 'JavaScript'],
    status: 'published',
    views: 2341,
    comments: 89,
    createdAt: '2024-01-12 09:15:00',
    updatedAt: '2024-01-12 09:15:00'
  },
  {
    id: 5,
    title: 'Vue Router 路由管理最佳实践',
    author: 'admin',
    category: '前端开发',
    tags: ['Vue Router', 'Vue', '前端'],
    status: 'pending',
    views: 0,
    comments: 0,
    createdAt: '2024-01-11 15:20:00',
    updatedAt: '2024-01-11 15:20:00'
  }
])

// 分页配置
const pagination = reactive({
  total: articles.value.length,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [5, 10, 20, 50]
})

// 筛选条件
const filters = reactive({
  keyword: '',
  category: '',
  status: '',
  tags: []
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
  { label: '全部', value: '' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '待审核', value: 'pending' },
  { label: '已下线', value: 'offline' }
]

// 选中的文章ID
const selectedArticleIds = ref<number[]>([])

// 表格加载状态
const loading = ref(false)

// 切换筛选面板
const showFilterPanel = ref(false)

// 添加新文章
const handleAddArticle = () => {
  router.push('/articles/edit')
}

// 编辑文章
const handleEditArticle = (id: number) => {
  router.push(`/articles/edit/${id}`)
}

// 删除文章
const handleDeleteArticle = (id: number) => {
  ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API删除
    const index = articles.value.findIndex(article => article.id === id)
    if (index !== -1) {
      articles.value.splice(index, 1)
      pagination.total = articles.value.length
      ElMessage.success('文章删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量删除文章
const handleBatchDelete = () => {
  if (selectedArticleIds.value.length === 0) {
    ElMessage.warning('请选择要删除的文章')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的${selectedArticleIds.value.length}篇文章吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API批量删除
    articles.value = articles.value.filter(article => !selectedArticleIds.value.includes(article.id))
    pagination.total = articles.value.length
    selectedArticleIds.value = []
    ElMessage.success('文章删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量发布文章
const handleBatchPublish = () => {
  if (selectedArticleIds.value.length === 0) {
    ElMessage.warning('请选择要发布的文章')
    return
  }

  // 实际项目中这里应该调用API批量发布
  articles.value.forEach(article => {
    if (selectedArticleIds.value.includes(article.id)) {
      article.status = 'published'
    }
  })
  selectedArticleIds.value = []
  ElMessage.success('文章发布成功')
}

// 刷新文章列表
const handleRefresh = () => {
  loading.value = true
  // 实际项目中这里应该调用API重新获取数据
  setTimeout(() => {
    loading.value = false
    ElMessage.success('文章列表已刷新')
  }, 1000)
}

// 筛选文章
const handleFilter = () => {
  // 实际项目中这里应该调用API筛选数据
  pagination.currentPage = 1
  ElMessage.success('筛选条件已应用')
}

// 重置筛选条件
const handleResetFilter = () => {
  Object.assign(filters, {
    keyword: '',
    category: '',
    status: '',
    tags: []
  })
  pagination.currentPage = 1
}

// 格式化状态文本
const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    pending: '待审核',
    offline: '已下线'
  }
  return statusMap[status] || status
}

// 格式化状态标签类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    published: 'success',
    draft: 'info',
    pending: 'warning',
    offline: 'danger'
  }
  return typeMap[status] || 'info'
}

// 页码变化
const handlePageChange = (page: number) => {
  pagination.currentPage = page
}

// 每页条数变化
const handlePageSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

// 表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedArticleIds.value = selection.map(item => item.id)
}
</script>

<template>
  <div class="articles-list">
    <div class="page-header">
      <div class="header-left">
        <h1>文章管理</h1>
        <p>管理您的博客文章，支持新增、编辑、删除和发布</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          :icon="DocumentAdd"
          @click="handleAddArticle"
        >
          新增文章
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card class="search-filter-card" shadow="hover">
      <div class="search-filter">
        <div class="search-bar">
          <el-input
            v-model="filters.keyword"
            placeholder="搜索文章标题或内容"
            :prefix-icon="Search"
            clearable
            class="search-input"
          >
            <template #append>
              <el-button :icon="Filter" @click="showFilterPanel = !showFilterPanel" />
              <el-button type="primary" :icon="Search" @click="handleFilter">
                搜索
              </el-button>
            </template>
          </el-input>
        </div>

        <!-- 高级筛选面板 -->
        <div v-if="showFilterPanel" class="filter-panel">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8">
              <el-select
                v-model="filters.category"
                placeholder="选择分类"
                clearable
              >
                <el-option
                  v-for="option in categoryOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-select
                v-model="filters.status"
                placeholder="选择状态"
                clearable
              >
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-select
                v-model="filters.tags"
                placeholder="选择标签"
                multiple
              >
                <el-option
                  v-for="option in tagOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-col>
          </el-row>
          <div class="filter-actions">
            <el-button type="primary" @click="handleFilter">应用筛选</el-button>
            <el-button @click="handleResetFilter">重置</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="action-left">
        <el-button 
          type="default" 
          :icon="Refresh" 
          @click="handleRefresh"
          :loading="loading"
        >
          刷新
        </el-button>
        <el-button 
          type="primary" 
          :icon="Check" 
          @click="handleBatchPublish"
          :disabled="selectedArticleIds.length === 0"
        >
          批量发布
        </el-button>
        <el-button 
          type="danger" 
          :icon="Delete" 
          @click="handleBatchDelete"
          :disabled="selectedArticleIds.length === 0"
        >
          批量删除
        </el-button>
      </div>
      <div class="action-right">
        <span>已选择 {{ selectedArticleIds.length }} 项</span>
      </div>
    </div>

    <!-- 文章列表表格 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        v-loading="loading"
        :data="articles"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="title"
          label="文章标题"
          min-width="300"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span class="article-title">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="category"
          label="分类"
          width="120"
        >
          <template #default="scope">
            <el-tag>{{ scope.row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="tags"
          label="标签"
          width="150"
        >
          <template #default="scope">
            <el-tag
              v-for="tag in scope.row.tags"
              :key="tag"
              size="small"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          width="100"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="100"
        >
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ formatStatus(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="views"
          label="浏览量"
          width="100"
        />
        <el-table-column
          prop="comments"
          label="评论数"
          width="100"
        />
        <el-table-column
          prop="createdAt"
          label="创建时间"
          width="180"
        />
        <el-table-column
          prop="updatedAt"
          label="更新时间"
          width="180"
        />
        <el-table-column
          label="操作"
          width="150"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleEditArticle(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDeleteArticle(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.articles-list {
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

.search-filter-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.search-filter {
  padding: 10px 0;
}

.search-bar {
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
}

.filter-panel {
  padding: 15px 0;
  border-top: 1px dashed #eee;
}

.filter-actions {
  margin-top: 15px;
  text-align: right;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.action-left {
  display: flex;
  gap: 10px;
}

.action-right {
  color: #666;
  font-size: 14px;
}

.table-card {
  border-radius: 8px;
}

.tag-item {
  margin-right: 5px;
}

.article-title {
  font-weight: 500;
  color: #333;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>