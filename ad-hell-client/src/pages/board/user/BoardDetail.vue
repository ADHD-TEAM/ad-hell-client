<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchBoardDetail } from '@/api/boardApi.js'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const board = ref(null)

const loadDetail = async () => {
  const id = route.params.id
  if (!id) return

  loading.value = true
  try {
    const result = await fetchBoardDetail(id)
    board.value = result
  } catch (e) {
    console.error(e)
    ElMessage.error('게시글 조회에 실패했습니다.')
  } finally {
    loading.value = false
  }
}

onMounted(loadDetail)
watch(() => route.params.id, loadDetail)
</script>

<template>
  <div>
    <el-button type="text" @click="router.back()">← 목록으로</el-button>

    <el-card v-loading="loading" style="margin-top: 8px;">
      <template #header>
        <div class="detail-header">
          <h2>{{ board?.title }}</h2>
          <div class="sub-info">
            조회수 {{ board?.viewCount }}
          </div>
        </div>
      </template>

      <div class="writer-info">
        <span>작성자: {{ board?.writerName }}</span>
        <span>작성일: {{ board?.createdAt }}</span>
      </div>

      <el-divider />

      <div class="content">
        {{ board?.content }}
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sub-info {
  font-size: 13px;
  color: #666;
}
.writer-info {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  gap: 12px;
}
.content {
  min-height: 150px;
  white-space: pre-wrap;
}
</style>
