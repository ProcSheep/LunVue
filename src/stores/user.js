import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  // 用户信息状态
  const userInfo = ref({
    _id: "",
    username: "",
    email: "",
    points: 0,
  });

  // 登录状态
  const isLoggedIn = ref(false);

  // 保存用户信息
  const setUserInfo = (info) => {
    userInfo.value = { ...userInfo.value, ...info };
    isLoggedIn.value = true;
    localStorage.setItem("userInfo", JSON.stringify(info));
  };

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = {
      _id: "",
      username: "",
      email: "",
      points: 0,
    };
    isLoggedIn.value = false;
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  // 初始化用户信息
  const initUserInfo = () => {
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      userInfo.value = JSON.parse(savedUserInfo);
      isLoggedIn.value = true;
    }
  };

  return {
    userInfo,
    isLoggedIn,
    setUserInfo,
    clearUserInfo,
    initUserInfo,
  };
});
