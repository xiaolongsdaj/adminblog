<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Check, Close, Edit, Delete } from '@element-plus/icons-vue'

const router = useRouter()

// 评论列表数据
const comments = ref([
  {
    id: 1,
    articleId: 1,
    articleTitle: 'Vue 3 Composition API 详解',
    userId: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    content: '这篇文章写得非常好，对我学习Vue 3很有帮助！',
    status: 'approved',
    createdAt: '2024-01-10 14:30:00',
    updatedAt: '2024-01-10 14:30:00'
  },
  {
    id: 2,
    articleId: 2,
    articleTitle: 'TypeScript 入门指南',
    userId: 2,
    username: '李四',
    email: 'lisi@example.com',
    content: '请问TypeScript和JavaScript有什么主要区别？',
    status: 'approved',
    createdAt: '2024-01-11 09:15:00',
    updatedAt: '2024-01-11 09:15:00'
  },
  {
    id: 3,
    articleId: 1,
    articleTitle: 'Vue 3 Composition API 详解',
    userId: 3,
    username: '王五',
    email: 'wangwu@example.com',
    content: '我在使用Composition API时遇到了一些问题，请问如何解决？',
    status: 'pending',
    createdAt: '2024-01-12 16:45:00',
    updatedAt: '2024-01-12 16:45:00'
  },
  {
    id: 4,
    articleId: 3,
    articleTitle: '性能优化的几个技巧',
    userId: 4,
    username: '赵六',
    email: 'zhaoliu@example.com',
    content: '这些优化技巧非常实用，感谢分享！',
    status: 'approved',
    createdAt: '2024-01-13 11:20:00',
    updatedAt: '2024-01-13 11:20:00'
  },
  {
    id: 5,
    articleId: 2,
    articleTitle: 'TypeScript 入门指南',
    userId: 5,
    username: '孙七',
    email: 'sunqi@example.com',
    content: 'TypeScript的类型系统确实很强大！',
    status: 'approved',
    createdAt: '2024-01-14 13:30:00',
    updatedAt: '2024-01-14 13:30:00'
  },
  {
    id: 6,
    articleId: 1,
    articleTitle: 'Vue 3 Composition API 详解',
    userId: 6,
    username: '周八',
    email: 'zhouba@example.com',
    content: '这是一篇垃圾文章，毫无价值！',
    status: 'rejected',
    createdAt: '2024-01-15 10:00:00',
    updatedAt: '2024-01-15 10:00:00'
  }
])

// 分页配置
const pagination = reactive({
  total: comments.value.length,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [5, 10, 20, 50]
})

// 搜索关键词
const keyword = ref('')

// 选中的评论ID
const selectedCommentIds = ref<number[]>([])

// 表格加载状态
const loading = ref(false)

// 状态筛选
const statusFilter = ref('all')

// 编辑评论
const handleEditComment = (id: number) => {
  router.push(`/comments/edit/${id}`)
}

// 删除评论
const handleDeleteComment = (id: number) => {
  ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API删除
    const index = comments.value.findIndex(comment => comment.id === id)
    if (index !== -1) {
      comments.value.splice(index, 1)
      pagination.total = comments.value.length
      ElMessage.success('评论删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量删除评论
const handleBatchDelete = () => {
  if (selectedCommentIds.value.length === 0) {
    ElMessage.warning('请选择要删除的评论')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的${selectedCommentIds.value.length}条评论吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API批量删除
    comments.value = comments.value.filter(comment => 
      !selectedCommentIds.value.includes(comment.id)
    )
    pagination.total = comments.value.length
    selectedCommentIds.value = []
    ElMessage.success('评论删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批准评论
const handleApproveComment = (id: number) => {
  // 实际项目中这里应该调用API更新状态
  const comment = comments.value.find(c => c.id === id)
  if (comment) {
    comment.status = 'approved'
    ElMessage.success('评论已批准')
  }
}

// 拒绝评论
const handleRejectComment = (id: number) => {
  // 实际项目中这里应该调用API更新状态
  const comment = comments.value.find(c => c.id === id)
  if (comment) {
    comment.status = 'rejected'
    ElMessage.success('评论已拒绝')
  }
}

// 刷新评论列表
const handleRefresh = () => {
  loading.value = true
  // 实际项目中这里应该调用API重新获取数据
  setTimeout(() => {
    loading.value = false
    ElMessage.success('评论列表已刷新')
  }, 1000)
}

// 搜索评论
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
  selectedCommentIds.value = selection.map(item => item.id)
}

// 组件挂载时加载数据
onMounted(() => {
  handleRefresh()
})

// 获取评论状态显示文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    approved: '已批准',
    pending: '待审核',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

// 获取评论状态标签类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger'
  }
  return typeMap[status] || ''
}
</script>

<template>
  <div class="comments-list">
    <div class="page-header">
      <div class="header-left">
        <h1>评论管理</h1>
        <p>管理博客文章的评论，支持审核、编辑和删除</p>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="keyword"
          placeholder="搜索评论内容或用户名"
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
        <el-select
          v-model="statusFilter"
          placeholder="筛选状态"
          class="status-filter"
          size="large"
        >
          <el-option label="全部" value="all" />
          <el-option label="已批准" value="approved" />
          <el-option label="待审核" value="pending" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
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
          :disabled="selectedCommentIds.length === 0"
        >
          批量删除
        </el-button>
      </div>
      <div class="action-right">
        <span>已选择 {{ selectedCommentIds.length }} 项</span>
      </div>
    </div>

    <!-- 评论列表表格 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        v-loading="loading"
        :data="comments"
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
          prop="articleTitle"
          label="文章标题"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="username"
          label="评论用户"
          min-width="120"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          min-width="150"
        />
        <el-table-column
          prop="content"
          label="评论内容"
          min-width="300"
          show-overflow-tooltip
        />
        <el-table-column
          prop="status"
          label="状态"
          min-width="120"
        >
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="创建时间"
          min-width="180"
        />
        <el-table-column
          label="操作"
          min-width="200"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'pending'"
              type="success"
              size="small"
              :icon="Check"
              @click="handleApproveComment(scope.row.id)"
              class="action-button"
            >
              批准
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="danger"
              size="small"
              :icon="Close"
              @click="handleRejectComment(scope.row.id)"
              class="action-button"
            >
              拒绝
            </el-button>
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleEditComment(scope.row.id)"
              class="action-button"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDeleteComment(scope.row.id)"
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
.comments-list {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 30px;
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
  display: flex;
  gap: 20px;
}

.search-input {
  width: 100%;
  max-width: 500px;
}

.status-filter {
  width: 150px;
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

.action-button {
  margin-right: 5px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>