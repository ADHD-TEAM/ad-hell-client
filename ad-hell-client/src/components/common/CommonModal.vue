<template>
  <el-dialog
      class="adhell-dialog"
      :model-value="modelValue"
      :width="width"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      @update:model-value="onUpdateVisible"
  >
    <!-- 커스텀 헤더 -->
    <header class="modal-header">
      <div class="logo">AD HELL</div>
      <div class="divider"></div>
    </header>

    <!-- 본문: 기본은 message, 필요하면 slot으로 교체 -->
    <main class="modal-body">
      <slot>
        <p>{{ message }}</p>
      </slot>
    </main>

    <!-- 푸터: 기본 버튼 / slot="footer"로 커스텀 가능 -->
    <template #footer>
      <div class="modal-footer">
        <slot name="footer">
          <!-- alert 타입: 확인만 -->
          <el-button
              v-if="mode === 'alert'"
              class="ad-btn ad-btn-primary"
              type="primary"
              @click="onConfirm"
          >
            {{ confirmText || '확인' }}
          </el-button>

          <!-- confirm 타입: 확인 + 취소 -->
          <template v-else>
            <el-button
                class="ad-btn ad-btn-primary"
                type="primary"
                @click="onConfirm"
            >
              {{ confirmText || '수정' }}
            </el-button>
            <el-button
                class="ad-btn ad-btn-outline"
                @click="onCancel"
            >
              {{ cancelText || '취소' }}
            </el-button>
          </template>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'confirm' }, // 'confirm' | 'alert'
  message: { type: String, default: '' },
  confirmText: String,
  cancelText: String,
  width: { type: String, default: '560px' },  // 모달 창 크기 조절
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const onUpdateVisible = (value) => {
  emit('update:modelValue', value)
}

const close = () => {
  emit('update:modelValue', false)
}

const onConfirm = () => {
  emit('confirm')
  close()
}

const onCancel = () => {
  emit('cancel')
  close()
}
</script>

<style scoped>
/* Element Plus 기본 헤더는 숨김 */
.adhell-dialog :deep(.el-dialog__header) {
  display: none;
}

/* 카드 스타일 */
.adhell-dialog :deep(.el-dialog) {
  border-radius: 18px;
  border: 1px solid #d7d7d7;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
  padding: 0; /* body에서 패딩 처리 */
}

.adhell-dialog :deep(.el-dialog__body) {
  padding: 24px 40px 32px;
}

/* 헤더 */
.modal-header .logo {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 800;
  font-size: 28px;
  color: #ff0000;
  text-shadow: 0 3px 0 rgba(0, 0, 0, 0.25);
}

.divider {
  margin-top: 16px;
  height: 1px;
  background: #8e8e8e;
}

/* 본문 */
.modal-body {
  flex: 1;
  padding: 40px 0 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #333333;
  font-size: 15px;
}

/* 푸터 */
.modal-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 공통 버튼 스타일 (Element Plus 버튼 커스터마이징) */
.modal-footer :deep(.ad-btn) {
  min-width: 72px;
  padding: 10px 22px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
}

/* 빨간 버튼 */
.modal-footer :deep(.ad-btn-primary) {
  background: #ff0000;
  border-color: #ff0000;
  color: #ffffff;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
}

/* 흰색 테두리 버튼 */
.modal-footer :deep(.ad-btn-outline) {
  background: #ffffff;
  color: #ff0000;
  border-color: #ff0000;
  box-shadow: none;
}

/* active / disabled */
.modal-footer :deep(.ad-btn:active) {
  transform: translateY(1px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
}

.modal-footer :deep(.ad-btn.is-disabled),
.modal-footer :deep(.ad-btn.is-disabled:active) {
  opacity: 0.5;
  cursor: default;
  transform: none;
  box-shadow: none;
}
</style>
