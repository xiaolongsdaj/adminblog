import { defineStore } from 'pinia'

export interface UserInfo {
  id: number
  username: string
  email: string
  role: string
  avatar?: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as UserInfo | null,
    isLoggedIn: !!localStorage.getItem('token')
  }),
  
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
      this.isLoggedIn = true
    },
    
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    
    logout() {
      this.token = ''
      this.userInfo = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
    }
  }
})