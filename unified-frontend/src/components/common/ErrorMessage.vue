<template>
  <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          {{ title || '发生错误' }}
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
    <div v-if="showDetails && error" class="mt-3">
      <button
        @click="showErrorDetails = !showErrorDetails"
        class="text-sm text-red-600 hover:text-red-800 underline"
      >
        {{ showErrorDetails ? '隐藏详情' : '查看详情' }}
      </button>
      <pre v-if="showErrorDetails" class="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto max-h-40">
        {{ error }}
      </pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    title: String,
    message: {
      type: String,
      required: true
    },
    error: [String, Object],
    showDetails: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showErrorDetails: false
    }
  }
}
</script>
