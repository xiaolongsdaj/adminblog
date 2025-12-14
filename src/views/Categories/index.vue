<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

// 分类列表数据
const categories = ref([
  {
    id: 1,
    name: '前端开发',
    description: '前端开发相关文章',
    articleCount: 12,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '后端开发',
    description: '后端开发相关文章',
    articleCount: 8,
    createdAt: '2024-01-02 14:30:00',
    updatedAt: '2024-01-02 14:30:00'
  },
  {
    id: 3,
    name: 'UI框架',
    description: 'UI框架相关文章',
    articleCount: 5,
    createdAt: '2024-01-03 09:15:00',
    updatedAt: '2024-01-03 09:15:00'
  },
  {
    id: 4,
    name: '性能优化',
    description: '性能优化相关文章',
    articleCount: 3,
    createdAt: '2024-01-04 16:45:00',
    updatedAt: '2024-01-04 16:45:00'
  },
  {
    id: 5,
    name: '数据库',
    description: '数据库相关文章',
    articleCount: 6,
    createdAt: '2024-01-05 11:20:00',
    updatedAt: '2024-01-05 11:20:00'
  }
])

// 分页配置
const pagination = reactive({
  total: categories.value.length,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [5, 10, 20, 50]
})

// 搜索关键词
const keyword = ref('')

// 选中的分类ID
const selectedCategoryIds = ref<number[]>([])

// 表格加载状态
const loading = ref(false)

// 添加新分类
const handleAddCategory = () => {
  router.push('/categories/edit')
}

// 编辑分类
const handleEditCategory = (id: number) => {
  router.push(`/categories/edit/${id}`)
}

// 删除分类
const handleDeleteCategory = (id: number) => {
  const category = categories.value.find(c => c.id === id)
  if (category && category.articleCount > 0) {
    ElMessage.warning('该分类下有文章，无法删除')
    return
  }

  ElMessageBox.confirm('确定要删除这个分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API删除
    const index = categories.value.findIndex(category => category.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      pagination.total = categories.value.length
      ElMessage.success('分类删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量删除分类
const handleBatchDelete = () => {
  if (selectedCategoryIds.value.length === 0) {
    ElMessage.warning('请选择要删除的分类')
    return
  }

  // 检查是否有分类下有文章
  const hasArticles = categories.value.some(category => 
    selectedCategoryIds.value.includes(category.id) && category.articleCount > 0
  )

  if (hasArticles) {
    ElMessage.warning('部分分类下有文章，无法删除')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的${selectedCategoryIds.value.length}个分类吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API批量删除
    categories.value = categories.value.filter(category => 
      !selectedCategoryIds.value.includes(category.id)
    )
    pagination.total = categories.value.length
    selectedCategoryIds.value = []
    ElMessage.success('分类删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 刷新分类列表
const handleRefresh = () => {
  loading.value = true
  // 实际项目中这里应该调用API重新获取数据
  setTimeout(() => {
    loading.value = false
    ElMessage.success('分类列表已刷新')
  }, 1000)
}

// 搜索分类
const handleSearch = () => {
  // 实际项目中这里应该调用API搜索数据
  pagination.currentPage = 1
  ElMessage.success('搜索功能已实现')
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
  selectedCategoryIds.value = selection.map(item => item.id)
}

// 组件挂载时加载数据
onMounted(() => {
  handleRefresh()
})
</script>

<template>
  <div class="categories-list">
    <div class="page-header">
      <div class="header-left">
        <h1>分类管理</h1>
        <p>管理博客文章的分类，支持新增、编辑和删除</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          :icon="Plus"
          @click="handleAddCategory"
        >
          新增分类
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="keyword"
          placeholder="搜索分类名称"
          :prefix-icon="Search"
          clearable
          class="search-input"
        >
          <template #append>
            <el-button type="primary" @click="handleSearch">
              搜索
            </el-button>
          </template>
        </el-input>
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
          type="danger" 
          :icon="Delete" 
          @click="handleBatchDelete"
          :disabled="selectedCategoryIds.length === 0"
        >
          批量删除
        </el-button>
      </div>
      <div class="action-right">
        <span>已选择 {{ selectedCategoryIds.length }} 项</span>
      </div>
    </div>

    <!-- 分类列表表格 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        v-loading="loading"
        :data="categories"
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
          prop="id"
          label="ID"
          width="80"
        />
        <el-table-column
          prop="name"
          label="分类名称"
          min-width="150"
        >
          <template #default="scope">
            <span class="category-name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="分类描述"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="articleCount"
          label="文章数量"
          width="120"
        >
          <template #default="scope">
            <el-tag size="small" type="info">{{ scope.row.articleCount }}</el-tag>
          </template>
        </el-table-column>
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
          width="180"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleEditCategory(scope.row.id)"
              class="edit-button"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDeleteCategory(scope.row.id)"
              :disabled="scope.row.articleCount > 0"
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
.categories-list {
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

.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.search-bar {
  padding: 10px 0;
}

.search-input {
  width: 100%;
  max-width: 400px;
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

.category-name {
  font-weight: 500;
  color: #333;
}

.edit-button {
  margin-right: 5px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>