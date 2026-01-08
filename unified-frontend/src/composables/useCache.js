// 简单的内存缓存实现
const cache = new Map()

const DEFAULT_TTL = 5 * 60 * 1000 // 5分钟

interface CacheItem {
  value: any
  expires: number
}

export function useCache() {
  const get = (key: string) => {
    const item = cache.get(key) as CacheItem
    if (!item) return null

    if (Date.now() > item.expires) {
      cache.delete(key)
      return null
    }

    return item.value
  }

  const set = (key: string, value: any, ttl = DEFAULT_TTL) => {
    cache.set(key, {
      value,
      expires: Date.now() + ttl
    })
  }

  const has = (key: string) => {
    const item = cache.get(key) as CacheItem
    if (!item) return false

    if (Date.now() > item.expires) {
      cache.delete(key)
      return false
    }

    return true
  }

  const clear = () => {
    cache.clear()
  }

  const remove = (key: string) => {
    cache.delete(key)
  }

  // 带缓存的异步函数
  const withCache = async (key: string, fn: Function, ttl = DEFAULT_TTL) => {
    const cached = get(key)
    if (cached !== null) return cached

    const result = await fn()
    set(key, result, ttl)
    return result
  }

  return {
    get,
    set,
    has,
    clear,
    remove,
    withCache
  }
}
