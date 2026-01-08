<template>
  <component
    :is="tag"
    v-bind="attrs"
    :class="buttonClasses"
    :disabled="loading || disabled"
    @click="handleClick"
  >
    <i v-if="loading" class="fas fa-circle-notch fa-spin mr-2"></i>
    <i v-else-if="icon" :class="icon" :class="{ 'mr-2': $slots.default }"></i>
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  icon: String,
  loading: Boolean,
  disabled: Boolean,
  full: Boolean
})

const emit = defineEmits(['click'])

const attrs = computed(() => {
  const { tag, variant, size, icon, loading, disabled, full, ...rest } = props
  return rest
})

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
  success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200'
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const buttonClasses = computed(() => {
  const classes = [
    'inline-flex items-center justify-center',
    'font-semibold rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[props.variant],
    sizeClasses[props.size]
  ]

  if (props.full) {
    classes.push('w-full')
  }

  if (props.variant === 'primary') {
    classes.push('focus:ring-blue-500')
  }

  return classes.join(' ')
})

const handleClick = (event) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>
