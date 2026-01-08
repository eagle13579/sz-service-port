import { ref, onMounted } from 'vue'
import { useCache } from './useCache'
import { useLoading } from './useLoading'
import { useToast } from './useToast'

export function useData(fetchFn, cacheKey = '', cacheTTL = 5 * 60 * 1000) {
  const data = ref(null)
  const error = ref(null)
  const { loading, setLoading } = useLoading()
  const { withCache } = useCache()
  const { error: showError } = useToast()

  const fetch = async (forceRefresh = false) => {
    try {
      setLoading(true)
      error.value = null

      let result
      if (cacheKey && !forceRefresh) {
        result = await withCache(cacheKey, fetchFn, cacheTTL)
      } else {
        result = await fetchFn()
      }

      data.value = result
      return result
    } catch (err) {
      error.value = err
      showError('加载数据失败: ' + err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => fetch(true)

  const clear = () => {
    data.value = null
    error.value = null
  }

  onMounted(() => {
    fetch()
  })

  return {
    data,
    error,
    loading,
    fetch,
    refresh,
    clear
  }
}
