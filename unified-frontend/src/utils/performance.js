// 性能监控工具
export const performance = {
  // 测量函数执行时间
  measure: async (fn, name = 'operation') => {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    const duration = end - start

    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    return result
  },

  // 创建防抖函数
  debounce: (fn, delay = 300) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  },

  // 创建节流函数
  throttle: (fn, delay = 300) => {
    let lastCall = 0
    return (...args) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        return fn(...args)
      }
    }
  },

  // 懒加载图片
  lazyLoadImages: () => {
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.removeAttribute('data-src')
          observer.unobserve(img)
        }
      })
    })

    images.forEach(img => imageObserver.observe(img))
  },

  // 优化滚动性能
  optimizeScroll: (callback) => {
    let ticking = false
    return () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          callback()
          ticking = false
        })
        ticking = true
      }
    }
  }
}
