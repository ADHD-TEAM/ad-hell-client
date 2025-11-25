<!-- src/pages/advertise/CategorySettingModal.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'

const props = defineProps<{
  visible: boolean
  selectedCategory?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', category: string): void
}>()

const categoryOptions = [
  { value: 'FOOD', label: '음식' },
  { value: 'SERVICE', label: '서비스' },
  { value: 'SHOPPING', label: '쇼핑' },
  { value: 'ETC', label: '기타' },
]

const current = ref<string>('FOOD')

watch(
    () => props.selectedCategory,
    (v) => {
      if (v) current.value = v
    },
    { immediate: true }
)

const handleClose = () => {
  emit('close')
}

const handleSave = () => {
  emit('save', current.value)
}
</script>

<template>
  <!-- visible 이 true일 때만 모달 표시 -->
  <div v-if="visible" class="modal-backdrop" @click.self="handleClose">
    <div class="modal">
      <h3 class="modal-title">카테고리 설정</h3>

      <p class="modal-desc">광고에 적용할 카테고리를 선택하세요.</p>

      <ul class="category-list">
        <li
            v-for="opt in categoryOptions"
            :key="opt.value"
            class="category-item"
        >
          <label>
            <input
                type="radio"
                v-model="current"
                :value="opt.value"
            />
            <span>{{ opt.label }}</span>
          </label>
        </li>
      </ul>

      <div class="modal-footer">
        <CommonButton type="cancel"  :width="70" @click="handleClose" />
        <CommonButton type="save"    :width="70" @click="handleSave" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal {
  width: 360px;
  max-width: 90%;
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.modal-desc {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #777;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.category-item + .category-item {
  margin-top: 8px;
}

.category-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.category-item input[type='radio'] {
  accent-color: #ff0000;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
