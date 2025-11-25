<!-- src/pages/advertise/admin/AdDetail.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 더미 광고 데이터 (나중에 API로 교체)
const adTitle = ref('광고 이름: ~~~~~')
const createdAt = ref('2025-11-14')
const viewCount = ref(2580)

// 댓글 더미 데이터
type CommentRow = {
  id: number
  writer: string
  content: string
}

const comments = ref<CommentRow[]>([
  { id: 1, writer: 'adhell', content: '댓글내용 1입니다.' },
  { id: 2, writer: 'user01', content: '댓글내용 2입니다.' },
])

// 버튼 핸들러 (나중에 실제 로직 연결)
const handleEditAd = () => {
  console.log('광고 수정')
}

const handleHideAd = () => {
  console.log('광고 비공개 처리')
}

const handleCancel = () => {
  router.back()
}

const handleEditComment = (id: number) => {
  console.log('댓글 수정:', id)
}

const handleDeleteComment = (id: number) => {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    comments.value = comments.value.filter((c) => c.id !== id)
  }
}
</script>

<template>
  <section class="ad-detail-page">
    <!-- 상단 제목 + 메타 정보 -->
    <header class="ad-header">
      <div class="ad-title-row">
        <span class="ad-title-label">광고 이름:</span>
        <span class="ad-title-text">~~~~~</span>
      </div>

      <div class="ad-meta-row">
        <span class="meta-item">
          작성일:
          <span class="meta-strong">{{ createdAt }}</span>
        </span>
        <span class="meta-divider">｜</span>
        <span class="meta-item">
          조회수:
          <span class="meta-strong">{{ viewCount.toLocaleString() }}</span>
        </span>
      </div>
    </header>

    <hr class="divider" />

    <!-- 동영상(미디어) 영역 -->
    <div class="media-box">
      <!-- 실제로는 <video>나 <iframe> 유튜브 embed가 들어갈 자리 -->
      <div class="media-placeholder">
        <div class="play-icon">▶</div>
      </div>
    </div>

    <!-- 댓글 영역 -->
    <section class="comment-section">
      <h3 class="comment-title">댓글</h3>

      <div class="comment-list">
        <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment-row"
        >
          <div class="comment-writer">
            {{ comment.writer }}
          </div>
          <div class="comment-content">
            {{ comment.content }}
          </div>

          <!-- 행 위에 마우스 올렸을 때만 보이는 버튼 -->
          <div class="comment-actions">
            <CommonButton
                type="update"
                :width="54"
                :height="30"
                @click.stop="handleEditComment(comment.id)"
            />
            <CommonButton
                type="delete"
                :width="54"
                :height="30"
                @click.stop="handleDeleteComment(comment.id)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 하단 광고 관리 버튼 -->
    <div class="bottom-buttons">
      <CommonButton
          type="update"
          :width="80"
          @click="handleEditAd"
      />
      <CommonButton
          type="reset"
          :width="80"
          @click="handleHideAd"
      >
      </CommonButton>
      <CommonButton
          type="cancel"
          :width="80"
          @click="handleCancel"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.ad-detail-page {
  padding: 24px 40px;
  box-sizing: border-box;
}

/* ---------------- 상단 제목/메타 ---------------- */

.ad-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ad-title-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ad-title-label {
  font-size: 14px;
  font-weight: 700;
}

.ad-title-text {
  font-size: 14px;
  font-weight: 700;
}

.ad-meta-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  font-size: 12px;
  color: #777;
}

.meta-item {
  white-space: nowrap;
}

.meta-strong {
  color: #ff0000;
  font-weight: 600;
  margin-left: 4px;
}

.meta-divider {
  color: #ddd;
}

.divider {
  margin: 12px 0 24px 0;
  border: none;
  border-top: 1px solid #f0f0f0;
}

/* ---------------- 미디어 박스 ---------------- */

.media-box {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.media-placeholder {
  width: 640px;
  max-width: 100%;
  height: 360px;
  background: #ffe3e3;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ff0000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

/* ---------------- 댓글 리스트 ---------------- */

.comment-section {
  margin-top: 8px;
}

.comment-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
}

.comment-list {
  border-top: 1px solid #f0f0f0;
}

.comment-row {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  align-items: center;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid #f7f7f7;
  position: relative;
}

.comment-writer {
  font-weight: 700;
  padding-left: 8px;
}

.comment-content {
  color: #555;
}

.comment-actions {
  display: flex;
  gap: 4px;
  padding-right: 8px;

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}

/* 행에 마우스 올렸을 때만 버튼 보이기 */
.comment-row:hover .comment-actions {
  opacity: 1;
  pointer-events: auto;
}

/* ---------------- 하단 버튼 ---------------- */

.bottom-buttons {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
