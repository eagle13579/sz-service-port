<template>
  <div class="supplier-register">
    <div class="container">
      <div class="register-card">
        <div class="card-header">
          <h2>供应商入驻</h2>
          <p class="subtitle">填写企业信息，完成入驻申请</p>
        </div>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="120px"
          @submit.prevent="handleSubmit"
        >
          <!-- 基本信息 -->
          <div class="form-section">
            <h3>基本信息</h3>
            <el-form-item label="公司名称" prop="company_name">
              <el-input
                v-model="formData.company_name"
                placeholder="请输入公司全称"
                maxlength="100"
              />
            </el-form-item>

            <el-form-item label="联系人" prop="contact_person">
              <el-input
                v-model="formData.contact_person"
                placeholder="请输入联系人姓名"
                maxlength="50"
              />
            </el-form-item>

            <el-form-item label="联系电话" prop="contact_phone">
              <el-input
                v-model="formData.contact_phone"
                placeholder="请输入联系电话"
                maxlength="20"
              />
            </el-form-item>

            <el-form-item label="联系邮箱" prop="contact_email">
              <el-input
                v-model="formData.contact_email"
                placeholder="请输入联系邮箱"
                type="email"
              />
            </el-form-item>
          </div>

          <!-- 公司地址 -->
          <div class="form-section">
            <h3>公司地址</h3>
            <el-form-item label="省份" prop="province">
              <el-select
                v-model="formData.province"
                placeholder="请选择省份"
                filterable
                @change="handleProvinceChange"
              >
                <el-option
                  v-for="province in provinces"
                  :key="province"
                  :label="province"
                  :value="province"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="城市" prop="city">
              <el-select
                v-model="formData.city"
                placeholder="请选择城市"
                filterable
              >
                <el-option
                  v-for="city in cities"
                  :key="city"
                  :label="city"
                  :value="city"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="详细地址" prop="address">
              <el-input
                v-model="formData.address"
                type="textarea"
                :rows="3"
                placeholder="请输入详细地址"
                maxlength="255"
              />
            </el-form-item>
          </div>

          <!-- 企业信息 -->
          <div class="form-section">
            <h3>企业信息</h3>
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="formData.industry" placeholder="请选择行业">
                <el-option label="电子产品" value="电子产品" />
                <el-option label="服装纺织" value="服装纺织" />
                <el-option label="食品饮料" value="食品饮料" />
                <el-option label="家居建材" value="家居建材" />
                <el-option label="机械设备" value="机械设备" />
                <el-option label="化工原料" value="化工原料" />
                <el-option label="医疗器械" value="医疗器械" />
                <el-option label="汽车配件" value="汽车配件" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>

            <el-form-item label="公司简介" prop="company_intro">
              <el-input
                v-model="formData.company_intro"
                type="textarea"
                :rows="5"
                placeholder="请输入公司简介，包括主营业务、发展历程等"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="主营产品" prop="main_products">
              <el-input
                v-model="formData.main_products"
                type="textarea"
                :rows="3"
                placeholder="请输入主营产品，多个产品用逗号分隔"
                maxlength="500"
              />
            </el-form-item>

            <el-form-item label="生产能力" prop="production_capacity">
              <el-input
                v-model="formData.production_capacity"
                type="textarea"
                :rows="3"
                placeholder="请描述生产能力、设备规模、年产量等"
                maxlength="500"
              />
            </el-form-item>

            <el-form-item label="品牌故事" prop="brand_story">
              <el-input
                v-model="formData.brand_story"
                type="textarea"
                :rows="5"
                placeholder="请输入品牌故事，讲述品牌创立的历程和理念"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </div>

          <!-- 提交按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleSubmit"
            >
              提交入驻申请
            </el-button>
            <el-button size="large" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { registerSupplier } from '../api/supplier';

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);

const formData = reactive({
  company_name: '',
  contact_person: '',
  contact_phone: '',
  contact_email: '',
  province: '',
  city: '',
  address: '',
  industry: '',
  company_intro: '',
  main_products: '',
  production_capacity: '',
  brand_story: ''
});

const rules = {
  company_name: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  contact_person: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  contact_phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  contact_email: [
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  industry: [
    { required: true, message: '请选择所属行业', trigger: 'change' }
  ],
  company_intro: [
    { required: true, message: '请输入公司简介', trigger: 'blur' },
    { min: 20, message: '公司简介不能少于20个字符', trigger: 'blur' }
  ]
};

const provinces = [
  '北京市', '天津市', '上海市', '重庆市',
  '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
  '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '海南省',
  '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省',
  '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区'
];

const cities = ref([]);

const handleProvinceChange = (province) => {
  // 简化处理，实际项目中应该使用完整城市数据
  cities.value = [
    `${province}市`, `${province}下辖市1`, `${province}下辖市2`
  ];
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;

    await registerSupplier(formData);

    ElMessage.success('入驻申请提交成功，请等待审核');
    router.push('/supplier/dashboard');
  } catch (error) {
    if (error.response) {
      ElMessage.error(error.response.data.message || '提交失败');
    } else {
      console.error('提交失败:', error);
    }
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  formRef.value.resetFields();
};
</script>

<style scoped>
.supplier-register {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.card-header h2 {
  font-size: 32px;
  color: #333;
  margin: 0 0 10px 0;
}

.subtitle {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  font-size: 20px;
  color: #333;
  margin: 0 0 24px 0;
  padding-left: 12px;
  border-left: 4px solid #667eea;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-input__inner) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
}

:deep(.el-button--large) {
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 6px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}
</style>
