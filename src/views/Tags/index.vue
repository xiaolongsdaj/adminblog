<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

// 标签列表数据
const tags = ref([
  {
    id: 1,
    name: 'Vue',
    description: 'Vue.js 框架相关标签',
    articleCount: 15,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: 'JavaScript',
    description: 'JavaScript 语言相关标签',
    articleCount: 20,
    createdAt: '2024-01-02 14:30:00',
    updatedAt: '2024-01-02 14:30:00'
  },
  {
    id: 3,
    name: 'TypeScript',
    description: 'TypeScript 语言相关标签',
    articleCount: 12,
    createdAt: '2024-01-03 09:15:00',
    updatedAt: '2024-01-03 09:15:00'
  },
  {
    id: 4,
    name: 'Element Plus',
    description: 'Element Plus UI 框架相关标签',
    articleCount: 8,
    createdAt: '2024-01-04 16:45:00',
    updatedAt: '2024-01-04 16:45:00'
  },
  {
    id: 5,
    name: '前端',
    description: '前端开发相关标签',
    articleCount: 25,
    createdAt: '2024-01-05 11:20:00',
    updatedAt: '2024-01-05 11:20:00'
  },
  {
    id: 6,
    name: '性能优化',
    description: '性能优化相关标签',
    articleCount: 6,
    createdAt: '2024-01-06 13:30:00',
    updatedAt: '2024-01-06 13:30:00'
  }
])

// 分页配置
const pagination = reactive({
  total: tags.value.length,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [5, 10, 20, 50]
})

// 搜索关键词
const keyword = ref('')

// 选中的标签ID
const selectedTagIds = ref<number[]>([])

// 表格加载状态
const loading = ref(false)

// 添加新标签
const handleAddTag = () => {
  router.push('/tags/edit')
}

// 编辑标签
const handleEditTag = (id: number) => {
  router.push(`/tags/edit/${id}`)
}

// 删除标签
const handleDeleteTag = (id: number) => {
  const tag = tags.value.find(t => t.id === id)
  if (tag && tag.articleCount > 0) {
    ElMessage.warning('该标签下有文章，无法删除')
    return
  }

  ElMessageBox.confirm('确定要删除这个标签吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API删除
    const index = tags.value.findIndex(tag => tag.id === id)
    if (index !== -1) {
      tags.value.splice(index, 1)
      pagination.total = tags.value.length
      ElMessage.success('标签删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量删除标签
const handleBatchDelete = () => {
  if (selectedTagIds.value.length === 0) {
    ElMessage.warning('请选择要删除的标签')
    return
  }

  // 检查是否有标签下有文章
  const hasArticles = tags.value.some(tag => 
    selectedTagIds.value.includes(tag.id) && tag.articleCount > 0
  )

  if (hasArticles) {
    ElMessage.warning('部分标签下有文章，无法删除')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的${selectedTagIds.value.length}个标签吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API批量删除
    tags.value = tags.value.filter(tag => 
      !selectedTagIds.value.includes(tag.id)
    )
    pagination.total = tags.value.length
    selectedTagIds.value = []
    ElMessage.success('标签删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 刷新标签列表
const handleRefresh = () => {
  loading.value = true
  // 实际项目中这里应该调用API重新获取数据
  setTimeout(() => {
    loading.value = false
    ElMessage.success('标签列表已刷新')
  }, 1000)
}

// 搜索标签
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
  selectedTagIds.value = selection.map(item => item.id)
}

// 组件挂载时加载数据
onMounted(() => {
  handleRefresh()
})
</script>

<template>
  <div class="tags-list">
    <div class="page-header">
      <div class="header-left">
        <h1>标签管理</h1>
        <p>管理博客文章的标签，支持新增、编辑和删除</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          :icon="Plus"
          @click="handleAddTag"
        >
          新增标签
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="keyword"
          placeholder="搜索标签名称"
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
          :disabled="selectedTagIds.length === 0"
        >
          批量删除
        </el-button>
      </div>
      <div class="action-right">
        <span>已选择 {{ selectedTagIds.length }} 项</span>
      </div>
    </div>

    <!-- 标签列表表格 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        v-loading="loading"
        :data="tags"
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
          label="标签名称"
          min-width="150"
        >
          <template #default="scope">
            <el-tag type="success">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="标签描述"
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
              @click="handleEditTag(scope.row.id)"
              class="edit-button"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDeleteTag(scope.row.id)"
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
.tags-list {
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

.edit-button {
  margin-right: 5px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>