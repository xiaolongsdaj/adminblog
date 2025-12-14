<script setup lang="ts">
import { ref } from 'vue'
import { 
  Document, User, Message, View, 
  Clock, Warning, TrendCharts, DataBoard 
} from '@element-plus/icons-vue'

// 数据概览统计
const statistics = ref([
  {
    title: '文章总数',
    value: 128,
    icon: Document,
    color: '#667eea',
    trend: '+12%',
    trendType: 'positive'
  },
  {
    title: '用户数',
    value: 563,
    icon: User,
    color: '#764ba2',
    trend: '+8%',
    trendType: 'positive'
  },
  {
    title: '评论数',
    value: 2341,
    icon: Message,
    color: '#f093fb',
    trend: '+15%',
    trendType: 'positive'
  },
  {
    title: '访问量',
    value: 15623,
    icon: View,
    color: '#4facfe',
    trend: '+23%',
    trendType: 'positive'
  }
])

// 文章发布趋势图数据
const articleTrend = ref([
  { name: '1月', value: 28 },
  { name: '2月', value: 35 },
  { name: '3月', value: 22 },
  { name: '4月', value: 48 },
  { name: '5月', value: 32 },
  { name: '6月', value: 56 },
  { name: '7月', value: 42 },
  { name: '8月', value: 65 },
  { name: '9月', value: 58 },
  { name: '10月', value: 72 },
  { name: '11月', value: 68 },
  { name: '12月', value: 85 }
])

// 最新评论列表
const latestComments = ref([
  {
    id: 1,
    content: '这篇文章写得非常好，对我很有帮助！',
    author: '张三',
    article: 'Vue 3 Composition API入门指南',
    date: '2024-01-15 14:30',
    status: 'approved'
  },
  {
    id: 2,
    content: '请问这个功能在实际项目中是如何应用的？',
    author: '李四',
    article: 'Element Plus组件库的高级用法',
    date: '2024-01-15 10:20',
    status: 'pending'
  },
  {
    id: 3,
    content: '感谢分享，学到了很多新东西！',
    author: '王五',
    article: 'TypeScript在Vue项目中的实践',
    date: '2024-01-14 16:45',
    status: 'approved'
  },
  {
    id: 4,
    content: '期待更多相关的技术文章',
    author: '赵六',
    article: '前端性能优化实战',
    date: '2024-01-14 09:15',
    status: 'approved'
  },
  {
    id: 5,
    content: '这个问题我也遇到过，感谢解决方案！',
    author: '钱七',
    article: 'Vue Router路由管理最佳实践',
    date: '2024-01-13 15:20',
    status: 'approved'
  }
])

// 系统状态
const systemStatus = ref({
  server: '运行正常',
  database: '连接正常',
  memory: '使用率 45%',
  disk: '使用率 62%',
  uptime: '128天 4小时 32分钟'
})

// 格式化数字，添加千位分隔符
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 时间范围选择
const timeRange = ref('year')
</script>

