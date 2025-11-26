<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAdminRewardList } from "@/composables/reward/useAdminRewardList";
import CommonButton from "@/components/common/CommonButton.vue";
import CommonModal from "@/components/common/CommonModal.vue";
import Pagination from "@/components/common/Pagination.vue";
import { rewardAdminApi } from "@/api/rewardAdminApi";
import StockModal from "@/components/reward/StockModal.vue";

const router = useRouter();

// 리스트 데이터 가져오기
const {
  rewards,
  loading,
  error,
  currentPage,
  totalPages,
  size,
  loadRewards,
} = useAdminRewardList();

const BASE_IMG_URL = import.meta.env.VITE_IMG_BASE_URL;

// 삭제 모달
const showDeleteModal = ref(false);
const deleteTargetId = ref(null);

// 재고 모달 (새로운 컴포넌트 사용)
const showStockModal = ref(false);
const stockRewardId = ref(null);
const stockRewardName = ref("");

// 삭제 열기
const openDeleteModal = (id) => {
  deleteTargetId.value = id;
  showDeleteModal.value = true;
};

// 삭제 실행
const confirmDelete = async () => {
  try {
    await rewardAdminApi.delete(deleteTargetId.value);
    await loadRewards();
  } catch (e) {
    alert("삭제 실패!");
  }
};

// 재고 모달 열기
const openStockModal = (id, name) => {
  stockRewardId.value = id;
  stockRewardName.value = name;
  showStockModal.value = true;
};

// 수정 페이지 이동
const goEdit = (id) => router.push(`/admin/rewards/${id}/edit`);

// 등록 페이지 이동
const goCreate = () => router.push(`/admin/rewards/create`);

onMounted(loadRewards);
</script>

<template>
  <section class="reward-admin-page">

    <div class="header-row">
      <h1>🎁 경품 관리</h1>
      <CommonButton type="register" width="140px" height="44px" @click="goCreate" />
    </div>

    <div v-if="loading">로딩중...</div>

    <div v-else class="table-wrapper">
      <table class="reward-table">
        <thead>
        <tr>
          <th>이미지</th>
          <th>이름</th>
          <th>포인트</th>
          <th>재고</th>
          <th>카테고리</th>
          <th>관리</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="r in rewards" :key="r.id">
          <td>
            <img
                class="thumb"
                :src="r.imgName ? BASE_IMG_URL + r.imgName : '/noimg.png'"
            />
          </td>

          <td>{{ r.name }}</td>
          <td>{{ r.pointCost }}P</td>
          <td>{{ r.stock }}</td>
          <td>{{ r.categoryName }}</td>

          <td>
            <div class="actions">
              <CommonButton type="detail" @click="openStockModal(r.id, r.name)" />
              <CommonButton type="update" @click="goEdit(r.id)" />
              <CommonButton type="delete" @click="openDeleteModal(r.id)" />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 중앙 정렬 -->
    <div class="pagination-wrapper">
      <Pagination
          :page="currentPage"
          :total-pages="totalPages"
          @change-page="(p) => { currentPage = p; loadRewards() }"
      />
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

    <!-- 재고 관리 모달 -->
    <StockModal
        v-model="showStockModal"
        :reward-id="stockRewardId"
        :reward-name="stockRewardName"
        @stock-updated="loadRewards"
    />
  </section>
</template>

<style scoped lang="scss">
.reward-admin-page {
  padding: 24px;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.header-row {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-wrapper {
  flex: 1;
  overflow-y: auto;
  margin-top: 20px;
  padding-right: 6px;
}

.reward-table {
  width: 100%;
  border-collapse: collapse;

  th {
    background: #f7f7f7;
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #eee;
    text-align: center;
  }
}

.thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
