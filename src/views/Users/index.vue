<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh, Check, Close } from '@element-plus/icons-vue'

const router = useRouter()

// 用户列表数据
const users = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    role: 'author',
    status: 'active',
    createdAt: '2024-01-02 14:30:00',
    updatedAt: '2024-01-02 14:30:00'
  },
  {
    id: 3,
    username: 'lisi',
    email: 'lisi@example.com',
    role: 'author',
    status: 'active',
    createdAt: '2024-01-03 09:15:00',
    updatedAt: '2024-01-03 09:15:00'
  },
  {
    id: 4,
    username: 'wangwu',
    email: 'wangwu@example.com',
    role: 'subscriber',
    status: 'active',
    createdAt: '2024-01-04 16:45:00',
    updatedAt: '2024-01-04 16:45:00'
  },
  {
    id: 5,
    username: 'zhaoliu',
    email: 'zhaoliu@example.com',
    role: 'subscriber',
    status: 'inactive',
    createdAt: '2024-01-05 11:20:00',
    updatedAt: '2024-01-05 11:20:00'
  },
  {
    id: 6,
    username: 'sunqi',
    email: 'sunqi@example.com',
    role: 'author',
    status: 'active',
    createdAt: '2024-01-06 13:30:00',
    updatedAt: '2024-01-06 13:30:00'
  }
])

// 分页配置
const pagination = reactive({
  total: users.value.length,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [5, 10, 20, 50]
})

// 搜索关键词
const keyword = ref('')

// 选中的用户ID
const selectedUserIds = ref<number[]>([])

// 表格加载状态
const loading = ref(false)

// 角色筛选
const roleFilter = ref('all')

// 状态筛选
const statusFilter = ref('all')

// 添加新用户
const handleAddUser = () => {
  router.push('/users/edit')
}

// 编辑用户
const handleEditUser = (id: number) => {
  router.push(`/users/edit/${id}`)
}

// 删除用户
const handleDeleteUser = (id: number) => {
  // 禁止删除管理员账号
  const user = users.value.find(u => u.id === id)
  if (user && user.username === 'admin') {
    ElMessage.warning('管理员账号无法删除')
    return
  }

  ElMessageBox.confirm('确定要删除这个用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API删除
    const index = users.value.findIndex(user => user.id === id)
    if (index !== -1) {
      users.value.splice(index, 1)
      pagination.total = users.value.length
      ElMessage.success('用户删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量删除用户
const handleBatchDelete = () => {
  if (selectedUserIds.value.length === 0) {
    ElMessage.warning('请选择要删除的用户')
    return
  }

  // 检查是否包含管理员账号
  const hasAdmin = users.value.some(user => 
    selectedUserIds.value.includes(user.id) && user.username === 'admin'
  )

  if (hasAdmin) {
    ElMessage.warning('选中的用户包含管理员账号，无法删除')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的${selectedUserIds.value.length}个用户吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API批量删除
    users.value = users.value.filter(user => 
      !selectedUserIds.value.includes(user.id)
    )
    pagination.total = users.value.length
    selectedUserIds.value = []
    ElMessage.success('用户删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 激活用户
const handleActivateUser = (id: number) => {
  // 实际项目中这里应该调用API更新状态
  const user = users.value.find(u => u.id === id)
  if (user) {
    user.status = 'active'
    ElMessage.success('用户已激活')
  }
}

// 禁用用户
const handleDeactivateUser = (id: number) => {
  // 禁止禁用管理员账号
  const user = users.value.find(u => u.id === id)
  if (user && user.username === 'admin') {
    ElMessage.warning('管理员账号无法禁用')
    return
  }

  // 实际项目中这里应该调用API更新状态
  if (user) {
    user.status = 'inactive'
    ElMessage.success('用户已禁用')
  }
}

// 刷新用户列表
const handleRefresh = () => {
  loading.value = true
  // 实际项目中这里应该调用API重新获取数据
  setTimeout(() => {
    loading.value = false
    ElMessage.success('用户列表已刷新')
  }, 1000)
}

// 搜索用户
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
  selectedUserIds.value = selection.map(item => item.id)
}

// 组件挂载时加载数据
onMounted(() => {
  handleRefresh()
})

// 获取用户角色显示文本
const getRoleText = (role: string) => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    author: '作者',
    subscriber: '订阅者'
  }
  return roleMap[role] || role
}

// 获取用户角色标签类型
const getRoleType = (role: string) => {
  const typeMap: Record<string, string> = {
    admin: 'danger',
    author: 'primary',
    subscriber: 'success'
  }
  return typeMap[role] || ''
}

// 获取用户状态显示文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: '已激活',
    inactive: '已禁用'
  }
  return statusMap[status] || status
}

// 获取用户状态标签类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    active: 'success',
    inactive: 'danger'
  }
  return typeMap[status] || ''
}
</script>

<template>
  <div class="users-list">
    <div class="page-header">
      <div class="header-left">
        <h1>用户管理</h1>
        <p>管理博客系统的用户账号，支持新增、编辑和删除</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          :icon="Plus"
          @click="handleAddUser"
        >
          新增用户
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="keyword"
          placeholder="搜索用户名或邮箱"
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
          v-model="roleFilter"
          placeholder="筛选角色"
          class="role-filter"
          size="large"
        >
          <el-option label="全部" value="all" />
          <el-option label="管理员" value="admin" />
          <el-option label="作者" value="author" />
          <el-option label="订阅者" value="subscriber" />
        </el-select>
        <el-select
          v-model="statusFilter"
          placeholder="筛选状态"
          class="status-filter"
          size="large"
        >
          <el-option label="全部" value="all" />
          <el-option label="已激活" value="active" />
          <el-option label="已禁用" value="inactive" />
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
          :disabled="selectedUserIds.length === 0"
        >
          批量删除
        </el-button>
      </div>
      <div class="action-right">
        <span>已选择 {{ selectedUserIds.length }} 项</span>
      </div>
    </div>

    <!-- 用户列表表格 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        v-loading="loading"
        :data="users"
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
          prop="username"
          label="用户名"
          min-width="150"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          min-width="200"
        />
        <el-table-column
          prop="role"
          label="角色"
          min-width="120"
        >
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)">
              {{ getRoleText(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
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
          prop="updatedAt"
          label="更新时间"
          min-width="180"
        />
        <el-table-column
          label="操作"
          min-width="220"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'inactive'"
              type="success"
              size="small"
              :icon="Check"
              @click="handleActivateUser(scope.row.id)"
              class="action-button"
            >
              激活
            </el-button>
            <el-button
              v-if="scope.row.status === 'active'"
              type="danger"
              size="small"
              :icon="Close"
              @click="handleDeactivateUser(scope.row.id)"
              class="action-button"
            >
              禁用
            </el-button>
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleEditUser(scope.row.id)"
              class="action-button"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDeleteUser(scope.row.id)"
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
.users-list {
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
  display: flex;
  gap: 20px;
  align-items: center;
}

.search-input {
  width: 100%;
  max-width: 400px;
}

.role-filter,
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