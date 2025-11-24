<!-- src/pages/board/user/BoardDetail.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'

const route = useRoute()
const router = useRouter()

const boardId = Number(route.params.id)

const loading = ref(false)
const board = ref({
  id: boardId,
  title: '',
  writerName: '',
  createdAt: '',
  viewCount: 0,
  content: '',
})

const comments = ref([])
const newComment = ref('')

const loadDetail = async () => {
  loading.value = true
  try {
    board.value = {
      id: boardId,
      title: '플랫폼 안내',
      writerName: '운영자',
      createdAt: '2025-11-14',
      viewCount: 2580,
      content: '게시글 내용입니다.',
    }

    comments.value = [
      { id: 1, writerName: 'adhell', content: '답글내용 1입니다.' },
      { id: 2, writerName: 'user01', content: '답글내용 2입니다.' },
    ]
  } finally {
    loading.value = false
  }
}

const goList = () => {
  router.push('/boards')
}

const onClickUpdate = () => {
  router.push(`/boards/${boardId}/edit`)
}

const onClickDelete = () => {
  console.log('게시글 삭제', boardId)
}

const addComment = () => {
  if (!newComment.value.trim()) return
  comments.value.push({
    id: Date.now(),
    writerName: '현재사용자',
    content: newComment.value,
  })
  newComment.value = ''
}

const editComment = (c) => {
  console.log('댓글 수정', c.id)
}

const deleteComment = (c) => {
  comments.value = comments.value.filter((v) => v.id !== c.id)
}

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <section class="board-detail-page" v-loading="loading">

    <!-- ★ 제목만 -->
    <h2 class="detail-title">{{ board.title }}</h2>

    <!-- ★ 작성자 / 작성일 / 조회수 + 구분선 -->
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

    <!-- ★ 구분선 -->
    <div class="divider"></div>

    <!-- 내용 박스 -->
    <div class="detail-content-box">
      <p class="detail-content-text">
        {{ board.content }}
      </p>
    </div>

    <!-- ★ 수정/삭제 버튼 -->
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
          <CommonButton type="delete" @click="deleteComment(c)" />
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
</style>
