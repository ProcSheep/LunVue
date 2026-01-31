import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";

// 创建axios实例
const api = axios.create({
  baseURL: "http://localhost:3000/api", // API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从本地存储获取token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 请求错误处理
    console.error("请求错误:", error);
    return Promise.reject(error);
  },
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 处理成功响应
    return response.data;
  },
  (error) => {
    // 处理错误响应
    let message = "请求失败，请稍后重试";

    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          message = "请先登录";
          // 清除本地存储并跳转到登录页面
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          router.push("/login");
          break;
        case 403:
          message = "没有权限访问该资源";
          break;
        case 404:
          message = "请求的资源不存在";
          break;
        case 500:
          message = "服务器内部错误";
          break;
        default:
          message = error.response.data.message || message;
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      message = "网络错误，请检查网络连接";
    }

    // 显示错误消息
    ElMessage.error(message);
    return Promise.reject(error);
  },
);

export default api;
