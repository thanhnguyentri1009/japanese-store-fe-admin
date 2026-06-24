export const LOCAL_STORAGE_KEYS = {
  user: 'user',
}

export const localStorageService = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // ignore
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  },
}
