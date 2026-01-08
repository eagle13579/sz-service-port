<template>
  <div class="product-publish">
    <div class="page-header">
      <h2>发布产品</h2>
      <el-button @click="$router.back()">返回</el-button>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 基本信息 -->
      <el-card class="form-card">
        <template #header>
          <h3>基本信息</h3>
        </template>

        <el-form-item label="产品名称" prop="product_name">
          <el-input
            v-model="formData.product_name"
            placeholder="请输入产品名称"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="产品分类" prop="category_id">
          <el-select
            v-model="formData.category_id"
            placeholder="请选择产品分类"
            style="width: 100%"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.category_name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input-number
            v-model="formData.price"
            :min="0"
            :precision="2"
            :step="0.01"
            controls-position="right"
            style="width: 200px"
          />
          <span style="margin-left: 10px; color: #999">元</span>
        </el-form-item>

        <el-form-item label="库存" prop="stock">
          <el-input-number
            v-model="formData.stock"
            :min="0"
            controls-position="right"
            style="width: 200px"
          />
          <span style="margin-left: 10px; color: #999">件</span>
        </el-form-item>
      </el-card>

      <!-- 产品详情 -->
      <el-card class="form-card">
        <template #header>
          <h3>产品详情</h3>
        </template>

        <el-form-item label="产品描述" prop="product_desc">
          <el-input
            v-model="formData.product_desc"
            type="textarea"
            :rows="8"
            placeholder="请输入产品详细描述"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="规格参数" prop="specifications">
          <el-input
            v-model="formData.specifications"
            type="textarea"
            :rows="4"
            placeholder="请输入规格参数，例如：材质、尺寸、重量等"
            maxlength="1000"
          />
        </el-form-item>
      </el-card>

      <!-- 产品图片 -->
      <el-card class="form-card">
        <template #header>
          <h3>产品图片</h3>
        </template>

        <el-form-item label="上传图片" prop="images">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="10"
            :on-exceed="handleExceed"
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                只能上传JPG/PNG/GIF文件，且不超过5MB，最多10张
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-card>

      <!-- 产品标签 -->
      <el-card class="form-card">
        <template #header>
          <h3>产品标签</h3>
        </template>

        <el-form-item label="产品标签">
          <el-select
            v-model="tags"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in commonTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
      </el-card>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleSubmit"
        >
          发布产品
        </el-button>
        <el-button
          size="large"
          @click="handleSaveDraft"
        >
          保存草稿
        </el-button>
        <el-button
          size="large"
          @click="handleReset"
        >
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { createProduct } from '../../api/product';

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);
const fileList = ref([]);
const categories = ref([]);
const tags = ref([]);

const commonTags = [
  '新品上市', '热销', '包邮', '正品保障', '厂家直供',
  '现货', '定制', '批发', 'OEM', 'ODM'
];

const formData = reactive({
  product_name: '',
  category_id: null,
  price: null,
  stock: 0,
  product_desc: '',
  specifications: '',
  images: []
});

const rules = {
  product_name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择产品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  product_desc: [
    { required: true, message: '请输入产品描述', trigger: 'blur' },
    { min: 20, message: '产品描述不能少于20个字符', trigger: 'blur' }
  ]
};

// 加载产品分类
const loadCategories = async () => {
  try {
    // 模拟数据，实际应该从API获取
    categories.value = [
      { id: 1, category_name: '电子数码' },
      { id: 2, category_name: '服装服饰' },
      { id: 3, category_name: '家居用品' },
      { id: 4, category_name: '食品饮料' },
      { id: 5, category_name: '机械设备' }
    ];
  } catch (error) {
    console.error('加载分类失败:', error);
  }
};

const handleExceed = (files) => {
  ElMessage.warning(`最多只能上传10张图片，本次选择了 ${files.length} 张文件`);
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();

    if (fileList.value.length === 0) {
      ElMessage.warning('请至少上传一张产品图片');
      return;
    }

    loading.value = true;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'images') {
        formDataToSend.append(key, formData[key]);
      }
    });

    formDataToSend.append('tags', JSON.stringify(tags));

    fileList.value.forEach((file) => {
      formDataToSend.append('images', file.raw);
    });

    await createProduct(formDataToSend);

    ElMessage.success('产品发布成功，等待审核');
    router.push('/supplier/products');
  } catch (error) {
    if (error.response) {
      ElMessage.error(error.response.data.message || '发布失败');
    } else {
      console.error('发布失败:', error);
    }
  } finally {
    loading.value = false;
  }
};

const handleSaveDraft = async () => {
  try {
    loading.value = true;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'images') {
        formDataToSend.append(key, formData[key]);
      }
    });

    formDataToSend.append('status', 'draft');
    formDataToSend.append('tags', JSON.stringify(tags));

    fileList.value.forEach((file) => {
      formDataToSend.append('images', file.raw);
    });

    await createProduct(formDataToSend);

    ElMessage.success('草稿保存成功');
    router.push('/supplier/products');
  } catch (error) {
    ElMessage.error('保存草稿失败');
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    formRef.value.resetFields();
    fileList.value = [];
    tags.value = [];
  }).catch(() => {});
};

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.product-publish {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.form-card {
  margin-bottom: 20px;
}

.form-card h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.form-actions {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 4px;
}

.form-actions .el-button {
  margin: 0 10px;
}

:deep(.el-upload__tip) {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
