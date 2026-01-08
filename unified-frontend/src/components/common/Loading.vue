<template>
  <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 flex flex-col items-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
      <p class="text-gray-700 font-medium">{{ message || '加载中...' }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
})
</script>
