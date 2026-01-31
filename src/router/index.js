import { createRouter, createWebHistory } from "vue-router";

// 导入组件
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import ContentAudit from "../views/ContentAudit.vue";
import ProductManagement from "../views/ProductManagement.vue";
import UserManagement from "../views/UserManagement.vue";
const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "content-audit",
        name: "ContentAudit",
        component: ContentAudit,
        meta: { title: "内容审核" },
      },
      {
        path: "product-management",
        name: "ProductManagement",
        component: ProductManagement,
        meta: { title: "商品管理" },
      },
      {
        path: "/home/user-management",
        name: "UserManagement",
        component: UserManagement,
        meta: { title: "用户管理" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录（通过localStorage中的用户信息）
  const userInfo = localStorage.getItem("userInfo");
  const isAuthenticated = userInfo && JSON.parse(userInfo)._id;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
