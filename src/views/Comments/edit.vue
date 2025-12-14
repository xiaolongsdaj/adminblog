<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, ArrowLeft } from '@element-plus/icons-vue'

// const route = useRoute()
const router = useRouter()

// 评论表单数据
const commentForm = reactive({
  content: '',
  status: 'approved' as 'approved' | 'pending' | 'rejected'
})

// 加载状态
const loading = ref(false)
const saving = ref(false)

// 表单验证
const formRef = ref()
const rules = {
  content: [
    { required: true, message: '请输入评论内容', trigger: 'blur' },
    { min: 5, max: 1000, message: '长度在 5 到 1000 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择评论状态', trigger: 'change' }
  ]
}

// 加载评论数据
const loadCommentData = () => {
  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    // 模拟评论数据
    const mockComment = {
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
    }
    
    // 填充表单数据
    commentForm.content = mockComment.content
    commentForm.status = mockComment.status as 'approved' | 'pending' | 'rejected'
    
    loading.value = false
  }, 1000)
}

// 保存评论
const saveComment = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      saving.value = true
      
      // 模拟API请求
      setTimeout(() => {
        saving.value = false
        ElMessage.success('评论更新成功')
        
        // 返回评论列表页
        router.push('/comments')
      }, 1500)
    }
  })
}

// 返回评论列表
const goBack = () => {
  router.back()
}

// 组件挂载时加载数据
onMounted(() => {
  loadCommentData()
})
</script>

<template>
  <div class="comment-edit">
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
        <h1>编辑评论</h1>
        <p>修改评论内容和状态</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          :icon="Check"
          @click="saveComment"
          :loading="saving"
          class="save-button"
        >
          保存修改
        </el-button>
      </div>
    </div>

    <el-card class="form-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="commentForm"
        :rules="rules"
        label-width="100px"
        class="comment-form"
      >
        <el-form-item label="评论内容" prop="content">
          <el-input
            v-model="commentForm.content"
            type="textarea"
            rows="6"
            placeholder="请输入评论内容"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="评论状态" prop="status">
          <el-select
            v-model="commentForm.status"
            placeholder="请选择评论状态"
          >
            <el-option label="已批准" value="approved" />
            <el-option label="待审核" value="pending" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.comment-edit {
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

.comment-form {
  padding: 20px 0;
}
</style>