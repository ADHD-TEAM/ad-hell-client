<!-- src/pages/announcement/admin/AdminAnnouncementList.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnnouncementStore } from '@/stores/announcementStore.js'
import { useAuthStore } from '@/stores/authStore.js'

import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import CommonButton from '@/components/common/CommonButton.vue'

const router = useRouter()
const announcementStore = useAnnouncementStore()

const {
  announcements,
  page,
  totalPages,
  searchForm,
  loadAnnouncements,
  search,
  changePage,
} = announcementStore

const goDetail = (id) => {
  router.push(`/admin/announcements/${id}`)
}

const goCreate = () => {
  router.push({ name: 'AdminAnnouncementCreate' })
}

onMounted(() => {
  loadAnnouncements()
})
</script>

<template>
  <section class="announcement-page">
    <h2 class="announcement-title">공지사항</h2>

    <div class="announcement-content">
      <SearchForm
          :search-form="searchForm"
          @search="search"
      />

      <h3 class="announcement-subtitle">공지사항 목록</h3>

      <DataTable
          :data="announcements"
          @select="goDetail"
      >
        <el-table-column
            prop="id"
            label="ID"
            width="80"
        />
        <el-table-column
            prop="title"
            label="제목"
            min-width="300"
            show-overflow-tooltip
        />
        <el-table-column
            prop="createdAt"
            label="작성일자"
            width="160"
        />
      </DataTable>

      <div class="announcement-bottom-row">
        <div class="bottom-left">
          <Pagination
              :page="page"
              :total-pages="totalPages"
              @change-page="changePage"
          />
        </div>

        <div class="bottom-write">
          <CommonButton type="write" @click="goCreate" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.announcement-page {
  padding: 24px 32px 40px;
  box-sizing: border-box;
}

.announcement-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.announcement-content {
  width: 100%;
  margin: 0;
}

.announcement-subtitle {
  margin: 24px 0 8px;
  font-size: 18px;
  font-weight: 700;
}

.announcement-bottom-row {
  width: 100%;
  margin-top: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bottom-left {
  flex: 1;
  display: flex;
  justify-content: center;
}

.bottom-write {
  display: flex;
  justify-content: flex-end;
  margin-left: 16px;
}
</style>
