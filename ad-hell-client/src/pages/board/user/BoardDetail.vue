<!-- src/pages/board/user/BoardDetail.vue -->
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import { deleteBoard } from '@/api/boardApi.js'
// 게시글 + 댓글 조회/처리 공통 로직
import { useBoardDetail } from '@/composables/board/useBoardDetail.js'

const route = useRoute()
const router = useRouter()

// URL 파라미터에서 게시글 ID
const boardId = Number(route.params.id)

// 컴포저블에서 상태/함수 가져오기
const {
  board,
  comments,
  newComment,
  loading,
  addComment,
  editComment,
  removeComment,
} = useBoardDetail(boardId)

// 이미지 모달 상태
const imageModalVisible = ref(false)
const selectedImageUrl = ref('')

// 목록으로 이동
const goList = () => {
  router.push('/boards')
}

// 게시글 수정 이동
const onClickUpdate = () => {
  router.push(`/boards/${boardId}/edit`)
}

// 게시글 삭제
const onClickDelete = async () => {
  if (!confirm('게시글을 삭제하시겠습니까?')) return

  try {
    await deleteBoard(boardId)
    alert('게시글이 삭제되었습니다.')
    goList()
  } catch (e) {
    console.error(e)
    alert('게시글 삭제 중 오류가 발생했습니다.')
  }
}

// 이미지 썸네일 클릭 → 모달 열기
const openImageModal = (url) => {
  if (!url) return
  selectedImageUrl.value = url
  imageModalVisible.value = true
}

// 모달 닫기
const closeImageModal = () => {
  imageModalVisible.value = false
  selectedImageUrl.value = ''
}
</script>

<template>
  <section class="board-detail-page" v-loading="loading">
    <!-- 제목 -->
    <h2 class="detail-title">{{ board.title }}</h2>

    <!-- 작성자 / 작성일 / 조회수 -->
    <div class="detail-meta">
      <div class="meta-item">
        <span class="meta-label">작성자:</span>
        <span class="meta-value">{{ board.writerName }}</span>
      </div>

      <div class="meta-item">
        <span class="meta-label">작성일:</span>
        <span class="meta-value">{{ board.createdAt }}</span>
      </div>

      <div class="meta-item">
        <span class="meta-label">조회수:</span>
        <span class="meta-value">{{ board.viewCount.toLocaleString() }}</span>
      </div>
    </div>

    <!-- 구분선 -->
    <div class="divider"></div>

    <!-- 내용 박스 -->
    <div class="detail-content-box">
      <p class="detail-content-text">
        {{ board.content }}
      </p>
    </div>

    <!-- 이미지 썸네일 영역 -->
    <div class="detail-images" v-if="board.files && board.files.length">
      <div
          v-for="img in board.files"
          :key="img.storedName || img.id || img.url"
          class="image-item"
          @click="openImageModal(img.url)"
      >
        <img :src="img.url" class="detail-image" />
      </div>
    </div>

    <!-- 수정/삭제 버튼 -->
    <div class="detail-actions">
      <CommonButton type="update" @click="onClickUpdate" />
      <CommonButton type="delete" @click="onClickDelete" />
    </div>

    <!-- 댓글 영역 -->
    <section class="comment-section">
      <h4 class="comment-title">댓글</h4>

      <!-- 댓글 목록 -->
      <div class="comment-row" v-for="c in comments" :key="c.id">
        <div class="comment-left">
          <div class="comment-writer">{{ c.writerName }}</div>
          <div class="comment-text">{{ c.content }}</div>
        </div>

        <div class="comment-actions">
          <CommonButton type="update" @click="editComment(c)" />
          <CommonButton type="delete" @click="removeComment(c)" />
        </div>
      </div>

      <!-- 댓글 입력 -->
      <div class="comment-input-wrap">
        <el-input
            v-model="newComment"
            type="textarea"
            :rows="3"
            placeholder="댓글을 입력하세요."
            class="comment-input"
        />
        <div class="comment-submit">
          <CommonButton type="register" @click="addComment" />
        </div>
      </div>
    </section>

    <!-- 이미지 모달 -->
    <el-dialog
        v-model="imageModalVisible"
        width="60%"
        :show-close="true"
        class="image-modal"
        center
        @close="closeImageModal"
    >
      <div class="image-modal-body">
        <img
            v-if="selectedImageUrl"
            :src="selectedImageUrl"
            class="image-modal-img"
        />
      </div>
    </el-dialog>
  </section>
</template>

<style scoped lang="scss">
.board-detail-page {
  padding: 24px 32px 40px;
}

/* 제목 */
.detail-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

/* 작성자 / 작성일 / 조회수 */
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
  min-height: 260px;
}

.detail-content-text {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 이미지 썸네일 리스트 */
.detail-images {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.image-item {
  width: 180px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
  border: 1px solid #eee;
  cursor: pointer;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 수정/삭제 버튼 */
.detail-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 댓글 영역 */
.comment-section {
  margin-top: 30px;
}

.comment-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}

/* 댓글 목록 */
.comment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 6px;
  border-bottom: 1px solid #f2f2f2;
  font-size: 13px;
}

.comment-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.comment-writer {
  font-weight: 700;
}

.comment-text {
  color: #666;
}

.comment-actions {
  display: flex;
  gap: 6px;
}

/* 댓글 입력 */
.comment-input-wrap {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.comment-input {
  :deep(textarea) {
    resize: none;
  }
}

.comment-submit {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

/* 이미지 모달 스타일 */
.image-modal-body {
  width: 100%;
  display: flex;
  justify-content: center;
}

.image-modal-img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 10px;
}

:deep(.el-dialog__body) {
  padding: 16px 20px 20px;
}
</style>
