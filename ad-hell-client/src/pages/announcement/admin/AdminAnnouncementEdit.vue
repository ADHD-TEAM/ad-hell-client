<!-- src/pages/announcement/admin/AdminAnnouncementEdit.vue -->
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import { useAnnouncementStore } from '@/stores/announcementStore.js'

const router = useRouter()
const route = useRoute()
const announcementId = Number(route.params.id)

const announcementStore = useAnnouncementStore()
const { loadAnnouncementDetail, announcementDetail, updateAnnouncementAction } =
    announcementStore

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
    await updateAnnouncementAction(announcementId, {
      title: form.title,
      content: form.content,

      status: announcementDetail.status || 'Y',
    })

    // 파일 저장이 필요하면 여기서 FormData 기반 추가 구현
    alert('공지사항이 수정되었습니다.')
    router.push(`/admin/announcements/${announcementId}`)
  } catch (e) {
    console.error(e)
    alert('공지사항 수정 중 오류가 발생했습니다.')
  }
}

const onCancel = () => {
  router.back()
}

onMounted(async () => {
  await loadAnnouncementDetail(announcementId)
  const data = announcementDetail.value
  if (data) {
    form.title = data.title || ''
    form.content = data.content || ''
  }
})
</script>

<template>
  <section class="announcement-edit-page">
    <h2 class="page-title">공지사항</h2>

    <div class="form-wrapper">
      <el-form :model="form" label-position="top" class="announcement-form">
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
.announcement-edit-page {
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
