<!-- src/pages/advertise/AdCreate.vue -->
<script setup lang="ts">
import { ref,onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/pages/advertise/PageTitle.vue'
import CategorySettingModal from '@/pages/advertise/CategorySettingModal.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import api from '@/api/api.js'

const router = useRouter()

/** ---------------- 카테고리 타입 ---------------- */

// 백엔드 카테고리 DTO (응답에 맞춰서)
interface CategoryDto {
  id: number
  name: string
  description: string
  status: string
  parentId: number | null
  children: CategoryDto[]
}

// 모달/화면에서 쓸 옵션 타입
interface CategoryOption {
  value: number
  label: string
}

/* ---------------- 카테고리 설정 ---------------- */

const categoryOptions = ref<CategoryOption[]>([])
const selectedCategoryId = ref<number | null>(null)

// 모달 보이기 여부
const isCategoryModalOpen = ref(false)

// 라벨: 선택된 카테고리의 이름 (없으면 "카테고리 설정")
const categoryLabel = computed(() => {
  if (!selectedCategoryId.value) return '카테고리 설정'

  const found = categoryOptions.value.find(
      (opt) => opt.value === selectedCategoryId.value
  )
  return found ? found.label : '카테고리 설정'
})

const openCategoryModal = () => {
  isCategoryModalOpen.value = true
}
const closeCategoryModal = () => {
  isCategoryModalOpen.value = false
}
const handleCategorySave = (categoryId: number) => {
  selectedCategoryId.value = categoryId
  isCategoryModalOpen.value = false
}

const loadCategories = async () => {
  try {
    const res = await api.get('/categories')

    // 응답 구조: { success, data: CategoryDto[], ... }
    const list: CategoryDto[] = res.data.data

    console.log('카테고리 raw:', list)

    categoryOptions.value = list.map((c) => ({
      value: c.id,
      label: c.name,
    }))

    console.log('categoryOptions:', categoryOptions.value)
  } catch (e) {
    console.error('카테고리 조회 실패:', e)
  }
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

const handleSubmit = async () => {
  if (!title.value.trim()) {
    alert('제목을 입력해주세요.')
    return
  }

  if (!selectedCategoryId.value) {
    alert('카테고리를 선택해주세요.')
    return
  }

  if (files.value.length === 0) {
    const ok = confirm('파일이 없습니다. 파일 없이 등록하시겠습니까?')
    if (!ok) return
  }

  // 순수 JS 객체로만 만들기 (ref 금지)
  const adInfo = {
    categoryId: Number(selectedCategoryId.value),
    title: title.value,
    // content: content.value  // 이걸 보내고 싶으면 DTO에도 필드 추가해야 함
  }

  const formData = new FormData()

  // adInfo -> JSON + Blob
  formData.append(
      'adInfo',
      new Blob([JSON.stringify(adInfo)], { type: 'application/json' })
  )

  // 백엔드가 videoFiles 로 받으니까 키 이름 맞춰주기
  files.value.forEach((file) => {
    formData.append('videoFiles', file)
  })

  try {
    const res = await api.post('/ads', formData, {
      // 이 헤더는 사실 안 써도 됨. axios가 자동으로 boundary 포함해서 넣어줌.
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('광고 등록 성공:', res.data)
    alert('광고가 등록되었습니다.')
    router.back()
  } catch (e) {
    console.error('광고 등록 실패:', e)
    alert('광고 등록에 실패했습니다.')
  }
}

const handleCancel = () => {
  router.back()
}

// 페이지 진입 시 카테고리 먼저 로딩
onMounted(() => {
  loadCategories()
})
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
        :selected-category-id="selectedCategoryId"
        :category-options="categoryOptions"
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
