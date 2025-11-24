<!-- AdSearchBox.vue -->
<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['search'])

const searchForm = reactive({
  title: '',
  categoryId: '',
  status: '',
})

const categoryOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'FOOD', label: '음식' },
  { value: 'SERVICE', label: '서비스' },
  { value: 'ETC', label: '기타' },
]

const statusOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
]

const handleSearch = () => {
  emit('search', { ...searchForm })
}
</script>

<template>
  <section class="ad-search-box">
    <div class="ad-search-inner">
      <!-- 왼쪽 : 라벨 + 인풋 묶음 -->
      <div class="ad-search-left">
        <!-- 1행 : 광고 제목 -->
        <div class="field-row">
          <span class="field-label">광고 제목</span>
          <el-input
              v-model="searchForm.title"
              placeholder="광고 제목"
              class="field-control title-input"
              clearable
          />
        </div>

        <!-- 2행 : 카테고리 선택 / 상태 -->
        <div class="field-row">
          <span class="field-label">카테고리 선택</span>

          <div class="field-row-inline">
            <el-select
                v-model="searchForm.categoryId"
                placeholder="카테고리 선택"
                class="field-control"
                clearable
            >
              <el-option
                  v-for="opt in categoryOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
              />
            </el-select>

            <span class="field-label small">상태</span>

            <el-select
                v-model="searchForm.status"
                placeholder="활성"
                class="field-control status-select"
                clearable
            >
              <el-option
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
              />
            </el-select>
          </div>
        </div>
      </div>

      <!-- 오른쪽 : 검색 버튼 -->
      <div class="ad-search-right">
        <el-button
            type="danger"
            plain
            round
            class="search-btn"
            @click="handleSearch"
        >
          검색
        </el-button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.ad-search-box {
  width: 100%;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #f7f5f5;
  border-radius: 10px;
}

.ad-search-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

/* 왼쪽 영역 : 두 줄로 정렬 */
.ad-search-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 24px;
}

.field-label {
  width: 90px;
  font-size: 14px;
  color: #555;
}

.field-label.small {
  width: auto;
  margin-left: 8px;
}

/* 한 줄 안에서 셀렉트 2개 나란히 */
.field-row-inline {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.field-control {
  flex: 1;
}

/* 오른쪽 검색 버튼 */
.ad-search-right {
  display: flex;
  align-items: center;
}

.search-btn {
  padding: 0 24px;
  height: 40px;
  font-weight: 600;
  border-width: 1.5px;
}

/* 반응형 - 좁아지면 세로로 */
@media (max-width: 900px) {
  .ad-search-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }

  .ad-search-right {
    justify-content: flex-end;
  }
}
</style>
