<!-- src/components/advertise/AdListTable.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 한 행 타입 (원하면 interface로 빼도 됨)
type AdRow = {
  id: number
  title: string
  categoryName: string
  rank: number
  status: 'ACTIVE' | 'INACTIVE'
}

// ✅ 부모에서 안 받음. 이 컴포넌트 안에서 상태 관리
const ads = ref<AdRow[]>([])

// 더미 데이터 (나중에 API로 교체)
const mockData: AdRow[] = [
  { id: 1, title: 'ADHD',     categoryName: '음식', rank: 1, status: 'ACTIVE' },
  { id: 2, title: "Mcdonald", categoryName: '음식', rank: 2, status: 'ACTIVE' },
]

// 목록 로딩 (여기에 API 연동하면 됨)
const loadAds = async () => {
  // TODO: 실제 API 연동
  // const res = await axios.get('/api/admin/ads', { params: {...} })
  // ads.value = res.data
  ads.value = mockData
}

// 행 클릭 시 상세 페이지 이동 (원하면 경로 바꿔서 사용)
const handleRowClick = (id: number) => {
  router.push(`/admin/ads/${id}`)
}

onMounted(() => {
  loadAds()
})
</script>

<template>
  <div class="ad-table-wrapper">
    <table class="ad-table">
      <thead>
      <tr>
        <th class="col-no">NO</th>
        <th class="col-title">제목</th>
        <th class="col-category">카테고리</th>
        <th class="col-rank">랭킹</th>
        <th class="col-status">상태</th>
      </tr>
      </thead>

      <tbody>
      <tr
          v-for="(ad, idx) in ads"
          :key="ad.id"
          class="ad-row"
          @click="handleRowClick(ad.id)"
      >
        <!-- NO (1부터) -->
        <td class="col-no">{{ idx + 1 }}</td>

        <!-- 제목 -->
        <td class="col-title text-left">
          {{ ad.title }}
        </td>

        <!-- 카테고리 -->
        <td class="col-category">
          {{ ad.categoryName }}
        </td>

        <!-- 랭킹 -->
        <td class="col-rank">
          {{ ad.rank }}
        </td>

        <!-- 상태 배지 -->
        <td class="col-status">
          <span
              class="status-badge"
              :class="ad.status === 'ACTIVE' ? 'status-active' : 'status-inactive'"
          >
            {{ ad.status === 'ACTIVE' ? '활성' : '비활성' }}
          </span>
        </td>
      </tr>

      <!-- 데이터 없을 때 -->
      <tr v-if="ads.length === 0">
        <td colspan="5" class="empty-row">
          등록된 광고가 없습니다.
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.ad-table-wrapper {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box
}

/* 기본 테이블 스타일 */
.ad-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
  box-sizing: border-box
}

/* 헤더 */
.ad-table thead {
  background-color: #f8f8f8;
}

.ad-table th {
  padding: 10px 12px;
  text-align: center;
  font-weight: 600;
  color: #555;
  border-bottom: 1px solid #e5e5e5;
}

/* 바디 */
.ad-table td {
  padding: 10px 12px;
  text-align: center;
  color: #444;
  border-bottom: 1px solid #f0f0f0;
}

/* 각 컬럼 폭 */
.col-no {
  width: 60px;
}
.col-title {
  width: 40%;
}
.col-category {
  width: 15%;
}
.col-rank {
  width: 10%;
}
.col-status {
  width: 15%;
}

/* 제목은 왼쪽 정렬 */
.text-left {
  text-align: left;
}

/* 행 hover 효과 */
.ad-row {
  cursor: pointer;
}
.ad-row:hover {
  background-color: #fafafa;
}

/* 상태 배지 */
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

/* 활성 */
.status-active {
  background-color: #e6f3ff;
  color: #1677ff;
}

/* 비활성 */
.status-inactive {
  background-color: #f3f3f3;
  color: #999;
}

/* 데이터 없을 때 */
.empty-row {
  padding: 20px 0;
  text-align: center;
  color: #999;
}
</style>
