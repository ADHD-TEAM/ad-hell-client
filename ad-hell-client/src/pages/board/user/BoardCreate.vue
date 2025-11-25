  <script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'

const router = useRouter()

// 게시글 작성 폼 데이터
const form = reactive({
  title: '',
  content: '',
  files: [], // 업로드한 파일 목록 (UI용)
})

// 파일 input ref
const fileInputRef = ref(null)

// 파일 선택 클릭
const onClickUpload = () => {
  fileInputRef.value?.click()
}

// 파일 선택 시
const onFileChange = (event) => {
  const files = Array.from(event.target.files || [])
  form.files = files
}

// 등록 버튼 (나중에 API 연동 시 여기서 FormData 만들어 전송)
const onSubmit = () => {
  console.log('등록 요청 데이터', {
    title: form.title,
    content: form.content,
    files: form.files,
  })
  // TODO: boardCreate API 호출 후 /boards 로 이동
  // router.push('/boards')
}

// 취소 버튼
const onCancel = () => {
  router.push('/boards')
}
</script>

<template>
  <section class="board-create-page">
    <h2 class="page-title">게시판</h2>

    <div class="form-wrapper">
      <el-form
          :model="form"
          label-position="top"
          class="board-form"
      >
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

        <!-- 이미지 / 파일 업로드 박스 -->
        <el-form-item>
          <div class="upload-box" @click="onClickUpload">
            <div class="upload-inner">
              <div class="upload-icon">⬆</div>
              <div class="upload-text">이미지 / 파일 업로드 하세요</div>

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

            <!-- 실제 파일 입력 (숨김) -->
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

      <!-- 하단 버튼 (오른쪽 정렬) -->
      <div class="form-footer">
        <CommonButton type="register" @click="onSubmit" />
        <CommonButton type="cancel" @click="onCancel" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.board-create-page {
  padding: 24px 40px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

/* 가운데 폼 영역 */
.form-wrapper {
  width: 100%;
}

/* Element Plus form 전체 폭 */
.board-form {
  width: 100%;
}

/* 제목/내용 label 스타일 */
:deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

/* input / textarea 높이 조정 */
:deep(.el-input__wrapper) {
  height: 40px;
  box-sizing: border-box;
}

/* textarea는 큰 박스로 */
.content-textarea {
  :deep(textarea) {
    min-height: 260px;
    resize: none;
  }
}

/* 업로드 박스 */
.upload-box {
  width: 100%;
  min-height: 140px;
  border: 1px dashed #e0e0e0;
  border-radius: 10px;
  background: #fafafa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-inner {
  text-align: center;
  color: #999;
}

.upload-icon {
  font-size: 20px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 13px;
}

/* 선택된 파일 목록 */
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

/* 실제 input은 숨김 */
.file-input-hidden {
  display: none;
}

/* 하단 버튼 오른쪽 정렬 */
.form-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
