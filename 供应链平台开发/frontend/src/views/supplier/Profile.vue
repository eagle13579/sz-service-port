<template>
  <div class="profile">
    <el-card>
      <template #header>
        <span>企业信息</span>
      </template>
      <el-form :model="form" label-width="120px">
        <el-form-item label="公司名称">
          <el-input v-model="form.company_name" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contact_person" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.contact_phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="form.contact_email" placeholder="请输入联系邮箱" />
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="form.address" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="行业">
          <el-select v-model="form.industry" placeholder="请选择行业">
            <el-option label="电子" value="电子" />
            <el-option label="服装" value="服装" />
            <el-option label="家居" value="家居" />
            <el-option label="食品" value="食品" />
          </el-select>
        </el-form-item>
        <el-form-item label="公司简介">
          <el-input v-model="form.company_intro" type="textarea" :rows="4" placeholder="请输入公司简介" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  company_name: '',
  contact_person: '',
  contact_phone: '',
  contact_email: '',
  address: '',
  industry: '',
  company_intro: ''
})

const handleSubmit = () => {
  ElMessage.success('保存功能待实现')
}

onMounted(() => {
  // TODO: 获取供应商信息
  console.log('获取供应商信息')
})
</script>

<style scoped>
</style>
