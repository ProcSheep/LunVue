<template>
  <div class="content-audit-container">
    <el-page-header :title="'返回'" @back="goBack">
      <template #content>
        <span>内容审核</span>
      </template>
    </el-page-header>

    <el-card class="audit-card" style="margin-top: 20px">
      <h3>内容审核页面</h3>
      <p>这里是内容审核模块，用于审核用户上传的内容。</p>
      <p>
        此页面展示了Element Plus Container布局组件的应用效果，实现了全屏布局。
      </p>
      <p>当前路由: {{ $route.path }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.push("/home");
};
</script>

<style scoped>
.content-audit-container {
  padding: 20px;
}

.audit-card {
  min-height: 300px;
}
</style>
