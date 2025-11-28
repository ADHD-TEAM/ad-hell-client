<!-- src/pages/announcement/admin/AdminAnnouncementCreate.vue -->
<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import { useAnnouncementStore } from '@/stores/announcementStore.js'

const router = useRouter()
const announcementStore = useAnnouncementStore()

const form = reactive({
  title: '',
  content: '',
  files: [],
})

const fileInputRef = ref(null)

const onClickUpload = () => {
  fileInputRef.value?.click()
}

const onFileChange = (event) => {
  const files = Array.from(event.target.files || [])
  form.files = files
}

const onSubmit = async () => {
  if (!form.title.trim()) {
    alert('제목을 입력하세요.')
    return
  }
  if (!form.content.trim()) {
    alert('내용을 입력하세요.')
    return
  }

  try {
    await announcementStore.createAnnouncementAction({
      title: form.title,
      content: form.content,
      status: 'Y',
    })

    // 파일 업로드가 필요하면 여기서 FormData 기반으로 추가 구현
    alert('공지사항이 등록되었습니다.')
    router.push('/admin/announcements')
  } catch (e) {
    console.error(e)
    alert('공지사항 등록 중 오류가 발생했습니다.')
  }
}

// 취소
const onCancel = () => {
  router.push('/admin/announcements')
}
</script>

<template>
  <section class="announcement-create-page">
    <h2 class="page-title">공지사항</h2>

    <div class="form-wrapper">
      <el-form
          :model="form"
          label-position="top"
          class="announcement-form"
      >
        <el-form-item>
          <el-input
              v-model="form.title"
              placeholder="제목을 입력하세요."
              clearable
          />
        </el-form-item>

        <el-form-item>
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

      <!-- 버튼 -->
      <div class="form-footer">
        <CommonButton type="register" @click="onSubmit" />
        <CommonButton type="cancel" @click="onCancel" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.announcement-create-page {
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

.announcement-form {
  width: 100%;
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
