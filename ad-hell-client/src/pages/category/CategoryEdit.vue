<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { categoryApi } from "@/api/categoryApi";
import CommonButton from "@/components/common/CommonButton.vue";
import CommonModal from "@/components/common/CommonModal.vue";
import { useCategoryStore } from "@/stores/categoryStore.js";

const router = useRouter();
const route = useRoute();
const categoryStore = useCategoryStore();

// URL에서 ID 가져오기
const categoryId = Number(route.params.id);

// 부모 카테고리 리스트
const parentCategories = categoryStore.parentCategories || [];

// form
const form = reactive({
  name: "",
  description: "",
  parentId: null,
});

// 수정 완료 모달
const showSuccessModal = ref(false);

// 기존 데이터 로드
const loadCategory = async () => {
  try {
    const res = await categoryApi.detail(categoryId);
    const data = res.data.data;

    form.name = data.name;
    form.description = data.description;
    form.parentId = data.parentId;
  } catch (err) {
    console.error(err);
    alert("카테고리 정보를 불러오지 못했습니다!");
  }
};

// 수정 API
const updateCategory = async () => {
  try {
    await categoryApi.update(categoryId, form);
    showSuccessModal.value = true;
  } catch (err) {
    console.error(err);
    alert("수정 실패!");
  }
};

// 뒤로가기
const goBack = () => router.push({ name: "AdminCategoryList" });

// 모달 확인 → 목록 이동
const onConfirmModal = () => router.push({ name: "AdminCategoryList" });

onMounted(loadCategory);
</script>

<template>
  <section class="category-create-wrapper">
    <div class="category-create-box">

      <h1 class="title">카테고리 수정</h1>

      <el-form :model="form" label-position="top" class="category-form">

        <!-- 카테고리명 -->
        <el-form-item label="카테고리명">
          <el-input
              v-model="form.name"
              placeholder="카테고리명을 입력하세요."
              clearable
          />
        </el-form-item>

        <!-- 설명 -->
        <el-form-item label="설명">
          <el-input
              v-model="form.description"
              type="textarea"
              :rows="5"
              placeholder="설명을 입력하세요."
          />
        </el-form-item>

        <!-- 부모 카테고리 -->
        <el-form-item label="부모 카테고리">
          <el-select
              v-model="form.parentId"
              placeholder="부모 카테고리 선택"
              clearable
              filterable
          >
            <el-option
                v-for="pc in parentCategories"
                :key="pc.id"
                :label="pc.name"
                :value="pc.id"
            />
          </el-select>
        </el-form-item>

        <!-- 버튼 -->
        <div class="btn-row">
          <CommonButton
              type="cancel"
              width="120px"
              height="46px"
              @click="goBack"
          />
          <CommonButton
              type="update"
              width="160px"
              height="46px"
              @click="updateCategory"
          />
        </div>

      </el-form>
    </div>

    <!-- 수정 완료 모달 -->
    <CommonModal
        v-model="showSuccessModal"
        mode="alert"
        message="카테고리가 수정되었습니다."
        confirmText="확인"
        @confirm="onConfirmModal"
    />

  </section>
</template>

<style scoped lang="scss">
/* Create와 동일 */
.category-create-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px;
}
.category-create-box {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 14px;
  padding: 28px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}
.btn-row {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
