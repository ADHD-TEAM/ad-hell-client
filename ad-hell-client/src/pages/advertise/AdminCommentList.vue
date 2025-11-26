<!-- src/components/comment/AdminCommentList.vue -->
<script setup lang="ts">
import CommonButton from '@/components/common/CommonButton.vue'

type CommentRow = {
  id: number
  writer: string
  content: string
}

const props = defineProps<{
  comments: CommentRow[]
}>()

const emit = defineEmits<{
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
}>()

const handleEdit = (id: number) => {
  emit('edit', id)
}

const handleDelete = (id: number) => {
  emit('delete', id)
}
</script>

<template>
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
              @click.stop="handleEdit(comment.id)"
          />
          <CommonButton
              type="delete"
              :width="54"
              :height="30"
              @click.stop="handleDelete(comment.id)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
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

.comment-btn {
  border: none;
  background: transparent;
  font-size: 12px;
  color: #888;
  cursor: pointer;
}

.comment-btn:hover {
  text-decoration: underline;
}
</style>
