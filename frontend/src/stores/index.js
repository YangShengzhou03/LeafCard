import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: true
    },
    theme: 'light'
  }),
  
  getters: {
    sidebarOpened: (state) => state.sidebar.opened
  },
  
  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
    },
    setTheme(theme) {
      this.theme = theme
    }
  }
})

export const useCardStore = defineStore('card', {
  state: () => ({
    cards: [],
    currentCard: null,
    loading: false
  }),
  
  actions: {
    async fetchCards() {
      this.loading = true
      try {
        // 这里将调用API获取卡密列表
        // const response = await api.getCards()
        // this.cards = response.data
      } catch (error) {
        console.error('获取卡密列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    async validateCard(cardKey) {
      try {
        // 这里将调用卡密验证API
        // const response = await api.validateCard(cardKey)
        // return response.data
      } catch (error) {
        console.error('卡密验证失败:', error)
        throw error
      }
    }
  }
})