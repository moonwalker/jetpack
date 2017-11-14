export class MemStore {
    constructor() {
      this.store = new Map()
    }
  
    init(state = {}, defaults = {}) {
      this.store.clear()
      state = Object.assign(state, defaults)
  
      for (let [k, v] of Object.entries(state)) {
        this.set(k, v)
      }
    }
  
    get(key) {
      return this.store.get(key)
    }
  
    set(key, value) {
      this.store.set(key, value)
    }
  
    state() {
      let obj = {}
      for (let [k, v] of this.store) {
        obj[k] = v
      }
      return obj
    }
  }
  