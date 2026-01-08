<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 主要内容 -->
    <main class="pt-16">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

const authStore = useAuthStore()

onMounted(() => {
  // 初始化时检查本地存储的token
  authStore.checkAuth()
})
</script>
