<!-- src/components/advertise/AdListTable.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 한 행 타입
type AdRow = {
  id: number
  title: string
  categoryName: string
  status: 'ACTIVE' | 'INACTIVE'
}

// 부모에서 목록을 그대로 받는다
const props = defineProps<{
  ads: AdRow[]
}>()

// 행 클릭 시 상세 페이지 이동
const handleRowClick = (id: number) => {
  router.push(`/admin/ads/${id}`)
}
</script>

<template>
  <div class="ad-table-wrapper">
    <table class="ad-table">
      <thead>
      <tr>
        <th class="col-no">NO</th>
        <th class="col-title">제목</th>
        <th class="col-category">카테고리</th>
        <th class="col-status">상태</th>
      </tr>
      </thead>

      <tbody>
      <tr
          v-for="(ad, idx) in props.ads"
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
      <tr v-if="props.ads.length === 0">
        <td colspan="4" class="empty-row">
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
