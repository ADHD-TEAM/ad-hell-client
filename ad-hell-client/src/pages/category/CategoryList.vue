<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { categoryApi } from "@/api/categoryApi";
import CommonButton from "@/components/common/CommonButton.vue";
import CommonModal from "@/components/common/CommonModal.vue";
import { useCategoryStore } from "@/stores/categoryStore";

const router = useRouter();
const categoryStore = useCategoryStore();

const categories = ref([]);
const loading = ref(false);
const error = ref(null);

// 삭제 모달
const showDeleteModal = ref(false);
const deleteTargetId = ref(null);

const parentCategories = computed(() =>
    categories.value.filter(c => c.parentId === null)
);

const openDeleteModal = (id) => {
  deleteTargetId.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await categoryApi.delete(deleteTargetId.value);
    await loadCategories();
  } catch (e) {
    alert("삭제 실패!");
  }
};

const loadCategories = async () => {
  loading.value = true;
  try {
    const res = await categoryApi.list();
    categories.value = res.data.data;
  } catch (e) {
    error.value = e;
  } finally {
    loading.value = false;
  }
};

onMounted(loadCategories);

// 이동
const goEdit = (id) => router.push(`/admin/categories/${id}/edit`);

const goCreate = () => {
  // 부모 카테고리 Store에 저장
  categoryStore.parentCategories = parentCategories.value;
  router.push({ name: "AdminCategoryCreate" });
};
</script>

<template>
  <section class="category-page">

    <h1 class="title">카테고리 관리</h1>

    <div v-if="loading" class="center">로딩 중...</div>
    <div v-else-if="error" class="center">오류 발생</div>

    <div v-else class="scroll-box">
      <div
          v-for="cate in categories"
          :key="cate.id"
          class="parent-box"
      >
        <!-- 대분류 -->
        <div class="parent-row">
          <div class="left">
            <span class="parent-label">대분류</span>
            <strong>{{ cate.name }}</strong>
            <p class="desc">{{ cate.description }}</p>
          </div>

          <div class="actions">
            <CommonButton type="update" width="60px" height="34px" @click="goEdit(cate.id)" />
            <CommonButton type="delete" width="60px" height="34px" @click="openDeleteModal(cate.id)" />
          </div>
        </div>

        <!-- 소분류 -->
        <div
            v-for="child in cate.children"
            :key="child.id"
            class="child-row"
        >
          <div class="left">
            <span class="child-label">소분류</span>
            <span class="child-name">{{ child.name }}</span>
            <p class="desc">{{ child.description }}</p>
          </div>

          <div class="actions">
            <CommonButton type="update" width="60px" height="34px" @click="goEdit(child.id)" />
            <CommonButton type="delete" width="60px" height="34px" @click="openDeleteModal(child.id)" />
          </div>
        </div>

      </div>
    </div>

    <!-- 등록 버튼 -->
    <div class="create-btn-box">
      <CommonButton type="register" width="140px" height="48px" @click="goCreate" />
    </div>

    <!-- 삭제 모달 -->
    <CommonModal
        v-model="showDeleteModal"
        mode="confirm"
        message="정말 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        @confirm="confirmDelete"
    />
  </section>
</template>

<style scoped lang="scss">
.category-page {
  padding: 24px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
}

.center {
  text-align: center;
  margin-top: 40px;
}

.scroll-box {
  max-height: 580px;
  overflow-y: auto;
  padding-right: 8px;
}

.parent-box {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 18px;
  background: #fff;
}

.parent-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;
    flex-direction: column;
  }

  strong {
    font-size: 18px;
    margin-top: 4px;
  }
}

.child-row {
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fafafa;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.parent-label {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background: #ffdddd;
  color: #d60000;
}

.child-label {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background: #e6f2ff;
  color: #005fcc;
}

.desc {
  font-size: 13px;
  color: #666;
}

.actions {
  display: flex;
  gap: 8px;
}

.create-btn-box {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
