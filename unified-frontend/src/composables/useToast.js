import { ref } from 'vue'

const toast = ref(null)
const toasts = ref([])

export function useToast() {
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    
    if (duration > 0) {
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, duration)
    }
    
    return id
  }

  const hideToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (message, duration) => showToast(message, 'success', duration)
  const error = (message, duration) => showToast(message, 'error', duration)
  const warning = (message, duration) => showToast(message, 'warning', duration)
  const info = (message, duration) => showToast(message, 'info', duration)

  return {
    toast,
    toasts,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info
  }
}
