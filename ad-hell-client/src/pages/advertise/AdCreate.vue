<!-- src/pages/advertise/AdCreate.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/pages/advertise/PageTitle.vue'
import CategorySettingModal from '@/pages/advertise/CategorySettingModal.vue'
import CommonButton from '@/components/common/CommonButton.vue'

const router = useRouter()

/* ---------------- 카테고리 설정 ---------------- */

const selectedCategory = ref<string | null>(null)
const isCategoryModalOpen = ref(false)

const categoryOptions = [
  { value: 'FOOD', label: '음식' },
  { value: 'SERVICE', label: '서비스' },
  { value: 'SHOPPING', label: '쇼핑' },
  { value: 'ETC', label: '기타' },
]

const categoryLabel = computed(() => {
  if (!selectedCategory.value) return '카테고리 설정'

  let label = '카테고리 설정'
  for (let i = 0; i < categoryOptions.length; i++) {
    if (categoryOptions[i].value === selectedCategory.value) {
      label = categoryOptions[i].label
      break
    }
  }
  return label
})

const openCategoryModal = () => {
  isCategoryModalOpen.value = true
}
const closeCategoryModal = () => {
  isCategoryModalOpen.value = false
}
const handleCategorySave = (category: string) => {
  selectedCategory.value = category
  isCategoryModalOpen.value = false
}

/* ---------------- 폼 상태 ---------------- */

const title = ref('')
const content = ref('')
const files = ref<File[]>([])

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files) return

  const list: File[] = []
  for (let i = 0; i < target.files.length; i++) {
    const f = target.files.item(i)
    if (f) list.push(f)
  }
  files.value = list
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  if (!e.dataTransfer) return

  const list: File[] = []
  for (let i = 0; i < e.dataTransfer.files.length; i++) {
    const f = e.dataTransfer.files.item(i)
    if (f) list.push(f)
  }
  files.value = list
}

const preventDefault = (e: DragEvent) => {
  e.preventDefault()
}

/* ---------------- 버튼 핸들러 ---------------- */

const handleSubmit = () => {
  if (!title.value.trim()) {
    alert('제목을 입력해주세요.')
    return
  }

  // TODO: 실제 API 요청용 payload 만들기
  // 예시로만 로그 출력
  console.log('제출', {
    title: title.value,
    content: content.value,
    category: selectedCategory.value,
    files: files.value,
  })

  // 등록 후 이동 처리
  // router.push('/admanageview')
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <section class="ad-create-page">
    <!-- 상단 제목 + 카테고리 설정 -->
    <PageTitle
        title="광고 등록"
        :show-category="true"
        :category-label="categoryLabel"
        @click-category="openCategoryModal"
    />

    <!-- 제목 입력 -->
    <div class="field">
      <input
          v-model="title"
          type="text"
          class="title-input"
          placeholder="제목을 입력하세요."
      />
    </div>

    <!-- 내용 입력 -->
    <div class="field">
      <textarea
          v-model="content"
          class="content-textarea"
          placeholder="내용을 입력하세요."
      />
    </div>

    <!-- 파일 업로드 박스 -->
    <div
        class="upload-box"
        @dragover="preventDefault"
        @dragenter="preventDefault"
        @drop="handleDrop"
    >
      <input
          id="file-input"
          type="file"
          multiple
          class="file-input"
          @change="handleFileChange"
      />
      <label for="file-input" class="upload-inner">
        <div class="upload-icon">⬆</div>
        <div class="upload-text">
          <span v-if="files.length === 0">
            이미지 / 파일을 업로드 하세요
          </span>
          <span v-else>
            {{ files.length }}개 파일 선택됨
          </span>
        </div>
      </label>
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-buttons">
      <CommonButton
          type="register"
          :width="80"
          @click="handleSubmit"
      />
      <CommonButton
          type="cancel"
          :width="80"
          @click="handleCancel"
      />
    </div>

    <!-- 카테고리 설정 모달 -->
    <CategorySettingModal
        :visible="isCategoryModalOpen"
        :selected-category="selectedCategory"
        @close="closeCategoryModal"
        @save="handleCategorySave"
    />
  </section>
</template>

<style scoped>
.ad-create-page {
  padding: 24px 40px;
  box-sizing: border-box;
}

/* 각 필드 박스 공통 */
.field {
  margin-top: 12px;
}

/* 제목 input */
.title-input {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  padding: 0 12px;
  font-size: 14px;
  box-sizing: border-box;
}

/* 내용 textarea */
.content-textarea {
  width: 100%;
  min-height: 260px;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  padding: 12px;
  font-size: 14px;
  box-sizing: border-box;
  resize: vertical;
}

/* 파일 업로드 박스 */
.upload-box {
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  background: #fafafa;
  height: 160px;
  box-sizing: border-box;
  position: relative;
}

/* 실제 input은 숨기고 label로 클릭 영역 제공 */
.file-input {
  display: none;
}

.upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  color: #b0b0b0;
  gap: 8px;
}

.upload-icon {
  font-size: 24px;
}

.upload-text {
  font-size: 13px;
}

/* 하단 버튼 */
.bottom-buttons {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
