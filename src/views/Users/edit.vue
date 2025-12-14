<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 获取用户ID
const userId = route.params.id as string
const isEditMode = !!userId

// 用户表单数据
const userForm = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  role: 'subscriber' as 'admin' | 'author' | 'subscriber',
  status: 'active' as 'active' | 'inactive'
})

// 加载状态
const loading = ref(false)
const saving = ref(false)

// 表单验证
const formRef = ref()
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]{2,20}$/, message: '用户名只能包含字母、数字、下划线和减号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: !isEditMode, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  passwordConfirm: [
    { required: !isEditMode, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (_: any, value: string, callback: any) => {
        if (value !== userForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择用户状态', trigger: 'change' }
  ]
}

// 加载用户数据（编辑模式）
const loadUserData = () => {
  if (!isEditMode) return

  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    // 模拟用户数据
    const mockUser = {
      id: 1,
      username: 'zhangsan',
      email: 'zhangsan@example.com',
      role: 'author',
      status: 'active',
      createdAt: '2024-01-02 14:30:00',
      updatedAt: '2024-01-02 14:30:00'
    }
    
    // 填充表单数据（不包含密码）
    userForm.username = mockUser.username
    userForm.email = mockUser.email
    userForm.role = mockUser.role as 'admin' | 'author' | 'subscriber'
    userForm.status = mockUser.status as 'active' | 'inactive'
    
    loading.value = false
  }, 1000)
}

// 保存用户
const saveUser = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      saving.value = true
      
      // 模拟API请求
      setTimeout(() => {
        saving.value = false
        
        if (isEditMode) {
          ElMessage.success('用户更新成功')
        } else {
          ElMessage.success('用户创建成功')
        }
        
        // 返回用户列表页
        router.push('/users')
      }, 1500)
    }
  })
}

// 返回用户列表
const goBack = () => {
  router.back()
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserData()
})
</script>

<template>
  <div class="user-edit">
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
        <h1>{{ isEditMode ? '编辑用户' : '新增用户' }}</h1>
        <p>{{ isEditMode ? '修改用户信息' : '创建一个新的用户' }}</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          :icon="Check"
          @click="saveUser"
          :loading="saving"
          class="save-button"
        >
          {{ isEditMode ? '保存修改' : '创建用户' }}
        </el-button>
      </div>
    </div>

    <el-card class="form-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="userForm"
        :rules="rules"
        label-width="120px"
        class="user-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名"
            maxlength="20"
            show-word-limit
            :disabled="isEditMode && userForm.username === 'admin'"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userForm.email"
            type="email"
            placeholder="请输入邮箱"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="{{ isEditMode ? '不修改请留空' : '请输入密码' }}"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input
            v-model="userForm.passwordConfirm"
            type="password"
            placeholder="{{ isEditMode ? '不修改请留空' : '请确认密码' }}"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="用户角色" prop="role">
          <el-select
            v-model="userForm.role"
            placeholder="请选择用户角色"
            :disabled="isEditMode && userForm.username === 'admin'"
          >
            <el-option label="管理员" value="admin" />
            <el-option label="作者" value="author" />
            <el-option label="订阅者" value="subscriber" />
          </el-select>
        </el-form-item>

        <el-form-item label="用户状态" prop="status">
          <el-select
            v-model="userForm.status"
            placeholder="请选择用户状态"
            :disabled="isEditMode && userForm.username === 'admin'"
          >
            <el-option label="已激活" value="active" />
            <el-option label="已禁用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.user-edit {
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

.user-form {
  padding: 20px 0;
}
</style>