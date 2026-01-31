<template>
  <div class="content-audit-container">
    <el-page-header :title="'返回'" @back="goBack">
      <template #content>
        <span>内容审核</span>
      </template>
    </el-page-header>

    <el-card class="audit-list-card" style="margin-top: 20px">
      <div class="clearfix">
        <span>审核列表</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="refreshList"
        >
          刷新
        </el-button>
      </div>

      <el-table
        :data="auditList"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="_id"
          label="审核ID"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="user_id.username"
          label="用户名"
          width="100"
        ></el-table-column>
        <el-table-column label="垃圾图片" width="120">
          <template #default="scope">
            <el-image
              style="
                width: 80px;
                height: 80px;
                border-radius: 4px;
                cursor: pointer;
              "
              :src="getImageUrl(scope.row.garbage_img)"
              :preview-src-list="[getImageUrl(scope.row.garbage_img)]"
              fit="cover"
              @click="previewImage(getImageUrl(scope.row.garbage_img))"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="garbage_category"
          label="垃圾类别"
          width="100"
        ></el-table-column>
        <el-table-column prop="audit_status" label="审核状态" width="100">
          <template #default="scope">
            <el-tag
              :type="getStatusType(scope.row.audit_status)"
              disable-transitions
            >
              {{ scope.row.audit_status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="points_earned"
          label="积分"
          width="80"
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
              type="success"
              @click="updateAuditStatus(scope.row._id, '通过')"
              :disabled="scope.row.audit_status !== '等待中'"
            >
              通过
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="updateAuditStatus(scope.row._id, '不通过')"
              :disabled="scope.row.audit_status !== '等待中'"
            >
              不通过
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

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="dialogVisible" title="图片预览" width="50%">
      <img :src="previewImageUrl" style="width: 100%; height: auto" />
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
const auditList = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const previewImageUrl = ref("");

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取审核列表
const fetchAuditList = async (page = 1, size = 10) => {
  loading.value = true;
  try {
    // 根据接口文档4.4，使用正确的接口获取所有审核记录
    const response = await api.get(`/recycle?page=${page}&limit=${size}`);

    if (response.success) {
      // 根据接口文档结构处理数据
      auditList.value = response.data;
      total.value = response.pagination?.totalRecords || response.data.length;
      currentPage.value = response.pagination?.currentPage || page;
    } else {
      ElMessage.error(response.message || "获取审核列表失败");
    }
  } catch (error) {
    console.error("获取审核列表失败:", error);
    // 如果后端接口有问题，使用模拟数据
    console.warn("使用模拟数据，实际部署时需要后端提供对应接口");

    // 模拟数据，符合接口文档结构
    auditList.value = [
      {
        _id: "1",
        user_id: {
          _id: "user001",
          username: "user1",
          email: "user1@example.com",
          points: 100,
        },
        garbage_img: "/uploads/sample1.jpg",
        garbage_category: "塑料",
        audit_status: "等待中",
        points_earned: 10,
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z",
      },
      {
        _id: "2",
        user_id: {
          _id: "user002",
          username: "user2",
          email: "user2@example.com",
          points: 150,
        },
        garbage_img: "/uploads/sample2.jpg",
        garbage_category: "纸张",
        audit_status: "通过",
        points_earned: 15,
        createdAt: "2024-01-01T11:00:00.000Z",
        updatedAt: "2024-01-01T11:00:00.000Z",
      },
      {
        _id: "3",
        user_id: {
          _id: "user003",
          username: "user3",
          email: "user3@example.com",
          points: 80,
        },
        garbage_img: "/uploads/sample3.jpg",
        garbage_category: "金属",
        audit_status: "不通过",
        points_earned: 0,
        createdAt: "2024-01-01T12:00:00.000Z",
        updatedAt: "2024-01-01T12:00:00.000Z",
      },
      {
        _id: "4",
        user_id: {
          _id: "user004",
          username: "user4",
          email: "user4@example.com",
          points: 200,
        },
        garbage_img: "/uploads/sample4.jpg",
        garbage_category: "玻璃",
        audit_status: "等待中",
        points_earned: 12,
        createdAt: "2024-01-01T13:00:00.000Z",
        updatedAt: "2024-01-01T13:00:00.000Z",
      },
    ];
    total.value = auditList.value.length;
  } finally {
    loading.value = false;
  }
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchAuditList(currentPage.value, size);
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  fetchAuditList(page, pageSize.value);
};

// 获取图片完整URL
const getImageUrl = (relativePath) => {
  if (!relativePath) return "";
  // 如果已经是完整URL，则直接返回
  if (relativePath.startsWith("http")) {
    return relativePath;
  }
  // 否则加上服务器前缀
  return `http://localhost:3000${relativePath}`;
};

// 预览图片
const previewImage = (url) => {
  previewImageUrl.value = url;
  dialogVisible.value = true;
};

// 更新审核状态
const updateAuditStatus = async (id, status) => {
  try {
    await ElMessageBox.confirm(
      `确定要将该审核记录标记为"${status}"吗？`,
      "确认操作",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    // 根据接口文档4.5，使用正确的接口更新审核状态
    // PUT /api/recycle/:audit_id/status
    const statusValue = status === "通过" ? "成功" : "失败";
    const response = await api.put(`/recycle/${id}/status`, {
      audit_status: statusValue,
      points_earned: status === "通过" ? 10 : 0, // 如果是通过，给予10积分，否则0积分
    });

    if (response.success) {
      ElMessage.success(`${status}操作成功`);
      // 重新获取列表
      fetchAuditList(currentPage.value, pageSize.value);
    } else {
      ElMessage.error(response.message || `${status}操作失败`);
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error(`${status}操作失败:`, error);
      ElMessage.error(`${status}操作失败`);
    }
  }
};

// 刷新列表
const refreshList = () => {
  fetchAuditList(currentPage.value, pageSize.value);
};

// 返回首页
const goBack = () => {
  router.push("/home");
};

// 初始化
onMounted(() => {
  fetchAuditList();
});

// 状态标签颜色映射
const getStatusType = (status) => {
  switch (status) {
    case "通过":
      return "success";
    case "不通过":
      return "danger";
    case "等待中":
      return "warning";
    default:
      return "info";
  }
};
</script>

<style scoped>
.content-audit-container {
  padding: 20px;
}

.audit-list-card {
  min-height: 500px;
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
</style>
