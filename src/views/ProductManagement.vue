<template>
  <div class="product-management-container">
    <el-page-header :title="'返回'" @back="goBack">
      <template #content>
        <span>商品管理</span>
      </template>
    </el-page-header>

    <el-card class="product-list-card" style="margin-top: 20px">
      <div class="clearfix">
        <span>商品列表</span>
        <el-button
          style="float: right; margin-left: 10px"
          type="primary"
          @click="showAddDialog"
        >
          添加商品
        </el-button>
        <el-button style="float: right" type="text" @click="refreshList">
          刷新
        </el-button>
      </div>

      <el-table
        :data="productList"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="_id"
          label="商品ID"
          width="240"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="150"
        ></el-table-column>
        <el-table-column prop="goods_info" label="商品描述"></el-table-column>
        <el-table-column prop="goods_price" label="价格/积分" width="120">
          <template #default="scope">
            <el-tag type="warning">{{ scope.row.goods_price }} 积分</el-tag>
          </template>
        </el-table-column>
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
              @click="showEditDialog(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteProduct(scope.row.goods_id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑商品弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑商品' : '添加商品'"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="productForm"
        :rules="formRules"
        ref="productFormRef"
        label-width="100px"
      >
        <el-form-item label="商品ID" prop="goods_id">
          <el-input
            v-model="productForm.goods_id"
            :disabled="isEdit"
            placeholder="请输入商品ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name">
          <el-input
            v-model="productForm.goods_name"
            placeholder="请输入商品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="goods_info">
          <el-input
            v-model="productForm.goods_info"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格/积分" prop="goods_price">
          <el-input-number
            v-model="productForm.goods_price"
            :min="0"
            :step="1"
            placeholder="请输入商品价格/所需积分"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitProduct">确定</el-button>
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
const productList = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);

// 总数
const total = ref(0);

// 表单数据
const productForm = ref({
  _id: "",
  goods_id: "",
  goods_name: "",
  goods_info: "",
  goods_price: 0,
});

// 表单引用
const productFormRef = ref(null);

// 表单验证规则
const formRules = {
  goods_id: [
    { required: true, message: "请输入商品ID", trigger: "blur" },
    { min: 1, max: 50, message: "商品ID长度应在1-50之间", trigger: "blur" },
  ],
  goods_name: [
    { required: true, message: "请输入商品名称", trigger: "blur" },
    { min: 1, max: 100, message: "商品名称长度应在1-100之间", trigger: "blur" },
  ],
  goods_info: [
    { required: true, message: "请输入商品描述", trigger: "blur" },
    { min: 1, max: 500, message: "商品描述长度应在1-500之间", trigger: "blur" },
  ],
  goods_price: [
    { required: true, message: "请输入价格/积分", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "价格/积分必须大于等于0",
      trigger: "blur",
    },
  ],
};

// 获取商品列表
const fetchProductList = async () => {
  loading.value = true;
  try {
    // 根据商品接口文档，使用正确的接口获取商品列表
    const response = await api.get("/shop/goods");

    // 根据接口文档响应结构调整数据
    if (response.message === "获取商品数据成功") {
      productList.value = response.data;
      total.value = response.total || response.data.length;
    } else {
      ElMessage.error(response.message || "获取商品列表失败");
    }
  } catch (error) {
    console.error("获取商品列表失败:", error);
    ElMessage.error("获取商品列表失败");
  } finally {
    loading.value = false;
  }
};

// 显示添加商品对话框
const showAddDialog = () => {
  isEdit.value = false;
  productForm.value = {
    _id: "",
    goods_id: "",
    goods_name: "",
    goods_info: "",
    goods_price: 0,
  };
  dialogVisible.value = true;
};

// 显示编辑商品对话框
const showEditDialog = (product) => {
  isEdit.value = true;
  productForm.value = { ...product };
  dialogVisible.value = true;
};

// 提交商品表单
const submitProduct = async () => {
  // 验证表单
  if (!productFormRef.value) return;

  try {
    await productFormRef.value.validate();
  } catch (error) {
    ElMessage.error("请填写完整且正确的信息");
    return;
  }

  try {
    let response;
    if (isEdit.value) {
      // 更新商品 - 根据接口文档使用正确的接口地址
      response = await api.put(`/shop/${productForm.value.goods_id}`, {
        goods_name: productForm.value.goods_name,
        goods_info: productForm.value.goods_info,
        goods_price: productForm.value.goods_price,
      });
    } else {
      // 添加商品 - 根据接口文档使用正确的接口地址
      response = await api.post("/shop/add", {
        goods_id: productForm.value.goods_id,
        goods_name: productForm.value.goods_name,
        goods_info: productForm.value.goods_info,
        goods_price: productForm.value.goods_price,
      });
    }

    if (
      response.success ||
      response.message === "商品添加成功" ||
      response.message === "商品信息更新成功"
    ) {
      ElMessage.success(isEdit.value ? "商品更新成功" : "商品添加成功");
      dialogVisible.value = false;
      // 重新获取列表
      fetchProductList();
    } else {
      ElMessage.error(
        response.message || (isEdit.value ? "商品更新失败" : "商品添加失败"),
      );
    }
  } catch (error) {
    console.error(isEdit.value ? "商品更新失败:" : "商品添加失败:", error);
    ElMessage.error(isEdit.value ? "商品更新失败" : "商品添加失败");
  }
};

// 删除商品
const deleteProduct = async (goodsId) => {
  try {
    await ElMessageBox.confirm(
      "确定要删除这个商品吗？此操作不可撤销！",
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await api.delete(`/shop/${goodsId}`);

    if (response.success) {
      ElMessage.success("商品删除成功");
      // 重新获取列表
      fetchProductList();
    } else {
      ElMessage.error(response.message || "商品删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("商品删除失败:", error);
      ElMessage.error("商品删除失败");
    }
  }
};

// 刷新列表
const refreshList = () => {
  fetchProductList();
};

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false;
  // 清空表单验证
  if (productFormRef.value) {
    productFormRef.value.clearValidate();
  }
};

// 返回首页
const goBack = () => {
  router.push("/home");
};

// 初始化
onMounted(() => {
  fetchProductList();
});
</script>

<style scoped>
.product-management-container {
  padding: 20px;
}

.product-list-card {
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

.dialog-footer {
  text-align: right;
}
</style>
