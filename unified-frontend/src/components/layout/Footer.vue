<template>
  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- 关于 -->
        <div>
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-globe-americas text-white text-xl"></i>
            </div>
            <span class="text-xl font-bold ml-2">数智服务港</span>
          </div>
          <p class="text-gray-400 text-sm">
            产业带企业的一站式数智化平台，整合供应链、会员体系和任务系统
          </p>
        </div>
        
        <!-- 核心功能 -->
        <div>
          <h4 class="font-bold mb-4">核心功能</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li><router-link to="/member/tasks" class="hover:text-white transition">任务大厅</router-link></li>
            <li><router-link to="/member/activities" class="hover:text-white transition">活动中心</router-link></li>
            <li><router-link to="/supplier/products" class="hover:text-white transition">产品展示</router-link></li>
          </ul>
        </div>
        
        <!-- 角色 -->
        <div>
          <h4 class="font-bold mb-4">用户角色</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li><router-link to="/supplier" class="hover:text-white transition">供应商</router-link></li>
            <li><router-link to="/member" class="hover:text-white transition">会员</router-link></li>
          </ul>
        </div>
        
        <!-- 联系我们 -->
        <div>
          <h4 class="font-bold mb-4">联系我们</h4>
          <div class="space-y-2 text-gray-400 text-sm">
            <div class="flex items-center">
              <i class="fas fa-envelope w-5"></i>
              <span class="ml-2">contact@szserviceport.com</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-phone w-5"></i>
              <span class="ml-2">400-888-6666</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <div class="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
        <p>&copy; 2026 数智服务港. 保留所有权利.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 页脚组件
</script>
