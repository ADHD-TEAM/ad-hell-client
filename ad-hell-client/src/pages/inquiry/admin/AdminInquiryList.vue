<template>
  <section class="page">
    <header class="page-header">
      <h2 class="page-title">문의 관리</h2>
    </header>

    <div class="page-body">
      <div class="table-wrapper">
        <table class="common-table">
          <thead>
          <tr>
            <th style="width: 80px">No</th>
            <th>제목</th>
            <th style="width: 120px">작성자</th>
            <th style="width: 120px">상태</th>
            <th style="width: 160px">작성일</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in inquiries"
              :key="item.id"
              @click="goDetail(item.id)"
              class="click-row"
          >
            <td>{{ item.id }}</td>
            <td class="title-cell">
              <span class="title-text">{{ item.title }}</span>
            </td>
            <td>{{ item.writer }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.createdAt }}</td>
          </tr>
          <tr v-if="!inquiries.length">
            <td colspan="5" class="empty-cell">등록된 문의가 없습니다.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

// 일단 더미 데이터 – 나중에 API 연동
const inquiries = ref([
  {
    id: 1,
    title: '포인트 미지급 문의 입니다.',
    writer: '운영자',
    status: '답변대기',
    createdAt: '2025-11-17',
  },
  {
    id: 2,
    title: '광고 재생 오류 문의',
    writer: 'user01',
    status: '답변완료',
    createdAt: '2025-11-18',
  },
])

const goDetail = (id) => {
  router.push(`/admin/inquiries/${id}`)
}
</script>

<style scoped>
.page {
  padding: 24px 32px;
}

.page-header {
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
}

.table-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
}

.common-table {
  width: 100%;
  border-collapse: collapse;
}

.common-table th,
.common-table td {
  padding: 10px 12px;
  font-size: 14px;
  border-bottom: 1px solid #f1f1f1;
}

.common-table thead th {
  background: #f9fafb;
  font-weight: 700;
}

.click-row {
  cursor: pointer;
}

.click-row:hover {
  background: #fff5f5;
}

.title-cell {
  text-align: left;
}

.title-text {
  display: inline-block;
  max-width: 480px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-cell {
  text-align: center;
  color: #9ca3af;
}
</style>
