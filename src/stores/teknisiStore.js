import { defineStore } from 'pinia'
import { TEKNISI_LIST } from '../data/masterData'

export const useTeknisiStore = defineStore('teknisi', {
  state: () => {
    const saved = localStorage.getItem('bmkg-teknisi')
    return {
      teknisiList: saved ? JSON.parse(saved) : [...TEKNISI_LIST]
    }
  },
  actions: {
    addTeknisi(teknisi) {
      if (!this.teknisiList.find(t => t.name === teknisi.name)) {
        this.teknisiList.push(teknisi)
        this.save()
      }
    },
    save() {
      localStorage.setItem('bmkg-teknisi', JSON.stringify(this.teknisiList))
    }
  }
})
