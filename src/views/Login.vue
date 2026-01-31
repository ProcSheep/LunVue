<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">垃圾回收管理系统</h2>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
      >
        <!-- 用户名输入 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            @click="handleLogin"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import api from "../utils/api";
import { useUserStore } from "../stores/user";

// 表单引用
const loginFormRef = ref();

// 登录表单数据
const loginForm = reactive({
  username: "",
  password: "",
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "用户名长度在 3 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
  ],
};

// 加载状态
const loading = ref(false);

// 路由和状态管理
const router = useRouter();
const userStore = useUserStore();

// 登录处理函数
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    // 表单验证
    await loginFormRef.value.validate();

    // 显示加载状态
    loading.value = true;

    // 调用登录接口
    const response = await api.post("/auth/login", {
      username: loginForm.username,
      password: loginForm.password,
    });

    // 处理响应
    console.log("登录响应:", response);

    if (response && response.user && response.user._id) {
      // 保存用户信息
      userStore.setUserInfo(response.user);

      // 调试信息
      console.log("用户信息已保存:", userStore.userInfo);
      console.log(
        "localStorage中的用户信息:",
        localStorage.getItem("userInfo"),
      );

      // 显示成功消息
      ElMessage.success(response.message || "登录成功");

      // 跳转到首页
      console.log("准备跳转到首页...");
      router.push("/home");
    } else {
      console.error("登录响应格式错误:", response);
      ElMessage.error("登录失败，请检查用户名和密码");
    }
  } catch (error) {
    // 处理登录错误
    console.error("登录失败:", error);
    // API工具已经处理了大部分错误，这里只处理特殊情况
    if (!error.response) {
      ElMessage.error("网络连接失败，请检查网络设置");
    }
  } finally {
    // 隐藏加载状态
    loading.value = false;
  }
};
</script>

<style>
/* 全局样式重置，确保全屏显示 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>

<style scoped>
.login-container {
  /* 使用视口单位确保全屏 */
  height: 100vh;
  height: 100dvh; /* 动态视口高度，适配移动设备 */
  width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  /* 防止内容溢出 */
  overflow: hidden;
  /* 确保在移动设备上也能全屏 */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
}

.login-box {
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 平板设备 */
  .login-box {
    padding: 35px 30px;
    max-width: 90%;
  }

  .login-title {
    font-size: 22px;
  }
}

@media (max-width: 500px) {
  /* 移动设备 */
  .login-container {
    padding: 15px;
  }

  .login-box {
    padding: 25px 20px;
    max-width: 100%;
  }

  .login-title {
    font-size: 20px;
    margin-bottom: 25px;
  }

  .login-btn {
    height: 44px;
    font-size: 15px;
  }
}

/* 横屏适配 */
@media (max-height: 480px) {
  .login-box {
    padding: 20px;
    max-width: 80%;
  }

  .login-title {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .login-form-item {
    margin-bottom: 15px;
  }
}
</style>
