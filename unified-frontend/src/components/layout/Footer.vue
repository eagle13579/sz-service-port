<template>
  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-lg font-bold mb-4">关于数智服务港</h3>
          <p class="text-gray-400 text-sm">
            致力于为产业带中小企业提供全套数字化及出海服务，涵盖出海培训、出海解决方案、增长运营、项目孵化及出海社群的一站式解决方案。
          </p>
        </div>

        <!-- Systems -->
        <div>
          <h3 class="text-lg font-bold mb-4">核心系统</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><router-link to="/member" class="hover:text-white transition">会员体系</router-link></li>
            <li><router-link to="/supplier" class="hover:text-white transition">供应链平台</router-link></li>
            <li><router-link to="/member/tasks" class="hover:text-white transition">任务系统</router-link></li>
            <li><router-link to="/member/activities" class="hover:text-white transition">活动中心</router-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-lg font-bold mb-4">帮助支持</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><router-link to="/help" class="hover:text-white transition">使用指南</router-link></li>
            <li><router-link to="/faq" class="hover:text-white transition">常见问题</router-link></li>
            <li><router-link to="/contact" class="hover:text-white transition">联系我们</router-link></li>
            <li><router-link to="/privacy" class="hover:text-white transition">隐私政策</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-lg font-bold mb-4">联系我们</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><i class="fas fa-envelope mr-2"></i>contact@sz-service.com</li>
            <li><i class="fas fa-phone mr-2"></i>400-123-4567</li>
            <li><i class="fas fa-map-marker-alt mr-2"></i>上海市浦东新区</li>
          </ul>
          <div class="flex space-x-4 mt-4">
            <a href="#" class="text-gray-400 hover:text-white transition text-xl">
              <i class="fab fa-weixin"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition text-xl">
              <i class="fab fa-weibo"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition text-xl">
              <i class="fab fa-qq"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
        <p>&copy; 2026 数智服务港. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component
</script>
