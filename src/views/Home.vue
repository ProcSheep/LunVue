<template>
  <el-container class="home-container">
    <!-- 顶部导航栏 -->
    <el-header class="home-header">
      <div class="header-left">
        <h1 class="system-title">垃圾回收管理系统</h1>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <el-avatar size="32" :src="userAvatar" />
            <span style="margin-left: 8px">{{
              userStore.userInfo.username
            }}</span>
            <el-icon style="margin-left: 4px"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-icon><User /></el-icon>
                <span>个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-icon><Setting /></el-icon>
                <span>系统设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="main-container">
      <!-- 左侧菜单栏 -->
      <el-aside width="200px" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/home/content-audit">
            <el-icon><Document /></el-icon>
            <span>内容审核</span>
          </el-menu-item>
          <el-menu-item index="/home/product-management">
            <el-icon><Shop /></el-icon>
            <span>商品管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧内容区域 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// 当前激活的菜单项
const activeMenu = computed(() => route.path);

// 用户头像
const userAvatar = ref(
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
);

// 退出登录
const handleLogout = () => {
  userStore.clearUserInfo();
  router.push("/login");
  ElMessage.success("退出登录成功");
};
</script>

<style scoped>
/* 重置全局样式，确保全屏显示 */
* {
  box-sizing: border-box;
}

.home-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.home-header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 100;
  flex-shrink: 0;
}

.system-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.main-container {
  height: calc(100vh - 60px); /* 减去头部高度 */
  overflow: hidden;
}

.sidebar {
  background-color: #545c64;
  width: 200px !important;
  flex-shrink: 0;
}

.sidebar-menu {
  border: none;
  height: 100%;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 64px !important;
  }

  .sidebar-menu span {
    display: none;
  }

  .sidebar-menu .el-icon {
    margin-right: 0;
  }
}
</style>
