<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-20 overflow-hidden relative">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center relative z-10">
          <div class="md:w-1/2 mb-10 md:mb-0 animate-slide-up">
            <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              产业带企业的<br>
              <span class="text-yellow-300">一站式数智化平台</span>
            </h1>
            <p class="text-xl mb-8 text-gray-100">
              整合供应链平台、会员体系和任务系统，为产业带企业提供全方位的数字化出海服务
            </p>
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <router-link 
                to="/register" 
                class="bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-center inline-block"
              >
                立即注册
              </router-link>
              <a 
                href="#features" 
                class="border border-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-primary-600 hover:scale-105 transition-all duration-300 text-center inline-block"
              >
                了解更多
              </a>
            </div>
          </div>
          <div class="md:w-1/2 flex justify-center">
            <div class="text-9xl opacity-80 animate-pulse">
              <i class="fas fa-rocket"></i>
            </div>
          </div>
        </div>
      </div>
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16 animate-slide-up">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">三大核心系统</h2>
          <p class="text-lg text-gray-600">
            完全整合的供应链、会员和任务系统，实现数据打通和协同工作
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 供应链平台 -->
          <div class="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div class="text-center p-8">
              <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-building text-blue-600 text-4xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-4">供应链平台</h3>
              <p class="text-gray-600 mb-6">
                供应商入驻、产品管理、任务发布，为企业提供完整的供应链数字化解决方案
              </p>
              <ul class="text-left text-gray-600 space-y-3 mb-6">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>供应商入驻认证</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>产品展示管理</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>任务发布与管理</li>
              </ul>
              <router-link 
                to="/supplier"
                v-if="authStore.isSupplier"
                class="btn btn-primary w-full hover:scale-105 transition-transform duration-300"
              >
                进入供应商中心
              </router-link>
              <router-link
                to="/register"
                v-else
                class="btn btn-primary w-full hover:scale-105 transition-transform duration-300"
              >
                成为供应商
              </router-link>
            </div>
          </div>

          <!-- 会员体系 -->
          <div class="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div class="text-center p-8">
              <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-users text-green-600 text-4xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-4">会员体系</h3>
              <p class="text-gray-600 mb-6">
                会员管理、技能认证、信用评级，打造专业的会员生态体系
              </p>
              <ul class="text-left text-gray-600 space-y-3 mb-6">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>会员等级体系</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>技能认证</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>信用评分系统</li>
              </ul>
              <router-link 
                to="/member"
                v-if="authStore.isMember"
                class="btn btn-primary w-full hover:scale-105 transition-transform duration-300"
              >
                进入会员中心
              </router-link>
              <router-link 
                to="/register" 
                v-else 
                class="btn btn-primary w-full hover:scale-105 transition-transform duration-300"
              >
                成为会员
              </router-link>
            </div>
          </div>

          <!-- 任务系统 -->
          <div class="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div class="text-center p-8">
              <div class="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-tasks text-purple-600 text-4xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-4">任务系统</h3>
              <p class="text-gray-600 mb-6">
                任务发布、认领、执行、评价，实现完整的任务协同流程
              </p>
              <ul class="text-left text-gray-600 space-y-3 mb-6">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>任务智能匹配</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>进度实时追踪</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>回报自动结算</li>
              </ul>
              <router-link 
                to="/member/tasks"
                class="btn btn-primary w-full hover:scale-105 transition-transform duration-300"
              >
                浏览任务
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">{{ stats.suppliers || '200+' }}</div>
            <div class="text-gray-600">合作企业</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">{{ stats.members || '5000+' }}</div>
            <div class="text-gray-600">注册会员</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">{{ stats.tasks || '10000+' }}</div>
            <div class="text-gray-600">完成任务</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">98%</div>
            <div class="text-gray-600">满意度</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-6">准备好开始了吗？</h2>
        <p class="text-xl mb-8 text-gray-100">
          立即加入数智服务港，开启您的数字化出海之旅
        </p>
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <router-link to="/register" class="bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
            免费注册
          </router-link>
          <router-link to="/login" class="border border-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-primary-600 transition">
            立即登录
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getStats } from '@/utils/api'

const authStore = useAuthStore()
const stats = ref({
  members: 0,
  suppliers: 0,
  products: 0,
  tasks: 0
})

onMounted(async () => {
  try {
    const data = await getStats()
    stats.value = data
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
})
</script>
