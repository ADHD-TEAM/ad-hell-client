<!-- src/pages/board/user/BoardEdit.vue -->
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'

// 게시글 상세 조회 / 수정 / 이미지 추가/삭제 API
import {
  fetchBoardDetail,
  updateBoard,
  appendBoardImages,
  deleteBoardImage,
} from '@/api/boardApi.js'

// 라우터
const router = useRouter()
const route = useRoute()
const boardId = Number(route.params.id)

// 수정 폼 (제목/내용 + 새로 추가할 파일)
const form = reactive({
  title: '',
  content: '',
  files: [], // 새로 선택한 파일 목록
})

// 서버에 이미 저장된 이미지 목록
const existingImages = ref([])

// 파일 선택용 ref
const fileInputRef = ref(null)

// 파일 선택 창 열기
const onClickUpload = () => {
  fileInputRef.value?.click()
}

// 파일 선택 시 목록 저장 (새로 추가할 파일만)
const onFileChange = (event) => {
  const files = Array.from(event.target.files || [])
  form.files = files
}

// 기존 이미지 삭제 (storedName 기준)
const onRemoveExisting = async (img) => {
  if (!confirm('이 이미지를 삭제하시겠습니까?')) return
  try {
    await deleteBoardImage(boardId, img.storedName)
    existingImages.value = existingImages.value.filter(
        (f) => f.storedName !== img.storedName,
    )
  } catch (e) {
    console.error(e)
    alert('이미지 삭제 중 오류가 발생했습니다.')
  }
}

// 수정 요청
const onSubmit = async () => {
  try {
    // 1) 게시글 기본 정보 수정 (제목/내용만 변경)
    await updateBoard(boardId, {
      title: form.title,
      content: form.content,
      // categoryId, status는 null로 보내서 그대로 유지 (서비스에서 null이면 변경 안 함)
    })

    // 2) 새로 선택한 파일이 있으면 이미지 추가 API 호출
    if (form.files.length > 0) {
      await appendBoardImages(boardId, form.files)
    }

    alert('게시글이 수정되었습니다.')
    router.push(`/boards/${boardId}`)
  } catch (e) {
    console.error(e)
    alert('게시글 수정 중 오류가 발생했습니다.')
  }
}

// 취소 → 이전 페이지
const onCancel = () => {
  router.back()
}

// 기존 게시글 상세 데이터 로드
onMounted(async () => {
  try {
    const data = await fetchBoardDetail(boardId)
    form.title = data.title
    form.content = data.content
    existingImages.value = data.files || []
  } catch (e) {
    console.error(e)
    alert('게시글 정보를 불러오는 중 오류가 발생했습니다.')
  }
})
</script>

<template>
  <section class="board-edit-page">
    <h2 class="page-title">게시판</h2>

    <div class="form-wrapper">
      <el-form :model="form" label-position="top" class="board-form">
        <!-- 제목 -->
        <el-form-item label="제목">
          <el-input
              v-model="form.title"
              placeholder="제목을 입력하세요."
              clearable
          />
        </el-form-item>

        <!-- 내용 -->
        <el-form-item label="내용">
          <el-input
              v-model="form.content"
              type="textarea"
              placeholder="내용을 입력하세요."
              :rows="14"
              class="content-textarea"
          />
        </el-form-item>

        <!-- 이미지 영역 -->
        <el-form-item>
          <div class="upload-box" @click="onClickUpload">
            <div class="upload-inner">
              <!-- 기존에 저장된 이미지 목록 -->
              <div v-if="existingImages.length" class="upload-files">
                <span
                    v-for="img in existingImages"
                    :key="img.storedName || img.fileId"
                    class="file-chip"
                    @click.stop
                >
                  {{ img.originFileName }}
                  <span
                      style="margin-left: 4px; cursor: pointer;"
                      @click.stop="onRemoveExisting(img)"
                  >
                    삭제
                  </span>
                </span>
              </div>

              <!-- 새로 선택한 파일 목록 -->
              <div v-if="form.files.length" class="upload-files">
                <span
                    v-for="file in form.files"
                    :key="file.name"
                    class="file-chip"
                >
                  {{ file.name }}
                </span>
              </div>

              <div class="upload-icon">⬆</div>
              <div class="upload-text">이미지 / 파일 업로드 해보세요</div>
            </div>

            <!-- 실제 파일 input -->
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
