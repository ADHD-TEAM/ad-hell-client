<template>
  <div>
    <h2>카테고리 목록</h2>

    <el-table :data="categories" v-loading="loading" style="width: 100%">
      <el-table-column prop="name" label="이름" width="200" />
      <el-table-column label="상세보기">
        <template #default="{ row }">
          <el-button type="primary" @click="goDetail(row.id)">
            상세
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="error">
      오류 발생: {{ error.message }}
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCategoryList } from '@/composables/category/useCategoryList.js'

const router = useRouter()
const { categories, loading, error } = useCategoryList()

const goDetail = (id) => {
  router.push(`/categories/${id}`)
}
</script>
