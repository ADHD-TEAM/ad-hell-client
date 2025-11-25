<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { categoryApi } from "@/api/categoryApi";
import CommonButton from "@/components/common/CommonButton.vue";
import CommonModal from "@/components/common/CommonModal.vue";
import { useCategoryStore } from "@/stores/categoryStore.js";

const router = useRouter();
const categoryStore = useCategoryStore();

// 부모 카테고리는 Pinia에서 가져오기
const parentCategories = categoryStore.parentCategories || [];

// 폼 데이터
const form = reactive({
  name: "",
  description: "",
  parentId: null,
});

// 등록 완료 모달
const showSuccessModal = ref(false);

// 등록 함수
const createCategory = async () => {
  try {
    const res = await categoryApi.create(form);
    showSuccessModal.value = true; // 모달 오픈
  } catch (err) {
    console.error(err);
    alert("등록 실패!");
  }
};

const goBack = () => router.push({ name: "AdminCategoryList" });

const onConfirmModal = () => router.push({ name: "AdminCategoryList" });
</script>

<template>
  <section class="category-create-wrapper">
    <div class="category-create-box">

      <h1 class="title">카테고리 등록</h1>

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

        <!-- 부모 카테고리 선택 -->
        <el-form-item label="부모 카테고리">
          <el-select
              v-model="form.parentId"
              placeholder="부모 카테고리 선택 (없으면 대분류)"
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
              type="register"
              width="160px"
              height="46px"
              @click="createCategory"
          />
        </div>

      </el-form>
    </div>

    <!-- 등록 완료 모달 -->
    <CommonModal
        v-model="showSuccessModal"
        mode="alert"
        message="카테고리가 정상적으로 등록되었습니다."
        confirmText="확인"
        @confirm="onConfirmModal"
    />

  </section>
</template>

<style scoped lang="scss">
/* 전체 화면 중앙 정렬 */
.category-create-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px;
}

/* 가운데 박스 */
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

.category-form {
  width: 100%;
}

.btn-row {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
