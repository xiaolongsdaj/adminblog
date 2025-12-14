<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import {
  HomeFilled,
  Document,
  FolderOpened,
  CollectionTag,
  Message,
  User,
  Setting,
  ArrowRight
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const collapsed = ref(false)

const menuItems = [
  {
    index: '/',
    label: '仪表盘',
    icon: HomeFilled
  },
  {
    index: '/articles',
    label: '文章管理',
    icon: Document
  },
  {
    index: '/categories',
    label: '分类管理',
    icon: FolderOpened
  },
  {
    index: '/tags',
    label: '标签管理',
    icon: CollectionTag
  },
  {
    index: '/comments',
    label: '评论管理',
    icon: Message
  },
  {
    index: '/users',
    label: '用户管理',
    icon: User
  },
  {
    index: '/settings',
    label: '系统设置',
    icon: Setting
  }
]

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const activeIndex = ref(route.path)

onMounted(() => {
  activeIndex.value = route.path
})


</script>

<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside :width="collapsed ? '64px' : '200px'" class="aside">
      <div class="logo">
        <el-icon :size="24">
          <Document />
        </el-icon>
        <span v-if="!collapsed" class="logo-text">博客后台</span>
      </div>
      
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        :collapse="collapsed"
        @select="(index: string) => router.push(index)"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.index"
          :index="item.index"
        >
          <template #icon>
            <component :is="item.icon" />
          </template>
          <template #title>{{ item.label }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区域 -->
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="collapsed = !collapsed"
            class="toggle-button"
          >
            <el-icon :size="24">
              <component :is="collapsed ? 'Menu' : 'Close'" />
            </el-icon>
          </el-button>
        </div>
        
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar || ''">
                {{ userStore.userInfo?.username?.charAt(0) || 'A' }}
              </el-avatar>
              <span v-if="userStore.userInfo">{{ userStore.userInfo.username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><ArrowRight /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.aside {
  background-color: #001529;
  color: #fff;
  border-right: none;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #1f2f3d;
}

.logo-text {
  margin-left: 10px;
}

.el-menu-vertical-demo {
  border-right: none;
  background-color: #001529;
  color: #fff;
}

.el-menu-vertical-demo :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.85);
}

.el-menu-vertical-demo :deep(.el-menu-item:hover),
.el-menu-vertical-demo :deep(.el-menu-item.is-active) {
  background-color: #1890ff;
  color: #fff;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 60px;
}

.toggle-button {
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info span {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>