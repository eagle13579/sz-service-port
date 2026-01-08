<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Table Header -->
    <div class="px-6 py-4 border-b bg-gray-50">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-800">{{ title }}</h2>
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Search and Filter -->
    <div v-if="searchable || filterable" class="px-6 py-4 border-b">
      <div class="flex flex-col md:flex-row gap-4">
        <div v-if="searchable" class="flex-1">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="searchPlaceholder"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div v-if="filterable" class="flex items-center gap-2">
          <select
            v-model="selectedFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部</option>
            <option v-for="filter in filters" :key="filter.value" :value="filter.value">
              {{ filter.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50">
            <th
              v-for="column in columns"
              :key="column.key"
              :class="column.align || 'text-left'"
              class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(item, index) in filteredData"
            :key="item.id || index"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="column.align || 'text-left'"
              class="px-6 py-4 whitespace-nowrap"
            >
              <slot :name="`cell-${column.key}`" :row="item">
                {{ getCellValue(item, column.key) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredData.length === 0" class="py-12 text-center text-gray-500">
      <i class="fas fa-inbox text-5xl mb-4 opacity-50"></i>
      <p>{{ emptyMessage }}</p>
    </div>

    <!-- Pagination -->
    <div v-if="paginated && totalPages > 1" class="px-6 py-4 border-t bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          显示 {{ startIndex + 1 }} - {{ Math.min(endIndex, totalItems) }} / {{ totalItems }} 项
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="px-3 py-1.5 text-sm font-medium">{{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  title: String,
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  searchable: Boolean,
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  filterable: Boolean,
  filters: {
    type: Array,
    default: () => []
  },
  filterKey: String,
  paginated: Boolean,
  pageSize: {
    type: Number,
    default: 10
  },
  emptyMessage: {
    type: String,
    default: '暂无数据'
  }
})

const searchQuery = ref('')
const selectedFilter = ref('')
const currentPage = ref(1)

const totalItems = computed(() => props.data.length)

const filteredData = computed(() => {
  let result = [...props.data]

  // 搜索过滤
  if (searchQuery.value && props.searchable) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => {
      return props.columns.some(column => {
        const value = getCellValue(item, column.key)
        return value && value.toString().toLowerCase().includes(query)
      })
    })
  }

  // 状态过滤
  if (selectedFilter.value && props.filterable && props.filterKey) {
    result = result.filter(item => item[props.filterKey] === selectedFilter.value)
  }

  return result
})

const totalPages = computed(() => {
  if (!props.paginated) return 1
  return Math.ceil(filteredData.value.length / props.pageSize)
})

const startIndex = computed(() => (currentPage.value - 1) * props.pageSize)
const endIndex = computed(() => startIndex.value + props.pageSize)

const paginatedData = computed(() => {
  if (!props.paginated) return filteredData.value
  return filteredData.value.slice(startIndex.value, endIndex.value)
})

// 监听搜索和过滤变化，重置页码
watch([searchQuery, selectedFilter], () => {
  currentPage.value = 1
})

const getCellValue = (item, key) => {
  return key.split('.').reduce((obj, k) => obj?.[k], item)
}
</script>
