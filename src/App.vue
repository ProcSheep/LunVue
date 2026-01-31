<script setup>
import { onMounted } from "vue";
import { useUserStore } from "./stores/user";

const userStore = useUserStore();

// 初始化用户信息
onMounted(() => {
  userStore.initUserInfo();
});
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  background-color: #f5f7fa;
  overflow: hidden;
}

.app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
