<template>
  <Teleport to="body">
    <div class="fixed top-20 right-4 z-50 space-y-2">
      <transition-group name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="[
            'px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]',
            toastClasses[t.type]
          ]"
        >
          <i :class="['text-xl', toastIcons[t.type]]"></i>
          <span class="flex-1">{{ t.message }}</span>
          <button @click="hideToast(t.id)" class="hover:opacity-70">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, hideToast } = useToast()

const toastClasses = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-500 text-white'
}

const toastIcons = {
  success: 'fas fa-check-circle',
  error: 'fas fa-times-circle',
  warning: 'fas fa-exclamation-circle',
  info: 'fas fa-info-circle'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
