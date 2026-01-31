<template>
  <div class="user-management-container">
    <el-page-header :title="'返回'" @back="goBack">
      <template #content>
        <span>用户管理</span>
      </template>
    </el-page-header>

    <el-card class="user-list-card" style="margin-top: 20px">
      <div class="clearfix">
        <span>用户列表</span>
        <div style="float: right">
          <el-select
            v-model="roleFilter"
            placeholder="选择角色筛选"
            style="margin-right: 10px; width: 120px"
            @change="refreshList"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="用户" value="user"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
          <el-button type="text" @click="refreshList"> 刷新 </el-button>
        </div>
      </div>

      <el-table :data="userList" stripe style="width: 100%" v-loading="loading">
        <el-table-column
          prop="_id"
          label="用户ID"
          width="240"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="120"
        ></el-table-column>
        <el-table-column prop="score" label="积分" width="100">
          <template #default="scope">
            <el-tag type="warning">{{ scope.row.score }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
              {{ scope.row.role === "admin" ? "管理员" : "用户" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="150"
        ></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="scope">
            {{ new Date(scope.row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="showUpdateRoleDialog(scope.row)"
              :disabled="scope.row.role === 'admin'"
            >
              设为管理员
            </el-button>
            <el-button
              size="small"
              type="info"
              @click="showUpdateRoleDialog(scope.row, 'user')"
              :disabled="scope.row.role === 'user'"
            >
              设为普通用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div
        class="pagination-container"
        style="margin-top: 20px; text-align: center"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 更新用户角色弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="更新用户角色"
      width="40%"
      :before-close="handleClose"
    >
      <div v-if="selectedUser">
        <p>
          用户: <strong>{{ selectedUser.username }}</strong>
        </p>
        <p>
          当前角色:
          <el-tag :type="selectedUser.role === 'admin' ? 'danger' : 'primary'">
            {{ selectedUser.role === "admin" ? "管理员" : "用户" }}
          </el-tag>
        </p>
        <p style="margin-top: 20px">请选择新角色:</p>
        <el-radio-group v-model="newRole" style="margin-top: 10px">
          <el-radio label="user">普通用户</el-radio>
          <el-radio label="admin">管理员</el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="updateUserRole">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import api from "../utils/api";

const router = useRouter();

// 数据
const userList = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 筛选条件
const roleFilter = ref("");

// 角色更新相关
const selectedUser = ref(null);
const newRole = ref("");

// 获取用户列表
const fetchUserList = async (page = 1, limit = 10, role = "") => {
  loading.value = true;
  try {
    // 构建查询参数
    let url = `/user/users?page=${page}&limit=${limit}`;
    if (role) {
      url += `&role=${role}`;
    }

    const response = await api.get(url);

    if (response.success) {
      userList.value = response.data;
      total.value = response.pagination?.totalUsers || response.data.length;
      currentPage.value = response.pagination?.currentPage || page;
    } else {
      ElMessage.error(response.message || "获取用户列表失败");
    }
  } catch (error) {
    console.error("获取用户列表失败:", error);
    ElMessage.error("获取用户列表失败");
  } finally {
    loading.value = false;
  }
};

// 显示更新角色对话框
const showUpdateRoleDialog = (user, targetRole = "admin") => {
  selectedUser.value = user;
  newRole.value = targetRole;
  dialogVisible.value = true;
};

// 更新用户角色
const updateUserRole = async () => {
  if (!selectedUser.value || !newRole.value) {
    ElMessage.error("请选择用户和角色");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要将用户 "${selectedUser.value.username}" 的角色更新为 "${newRole.value === "admin" ? "管理员" : "普通用户"}" 吗？`,
      "确认操作",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await api.put(
      `/user/users/${selectedUser.value._id}/role`,
      {
        role: newRole.value,
      },
    );

    if (response.success) {
      ElMessage.success("用户角色更新成功");
      dialogVisible.value = false;
      // 重新获取列表
      fetchUserList(currentPage.value, pageSize.value, roleFilter.value);
    } else {
      ElMessage.error(response.message || "用户角色更新失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("用户角色更新失败:", error);
      ElMessage.error("用户角色更新失败");
    }
  }
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchUserList(currentPage.value, size, roleFilter.value);
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  fetchUserList(page, pageSize.value, roleFilter.value);
};

// 刷新列表
const refreshList = () => {
  fetchUserList(currentPage.value, pageSize.value, roleFilter.value);
};

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false;
  selectedUser.value = null;
  newRole.value = "";
};

// 返回首页
const goBack = () => {
  router.push("/home");
};

// 初始化
onMounted(() => {
  fetchUserList();
});
</script>

<style scoped>
.user-management-container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.user-list-card {
  min-height: 500px;
  width: 100%;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}

.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
