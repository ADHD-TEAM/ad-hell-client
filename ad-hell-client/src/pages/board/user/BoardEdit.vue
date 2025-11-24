<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import { useBoardStore } from '@/stores/boardStore'

// 라우터
const router = useRouter()
const route = useRoute()
const boardId = route.params.id

// store
const boardStore = useBoardStore()

// 수정 폼
const form = reactive({
  title: '',
  content: '',
  files: [],
})

// 파일 선택용 ref
const fileInputRef = ref(null)

// 파일 선택 창 열기
const onClickUpload = () => {
  fileInputRef.value?.click()
}

// 파일 선택 시 목록 저장
const onFileChange = (event) => {
  const files = Array.from(event.target.files || [])
  form.files = files
}

// 수정 요청
const onSubmit = async () => {
  console.log('수정 요청 데이터', {
    id: boardId,
    title: form.title,
    content: form.content,
    files: form.files,
  })

  // API 연동 시 사용
  // const formData = new FormData()
  // formData.append('title', form.title)
  // formData.append('content', form.content)
  // form.files.forEach(f => formData.append('files', f))
  // await boardStore.updateBoardAction(boardId, formData)

  // router.push(`/boards/${boardId}`)
}

// 취소 → 이전 페이지
const onCancel = () => {
  router.back()
}

// 기존 게시글 상세 데이터 로드
onMounted(async () => {
  // const data = await boardStore.loadBoardDetail(boardId)
  // form.title = data.title
  // form.content = data.content

  // 임시 값
  form.title = '기존 제목 예시입니다.'
  form.content = '기존 내용 예시입니다.\nAPI 연동 시 서버 데이터로 교체하세요.'
})
</script>

<template>
  <section class="board-edit-page">
    <h2 class="page-title">게시판</h2>

    <div class="form-wrapper">
      <el-form :model="form" label-position="top" class="board-form">

        <el-form-item label="제목">
          <el-input
              v-model="form.title"
              placeholder="제목을 입력하세요."
              clearable
          />
        </el-form-item>

        <el-form-item label="내용">
          <el-input
              v-model="form.content"
              type="textarea"
              placeholder="내용을 입력하세요."
              :rows="14"
              class="content-textarea"
          />
        </el-form-item>

        <el-form-item>
          <div class="upload-box" @click="onClickUpload">
            <div class="upload-inner">
              <div class="upload-icon">⬆</div>
              <div class="upload-text">이미지 / 파일 업로드 해보세요</div>

              <div v-if="form.files.length" class="upload-files">
                <span
                    v-for="file in form.files"
                    :key="file.name"
                    class="file-chip"
                >
                  {{ file.name }}
                </span>
              </div>
            </div>

            <input
                ref="fileInputRef"
                type="file"
                class="file-input-hidden"
                multiple
                @change="onFileChange"
            />
          </div>
        </el-form-item>

      </el-form>

      <div class="form-footer">
        <CommonButton type="update" @click="onSubmit" />
        <CommonButton type="cancel" @click="onCancel" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.board-edit-page {
  padding: 24px 40px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.form-wrapper {
  width: 100%;
}

.board-form {
  width: 100%;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

:deep(.el-input__wrapper) {
  height: 40px;
  box-sizing: border-box;
}

.content-textarea {
  :deep(textarea) {
    min-height: 260px;
    resize: none;
  }
}

.upload-box {
  width: 100%;
  min-height: 140px;
  border: 1px solid #ececec;
  border-radius: 10px;
  background: #fafafa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-inner {
  text-align: center;
  color: #b3b3b3;
}

.upload-icon {
  font-size: 20px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 12px;
}

.upload-files {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.file-chip {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #ffd5d5;
  font-size: 12px;
  color: #555;
  background: #fff;
}

.file-input-hidden {
  display: none;
}

.form-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
