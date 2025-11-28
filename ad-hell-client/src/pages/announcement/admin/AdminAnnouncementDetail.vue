<!-- src/pages/announcement/admin/AdminAnnouncementDetail.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import { useAnnouncementStore } from '@/stores/announcementStore.js'

const route = useRoute()
const router = useRouter()
const announcementId = Number(route.params.id)

const announcementStore = useAnnouncementStore()
const { announcementDetail, loading, loadAnnouncementDetail, deleteAnnouncementAction } =
    announcementStore

const goList = () => {
  router.push('/admin/announcements')
}

const onClickUpdate = () => {
  router.push(`/admin/announcements/${announcementId}/edit`)
}

const onClickDelete = async () => {
  if (!confirm('공지사항을 삭제하시겠습니까?')) return
  try {
    await deleteAnnouncementAction(announcementId)
    alert('공지사항이 삭제되었습니다.')
    goList()
  } catch (e) {
    console.error(e)
    alert('공지사항 삭제 중 오류가 발생했습니다.')
  }
}

onMounted(() => {
  loadAnnouncementDetail(announcementId)
})
</script>

<template>
  <section class="announcement-detail-page" v-loading="loading">
    <h2 class="page-title">공지사항</h2>

    <h3 class="detail-title">{{ announcementDetail?.title }}</h3>

    <div class="detail-meta">
      <div class="meta-item">
        <span class="meta-label">작성자:</span>
        <span class="meta-value">{{ announcementDetail?.writerName }}</span>
      </div>

      <div class="meta-item meta-right">
        <span class="meta-label">작성일:</span>
        <span class="meta-value">{{ announcementDetail?.createdAt }}</span>
      </div>
    </div>

    <div class="divider"></div>

    <section class="content-section">
      <h4 class="content-label">공지사항 내용</h4>
      <div class="content-box">
        <p class="content-text">
          {{ announcementDetail?.content }}
        </p>
      </div>
    </section>

    <div class="detail-actions">
      <CommonButton type="update" @click="onClickUpdate" />
      <CommonButton type="delete" @click="onClickDelete" />
      <CommonButton type="cancel" @click="goList" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.announcement-detail-page {
  padding: 24px 32px 40px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

.detail-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 8px;
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

.divider {
  width: 100%;
  height: 1px;
  background: #ededed;
  margin: 8px 0 16px;
}

.content-section {
  margin-top: 8px;
}

.content-label {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
}

.content-box {
  padding: 16px 20px;
  border: 1px solid #efefef;
  background: #ffffff;
  border-radius: 10px;
  min-height: 260px;
}

.content-text {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.detail-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
