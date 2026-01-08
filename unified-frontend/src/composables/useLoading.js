import { ref } from 'vue'

export function useLoading() {
  const loading = ref(false)
  const loadingMessage = ref('')

  const setLoading = (isLoading, message = '') => {
    loading.value = isLoading
    loadingMessage.value = message
  }

  const withLoading = async (fn, message = '') => {
    try {
      setLoading(true, message)
      const result = await fn()
      return result
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    loadingMessage,
    setLoading,
    withLoading
  }
}
