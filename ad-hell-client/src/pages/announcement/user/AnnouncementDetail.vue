<!-- src/pages/announcement/user/AnnouncementDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'

const route = useRoute()
const router = useRouter()

// URL 파라미터에서 공지 ID 추출
const announcementId = Number(route.params.id)

// 화면 상태
const loading = ref(false)
const announcement = ref({
  id: announcementId,
  title: '',
  writerName: '',
  createdAt: '',
  content: '',
})

// 상세 조회 (나중에 API 연동)
const loadDetail = async () => {
  loading.value = true
  try {
    // TODO: /api/announcements/{id} 로 교체
    announcement.value = {
      id: announcementId,
      title: '서비스 점검 안내',
      writerName: '운영자',
      createdAt: '2025-11-14',
      content: '공지사항 내용',
    }
  } finally {
    loading.value = false
  }
}

// 목록으로 이동
const goList = () => {
  router.push('/announcements')
}

onMounted(loadDetail)
</script>

<template>
  <section class="announcement-detail-page" v-loading="loading">
    <!-- 제목 -->
    <h2 class="detail-title">{{ announcement.title }}</h2>

    <!-- 작성자 / 작성일 -->
    <div class="detail-meta">
      <div class="meta-item">
        <span class="meta-label">작성자:</span>
        <span class="meta-value">{{ announcement.writerName }}</span>
      </div>

      <div class="meta-item">
        <span class="meta-label">작성일:</span>
        <span class="meta-value">{{ announcement.createdAt }}</span>
      </div>
    </div>

    <!-- 구분선 -->
    <div class="divider"></div>

    <!-- 내용 박스 -->
    <div class="detail-content-box">
      <p class="detail-content-text">
        {{ announcement.content }}
      </p>
    </div>

    <!-- 하단 버튼 -->
    <div class="detail-actions">
      <!-- CommonButton 의 cancel 라벨이 "취소"면 나중에 "이전" 타입 하나 더 만들어도 됨 -->
      <CommonButton type="cancel" @click="goList" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.announcement-detail-page {
  padding: 24px 32px 40px;
}

/* 제목 */
.detail-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

/* 작성자 / 작성일 */
.detail-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  margin-bottom: 10px;
}

.meta-item {
  display: flex;
  gap: 4px;
}

.meta-label {
  font-weight: 600;
}

.meta-value {
  color: #ff0000;
}

/* 구분선 */
.divider {
  width: 100%;
  height: 1px;
  background: #ededed;
  margin: 8px 0 16px;
}

/* 본문 박스 */
.detail-content-box {
  padding: 16px 20px;
  border: 1px solid #efefef;
  background: #ffffff;
  border-radius: 10px;
  min-height: 550px;
}

.detail-content-text {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 하단 버튼 */
.detail-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
