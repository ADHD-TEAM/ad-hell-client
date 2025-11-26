<!-- src/components/reward/StockModal.vue -->
<template>
  <el-dialog
      class="stock-dialog"
      :model-value="modelValue"
      width="650px"
      :close-on-click-modal="false"
      @update:model-value="updateVisible"
  >
    <h2 class="modal-title">📦 {{ rewardName }} 재고 관리</h2>

    <!-- 재고 리스트 -->
    <div class="stock-scroll">
      <table class="stock-table">
        <thead>
        <tr>
          <th>PIN 번호</th>
          <th>만료일</th>
          <th>상태</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="s in stocks" :key="s.pinNumber">
          <td>{{ s.pinNumber }}</td>
          <td>{{ formatDate(s.expiredAt) }}</td>
          <td>
              <span
                  :class="['status', s.status === 'ACTIVATE' ? 'active' : 'used']"
              >
                {{ s.status }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 추가 입력 -->
    <div class="add-row">
      <input
          v-model="newStock.pinNumber"
          placeholder="PIN 번호"
          class="input"
      />
      <input
          type="datetime-local"
          v-model="newStock.expiredAt"
          class="input"
      />
    </div>

    <!-- 버튼 -->
    <template #footer>
      <div class="footer-btns">
        <CommonButton
            type="register"
            width="120px"
            height="42px"
            @click="addStock"
        />
        <CommonButton
            type="cancel"
            width="120px"
            height="42px"
            @click="close"
        />
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import CommonButton from "@/components/common/CommonButton.vue";
import { rewardAdminApi } from "@/api/rewardAdminApi";

const props = defineProps({
  modelValue: Boolean,
  rewardId: Number,
  rewardName: String,
});

const emit = defineEmits(["update:modelValue"]);

// 상태
const stocks = ref([]);
const newStock = ref({
  pinNumber: "",
  expiredAt: "",
});

// 모달 닫기
const updateVisible = (val) => emit("update:modelValue", val);
const close = () => emit("update:modelValue", false);

// 날짜 포맷터
const formatDate = (date) => {
  return date ? date.replace("T", " ") : "";
};

// 재고 로드
const loadStocks = async () => {
  if (!props.rewardId) return;

  const res = await rewardAdminApi.detail(props.rewardId);
  stocks.value = res.data.data;
};

// 재고 추가
const addStock = async () => {
  if (!newStock.value.pinNumber || !newStock.value.expiredAt) {
    return alert("PIN 번호와 만료일을 입력하세요.");
  }

  // 날짜 유효성 체크
  const now = new Date();
  const expired = new Date(newStock.value.expiredAt);

  if (expired <= now) {
    return alert("만료일은 현재 시각 이후여야 합니다.");
  }

  const payload = {
    pinNumber: newStock.value.pinNumber,
    expiredAt: newStock.value.expiredAt,
  };

  // 👉 요청 body 포함
  await rewardAdminApi.addStock(props.rewardId, payload);

  // 리스트 다시 로드
  await loadStocks();

  emit("stock-updated");   // 부모에게 알림 보내기

  // 폼 초기화
  newStock.value.pinNumber = "";
  newStock.value.expiredAt = "";

  alert("재고가 추가되었습니다.");
};

// 모달이 열릴 때마다 불러오기
watch(
    () => props.modelValue,
    (val) => {
      if (val) loadStocks();
    }
);
</script>

<style scoped lang="scss">
.stock-dialog {
  :deep(.el-dialog__body) {
    padding: 16px 24px 0;
  }
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 14px;
}

/* 재고 목록 스크롤 영역 */
.stock-scroll {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ebebeb;
  border-radius: 6px;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;

  th {
    background: #f7f7f7;
    padding: 10px;
    font-size: 13px;
  }

  td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }
}

/* 상태 스타일 */
.status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.active {
  background: #e4ffe4;
  color: #00a000;
}

.used {
  background: #f0f0f0;
  color: #999;
}

/* 입력 */
.add-row {
  display: flex;
  gap: 10px;
  margin: 16px 0;

  .input {
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
}

/* 버튼 */
.footer-btns {
  display: flex;
  justify-content: center;
  gap: 14px;
  padding-bottom: 16px;
}
</style>
