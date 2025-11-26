<script setup>
import { reactive, ref, onMounted } from "vue";
import CommonButton from "@/components/common/CommonButton.vue";
import CommonModal from "@/components/common/CommonModal.vue";
import { categoryApi } from "@/api/categoryApi";

const props = defineProps({
  categoryId: { type: Number, default: null },
});
const emit = defineEmits(["saved"]);

const form = reactive({
  name: "",
  description: "",
  parentId: null,
});

const parentCategories = ref([]);
const showSuccessModal = ref(false);

// 부모 카테고리 로드
const loadParents = async () => {
  const res = await categoryApi.list();
  parentCategories.value = res.data.data.filter(c => c.parentId === null);
};

// 수정 모드 데이터 로드
const loadCategory = async () => {
  if (!props.categoryId) return;

  const res = await categoryApi.detail(props.categoryId);
  const data = res.data.data;

  form.name = data.name;
  form.description = data.description;
  form.parentId = data.parentId;
};

// 저장
const save = async () => {
  try {
    if (props.categoryId) {
      await categoryApi.update(props.categoryId, form);
    } else {
      await categoryApi.create(form);
    }
    showSuccessModal.value = true;
  } catch (e) {
    alert("저장 실패!");
  }
};

const onConfirm = () => emit("saved");

onMounted(() => {
  loadParents();
  loadCategory();
});
</script>

<template>
  <section class="category-form-wrapper">
    <div class="form-box">

      <label>카테고리명</label>
      <input
          v-model="form.name"
          type="text"
          class="input"
          placeholder="카테고리명을 입력하세요"
      />

      <label>설명</label>
      <textarea
          v-model="form.description"
          class="textarea"
          placeholder="설명을 입력하세요"
      />

      <label>부모 카테고리</label>
      <select v-model="form.parentId" class="input">
        <option :value="null">최상위 카테고리</option>
        <option v-for="p in parentCategories" :key="p.id" :value="p.id">
          {{ p.name }}
        </option>
      </select>

      <div class="btn-row">
        <CommonButton type="save" width="160px" height="46px" @click="save" />
        <CommonButton type="cancel" width="120px" height="46px" @click="$router.back()" />
      </div>

    </div>

    <CommonModal
        v-model="showSuccessModal"
        mode="alert"
        message="정상적으로 처리되었습니다."
        confirmText="확인"
        @confirm="onConfirm"
    />
  </section>
</template>

<style scoped lang="scss">
.category-form-wrapper {
  display: flex;
  justify-content: center;
  padding: 32px;
}

.form-box {
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 14px;
  padding: 28px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input,
.textarea {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>
