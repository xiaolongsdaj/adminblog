import { defineStore } from 'pinia'

export interface SystemConfig {
  siteName: string
  siteLogo: string
  siteFavicon: string
  siteDescription: string
  siteKeywords: string
  siteAuthor: string
  siteEmail: string
  siteUrl: string
  seoKeywords: string
  seoDescription: string
  enableComments: boolean
  enableRegistration: boolean
  enableSearch: boolean
  theme: 'light' | 'dark' | 'auto'
  emailConfig?: {
    host: string
    port: number
    secure: boolean
    username: string
    password: string
  }
}

export const useSystemStore = defineStore('system', {
  state: () => ({
    config: {
      siteName: 'Vue Blog',
      siteLogo: '',
      siteFavicon: '',
      siteDescription: '一个基于Vue.js的博客系统',
      siteKeywords: 'Vue, Blog, 前端',
      siteAuthor: '管理员',
      siteEmail: 'admin@example.com',
      siteUrl: 'http://localhost:3000',
      seoKeywords: '',
      seoDescription: '',
      enableComments: true,
      enableRegistration: true,
      enableSearch: true,
      theme: 'light'
    } as SystemConfig,
    loading: false,
    darkMode: false
  }),
  
  getters: {
    settings(): SystemConfig {
      return this.config
    }
  },
  
  actions: {
    setConfig(config: SystemConfig) {
      this.config = config
      this.applyTheme(config.theme)
    },
    
    updateSettings(settings: Partial<SystemConfig>) {
      this.config = { ...this.config, ...settings }
      if (settings.theme !== undefined) {
        this.applyTheme(settings.theme)
      }
    },
    
    setDarkMode(enabled: boolean) {
      this.darkMode = enabled
      if (enabled) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    
    applyTheme(theme: 'light' | 'dark' | 'auto') {
      if (theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.setDarkMode(isDark)
        // 添加系统主题变化监听
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (this.config.theme === 'auto') {
            this.setDarkMode(e.matches)
          }
        })
      } else {
        this.setDarkMode(theme === 'dark')
      }
    }
  }
})