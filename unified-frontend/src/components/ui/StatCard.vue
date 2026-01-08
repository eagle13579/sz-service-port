<template>
  <div 
    class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
    :class="cardClasses"
  >
    <div class="p-6">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-gray-500 text-sm font-medium mb-1">{{ label }}</p>
          <div class="flex items-baseline">
            <p class="text-3xl font-bold" :class="textColor">{{ animatedValue }}</p>
            <span v-if="change !== 0" :class="changeClass" class="ml-2 text-sm font-medium">
              {{ change > 0 ? '+' : '' }}{{ change }}%
            </span>
          </div>
        </div>
        <div 
          class="w-14 h-14 rounded-full flex items-center justify-center"
          :class="bgClass"
        >
          <i :class="[icon, iconColor]" class="text-2xl"></i>
        </div>
      </div>
    </div>
    <!-- Progress Bar -->
    <div v-if="progress !== undefined" class="h-1.5 bg-gray-100">
      <div 
        class="h-full transition-all duration-1000 ease-out"
        :class="progressClass"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'purple', 'yellow', 'red', 'orange'].includes(value)
  },
  change: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: undefined
  }
})

const animatedValue = ref(0)

const colorClasses = {
  blue: {
    text: 'text-blue-600',
    bg: 'bg-blue-100',
    icon: 'text-blue-500',
    progress: 'bg-blue-500'
  },
  green: {
    text: 'text-green-600',
    bg: 'bg-green-100',
    icon: 'text-green-500',
    progress: 'bg-green-500'
  },
  purple: {
    text: 'text-purple-600',
    bg: 'bg-purple-100',
    icon: 'text-purple-500',
    progress: 'bg-purple-500'
  },
  yellow: {
    text: 'text-yellow-600',
    bg: 'bg-yellow-100',
    icon: 'text-yellow-500',
    progress: 'bg-yellow-500'
  },
  red: {
    text: 'text-red-600',
    bg: 'bg-red-100',
    icon: 'text-red-500',
    progress: 'bg-red-500'
  },
  orange: {
    text: 'text-orange-600',
    bg: 'bg-orange-100',
    icon: 'text-orange-500',
    progress: 'bg-orange-500'
  }
}

const textColor = computed(() => colorClasses[props.color].text)
const bgClass = computed(() => colorClasses[props.color].bg)
const iconColor = computed(() => colorClasses[props.color].icon)
const progressClass = computed(() => colorClasses[props.color].progress)
const cardClasses = computed(() => '')

const changeClass = computed(() => ({
  'text-green-600': props.change > 0,
  'text-red-600': props.change < 0
}))

// 数字动画
watch(() => props.value, (newValue) => {
  animateValue(newValue)
}, { immediate: true })

const animateValue = (target) => {
  const start = animatedValue.value
  const duration = 1000
  const startTime = performance.now()

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    animatedValue.value = Math.floor(start + (target - start) * easeOutQuart)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}
</script>
