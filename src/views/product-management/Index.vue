<template>
  <div class="product-management-container">
    <el-page-header :title="'返回'" @back="goBack">
      <template #content>
        <span>商品管理</span>
      </template>
    </el-page-header>

    <el-card class="product-card" style="margin-top: 20px">
      <h3>商品管理页面</h3>
      <p>这里是商品管理模块，用于管理积分商城的商品。</p>
      <p>
        此页面展示了Element Plus Container布局组件的应用效果，实现了全屏布局。
      </p>
      <p>当前路由: {{ $route.path }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.product-management-container {
  padding: 20px;
}

.product-card {
  min-height: 300px;
}
</style>
<template>
  <div class="product-management-container">
    <el-page-header :title="'返回'" @back="goBack">
      <template #content>
        <span>商品管理</span>
      </template>
    </el-page-header>

    <el-card class="product-card" style="margin-top: 20px">
      <h3>商品管理页面</h3>
      <p>这里是商品管理模块，用于管理积分商城的商品。</p>
      <p>
        此页面展示了Element Plus Container布局组件的应用效果，实现了全屏布局。
      </p>
      <p>当前路由: {{ $route.path }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.product-management-container {
  padding: 20px;
}

.product-card {
  min-height: 300px;
}
</style>
