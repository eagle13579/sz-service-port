<template>
  <div class="products">
    <el-card>
      <template #header>
        <div class="header-actions">
          <span>产品管理</span>
          <el-button type="primary" @click="handleAdd">发布产品</el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="product_name" label="产品名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="stock" label="库存" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button text @click="handleEdit(row)">编辑</el-button>
            <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="fetchData"
      />
    </el-card>

    <!-- 产品编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="发布产品" width="50%">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="form.product_name" />
        </el-form-item>
        <el-form-item label="产品描述" prop="product_desc">
          <el-input v-model="form.product_desc" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const dialogVisible = ref(false)
const formRef = ref()

const pagination = ref({
  page: 1,
  pageSize: 20,
  total: 0
})

const form = ref({
  product_name: '',
  product_desc: '',
  price: 0,
  stock: 0
})

const rules = {
  product_name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}

const fetchData = async () => {
  // TODO: 调用API获取产品列表
  console.log('获取产品列表', pagination.value)
}

const handleAdd = () => {
  form.value = {
    product_name: '',
    product_desc: '',
    price: 0,
    stock: 0
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessage.success('删除功能待实现')
}

const handleSubmit = () => {
  ElMessage.success('发布功能待实现')
  dialogVisible.value = false
}

const getStatusType = (status) => {
  const map = {
    draft: 'info',
    published: 'success',
    offline: 'warning'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    draft: '草稿',
    published: '已发布',
    offline: '已下架'
  }
  return map[status] || status
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
