<template>
  <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <i class="fas fa-check-circle text-green-500 text-xl"></i>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-green-800">
          {{ title || '操作成功' }}
        </h3>
        <div class="mt-2 text-sm text-green-700">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessMessage',
  props: {
    title: String,
    message: {
      type: String,
      required: true
    }
  }
}
</script>
