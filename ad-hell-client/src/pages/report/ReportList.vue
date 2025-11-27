<script setup>
import { ref, onMounted } from "vue";
import CommonButton from "@/components/common/CommonButton.vue";
import Pagination from "@/components/common/Pagination.vue";
import CommonModal from "@/components/common/CommonModal.vue";
import { reportAdminApi } from "@/api/reportAdminApi";

// 데이터
const reports = ref([]);
const loading = ref(false);
const error = ref(null);

// 페이지네이션
const currentPage = ref(1);
const totalPages = ref(1);
const size = ref(20);

// 상태 필터
const statusFilter = ref(null); // null | "REQUEST" | "COMPLETE"

// 상태 변경 모달
const showStatusModal = ref(false);
const targetReportId = ref(null);

const openStatusModal = (id) => {
  targetReportId.value = id;
  showStatusModal.value = true;
};

const confirmStatusChange = async () => {
  try {
    await reportAdminApi.updateStatus(targetReportId.value, "COMPLETE");
    await loadReports();
  } catch (e) {
    alert("상태 변경 실패!");
  }
};

const loadReports = async () => {
  loading.value = true;

  try {
    const params = {
      page: currentPage.value,
      size: size.value,
      status: statusFilter.value || undefined,
    };

    const res = await reportAdminApi.list(params);
    const data = res.data.data;

    reports.value = data.reports;
    totalPages.value = data.pagination.totalPages;
    currentPage.value = data.pagination.currentPage;
  } catch (e) {
    error.value = e;
  } finally {
    loading.value = false;
  }
};

onMounted(loadReports);

// 대상내용 합치기
const formatTargetContent = (r) => {
  if (r.adTitle && r.commentContent) {
    return `[${r.adTitle}] ${r.commentContent}`;
  }
  if (r.commentContent) return r.commentContent;
  if (r.adTitle) return `[${r.adTitle}]`;
  return "내용 없음";
};

const changeStatusFilter = (value) => {
  statusFilter.value = value;
  currentPage.value = 1;
  loadReports();
};
</script>

<template>
  <section class="report-admin-page">

    <div class="header-row">
      <h1>🚨 신고 관리</h1>
    </div>

    <!-- 필터 버튼 -->
    <div class="filter-row">
      <button
          :class="['filter-btn', { active: statusFilter === null }]"
          @click="changeStatusFilter(null)"
      >
        전체
      </button>

      <button
          :class="['filter-btn', { active: statusFilter === 'REQUEST' }]"
          @click="changeStatusFilter('REQUEST')"
      >
        요청
      </button>

      <button
          :class="['filter-btn', { active: statusFilter === 'COMPLETE' }]"
          @click="changeStatusFilter('COMPLETE')"
      >
        완료
      </button>
    </div>

    <div v-if="loading">로딩중...</div>

    <div v-else class="table-wrapper">
      <table class="report-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>카테고리</th>
          <th>신고자</th>
          <th>대상 내용</th>
          <th>상태</th>
          <th>관리</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="r in reports" :key="r.id">

          <td>{{ r.id }}</td>
          <td>{{ r.categoryName }}</td>
          <td>{{ r.reporterNickname }}</td>
          <td class="content">{{ formatTargetContent(r) }}</td>

          <td>
            <span :class="['status', r.status.toLowerCase()]">
              {{ r.status }}
            </span>
          </td>

          <td>
            <div class="actions">
              <!-- REQUEST 상태에서만 버튼 노출 -->
              <CommonButton
                  v-if="r.status === 'REQUEST'"
                  type="completion"
                  width="90px"
                  height="36px"
                  @click="openStatusModal(r.id)"
              />
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
          @change-page="(p) => { currentPage = p; loadReports() }"
      />
    </div>

    <!-- 상태 변경 모달 -->
    <CommonModal
        v-model="showStatusModal"
        mode="confirm"
        message="이 신고를 완료 처리 하시겠습니까?"
        confirmText="처리"
        cancelText="취소"
        @confirm="confirmStatusChange"
    />

  </section>
</template>

<style scoped lang="scss">
.report-admin-page {
  padding: 24px;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

/* 필터 버튼 */
.filter-row {
  display: flex;
  gap: 10px;
  margin: 10px 0 20px 0;
}

.filter-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f8f8f8;
  cursor: pointer;
}

.filter-btn.active {
  background: #ff0000;
  color: white;
  border-color: #ff0000;
}

.table-wrapper {
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
  padding-right: 6px;
}

/* 테이블 */
.report-table {
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

  td.content {
    max-width: 300px;
    text-align: left;
  }
}

/* 상태 칼러 */
.status {
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 12px;
}

.status.request {
  background: #ffdede;
  color: #d60000;
}

.status.complete {
  background: #e6f7ff;
  color: #0077c8;
}

/* 페이지네이션 중앙 정렬 */
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