<template>
  <div class="dashboard">
    <div class="page-header">
      <h1>仪表盘</h1>
      <p>欢迎回来，管理员！这里是您的系统概览</p>
    </div>

    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="(stat, index) in statistics" :key="index">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ formatNumber(stat.value) }}</div>
              <div class="stat-trend" :class="stat.trendType">
                <el-icon :size="14"><TrendCharts /></el-icon>
                {{ stat.trend }}
              </div>
            </div>
            <div class="stat-right">
              <el-icon :size="36" :style="{ color: stat.color }">
                <component :is="stat.icon" />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中间部分：趋势图和系统状态 -->
    <el-row :gutter="20" class="middle-row">
      <!-- 文章发布趋势图 -->
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>文章发布趋势</span>
              <el-select v-model="timeRange" size="small">
                <el-option label="今年" value="year" />
                <el-option label="近6个月" value="halfYear" />
                <el-option label="近3个月" value="quarter" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <!-- 使用Element Plus的图表组件 -->
            <el-chart :data="articleTrend">
              <el-bar :x-field="'name'" :y-field="'value'" :series-field="'name'" :bar-style="{radius: [4, 4, 0, 0]}">
                <template #bar>
                  <el-tooltip :content="(datum: any) => `${datum.name}: ${datum.value}篇`" :show-arrow="true" placement="top" />
                </template>
              </el-bar>
              <el-axis type="x" :field="'name'" />
              <el-axis type="y" :field="'value'" />
              <el-legend :position="'top'" />
            </el-chart>
          </div>
        </el-card>
      </el-col>

      <!-- 系统状态监控 -->
      <el-col :xs="24" :lg="8">
        <el-card class="status-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>系统运行状态</span>
              <el-tag type="success" size="small">正常</el-tag>
            </div>
          </template>
          <div class="status-list">
            <div class="status-item">
              <el-icon :size="20" class="status-icon success"><TrendCharts /></el-icon>
              <div class="status-info">
                <div class="status-label">服务器状态</div>
                <div class="status-value">{{ systemStatus.server }}</div>
              </div>
            </div>
            <div class="status-item">
              <el-icon :size="20" class="status-icon success"><DataBoard /></el-icon>
              <div class="status-info">
                <div class="status-label">数据库连接</div>
                <div class="status-value">{{ systemStatus.database }}</div>
              </div>
            </div>
            <div class="status-item">
              <el-icon :size="20" class="status-icon warning"><Warning /></el-icon>
              <div class="status-info">
                <div class="status-label">内存使用率</div>
                <div class="status-value">{{ systemStatus.memory }}</div>
              </div>
            </div>
            <div class="status-item">
              <el-icon :size="20" class="status-icon warning"><Warning /></el-icon>
              <div class="status-info">
                <div class="status-label">磁盘使用率</div>
                <div class="status-value">{{ systemStatus.disk }}</div>
              </div>
            </div>
            <div class="status-item">
              <el-icon :size="20" class="status-icon success"><Clock /></el-icon>
              <div class="status-info">
                <div class="status-label">运行时间</div>
                <div class="status-value">{{ systemStatus.uptime }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新评论列表 -->
    <el-row class="comments-row">
      <el-col :span="24">
        <el-card class="comments-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最新评论</span>
              <el-button type="text" size="small">查看全部</el-button>
            </div>
          </template>
          <div class="comments-list">
            <el-timeline>
              <el-timeline-item
                v-for="(comment, index) in latestComments"
                :key="index"
                :timestamp="comment.date"
                placement="top"
              >
                <el-card>
                  <div class="comment-content">{{ comment.content }}</div>
                  <div class="comment-meta">
                    <el-tag size="small" type="primary">{{ comment.article }}</el-tag>
                    <span class="comment-author">by {{ comment.author }}</span>
                    <el-tag 
                      size="small" 
                      :type="comment.status === 'approved' ? 'success' : 'warning'"
                      class="comment-status"
                    >
                      {{ comment.status === 'approved' ? '已通过' : '待审核' }}
                    </el-tag>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard {
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

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-left {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.stat-trend.positive {
  color: #67c23a;
}

.stat-trend.negative {
  color: #f56c6c;
}

.stat-right {
  margin-left: 20px;
}

.middle-row {
  margin-bottom: 20px;
}

.chart-card, .status-card, .comments-card {
  border-radius: 8px;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-weight: 500;
  font-size: 16px;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.simple-chart {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 250px;
  width: 100%;
  padding: 20px;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 0 5px;
}

.bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
}

.bar:hover {
  opacity: 0.8;
}

.bar-label {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
}

.status-icon {
  margin-right: 12px;
}

.status-icon.success {
  color: #67c23a;
}

.status-icon.warning {
  color: #e6a23c;
}

.status-info {
  flex: 1;
}

.status-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.status-value {
  font-size: 12px;
  color: #666;
}

.comments-list {
  max-height: 400px;
  overflow-y: auto;
}

.comment-content {
  margin-bottom: 12px;
  color: #333;
  line-height: 1.5;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.comment-author {
  font-size: 12px;
  color: #666;
}

.comment-status {
  margin-left: auto;
}
</style>