<template>
  <span 
    :class="badgeClasses"
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200"
  >
    <i v-if="showIcon" :class="[iconClass, 'mr-1.5']"></i>
    <span class="truncate max-w-[200px]">{{ label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['success', 'warning', 'error', 'info', 'default', 'processing'].includes(value)
  },
  label: {
    type: String,
    required: true
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

const statusConfig = {
  success: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: 'fas fa-check-circle'
  },
  warning: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: 'fas fa-exclamation-circle'
  },
  error: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: 'fas fa-times-circle'
  },
  info: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: 'fas fa-info-circle'
  },
  default: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    icon: 'fas fa-circle'
  },
  processing: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    icon: 'fas fa-spinner fa-spin'
  }
}

const config = computed(() => statusConfig[props.status] || statusConfig.default)

const badgeClasses = computed(() => {
  return [config.value.bg, config.value.text]
})

const iconClass = computed(() => config.value.icon)
</script>
