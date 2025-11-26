<script setup>
import { ref, onMounted } from "vue";
import CommonButton from "@/components/common/CommonButton.vue";
import { categoryApi } from "@/api/categoryApi";
import { rewardAdminApi } from "@/api/rewardAdminApi";
import { useRouter } from "vue-router";

const props = defineProps({
  rewardId: Number,
});
const emit = defineEmits(["saved"]);
const router = useRouter();

const form = ref({
  name: "",
  description: "",
  pointCost: "",
  categoryId: null,
  imgFile: null,
});

const imgPreview = ref(null);
const categories = ref([]);

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  form.value.imgFile = file;
  imgPreview.value = URL.createObjectURL(file);
};

const loadCategories = async () => {
  const res = await categoryApi.list();
  categories.value = res.data.data;
};

const loadReward = async () => {
  if (!props.rewardId) return;
  const res = await rewardAdminApi.detailReward(props.rewardId);
  const data = res.data.data;

  form.value.name = data.name;
  form.value.description = data.description;
  form.value.pointCost = data.pointCost;
  form.value.categoryId = data.category?.categoryId ?? null;

  if (data.imgName) {
    imgPreview.value = import.meta.env.VITE_IMG_BASE_URL + data.imgName;
  }
};

const save = async () => {
  const payload = {
    name: form.value.name,
    description: form.value.description,
    pointCost: form.value.pointCost,
    categoryId: form.value.categoryId,
    image: form.value.imgFile,
  };

  if (props.rewardId) {
    await rewardAdminApi.update(props.rewardId, payload);
  } else {
    await rewardAdminApi.create(payload);
  }

  emit("saved");
};

onMounted(() => {
  loadCategories();
  loadReward();
});
</script>

<template>
  <div class="reward-form-card">

    <!-- 이미지 -->
    <div class="image-area">
      <label class="image-box">
        <img v-if="imgPreview" :src="imgPreview" class="preview" />
        <div v-else class="placeholder">
          이미지 업로드
        </div>
        <input type="file" accept="image/*" @change="onFileChange" hidden />
      </label>
    </div>

    <!-- 필드 -->
    <div class="fields">

      <div class="field">
        <label>경품명</label>
        <input v-model="form.name" type="text" class="input" placeholder="경품명을 입력하세요" />
      </div>

      <div class="field">
        <label>포인트</label>
        <input v-model="form.pointCost" type="number" class="input" placeholder="사용 포인트" />
      </div>

      <div class="field">
        <label>카테고리</label>
        <select v-model="form.categoryId" class="input">
          <option disabled value="">카테고리 선택</option>

          <template v-for="p in categories">
            <option :value="p.id">{{ p.name }}</option>
            <option v-for="c in p.children" :value="c.id" :key="c.id">
              └ {{ c.name }}
            </option>
          </template>
        </select>
      </div>

      <div class="field">
        <label>설명</label>
        <textarea v-model="form.description" class="textarea" placeholder="설명을 입력하세요" />
      </div>

    </div>

    <!-- 버튼 -->
    <div class="btn-row">
      <CommonButton type="save" width="180px" height="52px" @click="save" />
      <CommonButton type="cancel" width="160px" height="52px" @click="router.back()" />
    </div>

  </div>
</template>

<style scoped lang="scss">

/* 전체 카드 */
.reward-form-card {
  max-width: 700px;
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  padding: 32px 36px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 이미지 영역 */
.image-area {
  display: flex;
  justify-content: center;
}

.image-box {
  width: 260px;
  height: 260px;
  border-radius: 16px;
  border: 2px dashed #cfcfcf;
  background: #fafafa;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.25s;

  &:hover {
    border-color: #999;
    background: #f3f3f3;
  }

  .preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
  }

  .placeholder {
    font-size: 16px;
    color: #777;
  }
}

/* 입력 영역 */
.fields {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.field label {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

.input,
.textarea,
select {
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 15px;
  background: #fff;
  box-sizing: border-box;   /* 🔥 오른쪽 삐져나옴 해결 */
}

.textarea {
  height: 120px;
  resize: vertical;
}

/* 버튼 */
.btn-row {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

</style>
