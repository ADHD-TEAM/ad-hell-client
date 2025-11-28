<!-- src/pages/mypage/MyBoardList.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'

import {
  fetchMyBoardPosts,
  fetchMyBoardComments,
} from '@/api/myBoardApi.js'

const router = useRouter()

// 탭 상태: posts = 내가 쓴 게시글, comments = 내가 쓴 댓글
const activeTab = ref('posts')

// 데이터
const posts = ref([])
const comments = ref([])
const page = ref(1)
const totalPages = ref(1)
const keyword = ref('')

// 상태
const loading = ref(false)
const errorMessage = ref('')

// 내가 쓴 게시글 조회
const loadPosts = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const result = await fetchMyBoardPosts({
      page: page.value,
      size: 10,
      keyword: keyword.value || undefined,
    })

    posts.value = result?.items || []
    totalPages.value = result?.totalPages || 1
  } catch (e) {
    console.error('loadPosts error:', e)

    // 401이면 안내 문구
    if (e?.response?.status === 401) {
      errorMessage.value = '로그인이 필요합니다.'
    } else {
      errorMessage.value =
          e?.response?.data?.message ||
          e?.message ||
          '게시글 조회 중 오류가 발생했습니다.'
    }

    posts.value = []
  } finally {
    loading.value = false
  }
}

// 내가 쓴 댓글 조회
const loadComments = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const result = await fetchMyBoardComments({
      page: page.value,
      size: 10,
      keyword: keyword.value || undefined,
    })

    comments.value = result?.items || []
    totalPages.value = result?.totalPages || 1
  } catch (e) {
    console.error('loadComments error:', e)

    if (e?.response?.status === 401) {
      errorMessage.value = '로그인이 필요합니다.'
    } else {
      errorMessage.value =
          e?.response?.data?.message ||
          e?.message ||
          '댓글 조회 중 오류가 발생했습니다.'
    }

    comments.value = []
  } finally {
    loading.value = false
  }
}

// 현재 탭 기준으로 로드
const loadTab = async () => {
  if (activeTab.value === 'posts') {
    await loadPosts()
  } else {
    await loadComments()
  }
}

// 탭 전환
const switchTab = async (tab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  page.value = 1
  await loadTab()
}

// 게시글/댓글 클릭 시 게시글 상세로 이동
const goDetail = (row) => {
  router.push(`/boards/${row.boardId || row.id}`)
}

// 페이지 변경
const changePage = async (p) => {
  page.value = p
  await loadTab()
}

// 검색
const onSearch = async () => {
  page.value = 1
  await loadTab()
}

// 최초 진입 시 현재 탭 데이터 로드
onMounted(loadTab)
</script>

<template>
  <section class="mypage-board-page">
    <!-- 상단: 내가 쓴 게시글 / 내가 쓴 댓글 탭 -->
    <div class="sub-tab-row">
      <button
          class="sub-tab"
          :class="{ active: activeTab === 'posts' }"
          @click="switchTab('posts')"
      >
        내가 쓴 게시글
      </button>
      <button
          class="sub-tab"
          :class="{ active: activeTab === 'comments' }"
          @click="switchTab('comments')"
      >
        내가 쓴 댓글
      </button>
    </div>

    <!-- 검색 -->
    <div class="search-row">
      <input
          v-model="keyword"
          type="text"
          placeholder="검색어를 입력하세요"
          @keyup.enter="onSearch"
      />
      <button class="search-btn" @click="onSearch">검색</button>
    </div>

    <p v-if="errorMessage" class="error-text">
      {{ errorMessage }}
    </p>

    <!-- 내가 쓴 게시글 리스트 -->
    <div v-if="activeTab === 'posts'">
      <div v-if="posts.length > 0">
        <DataTable :data="posts" :loading="loading" @select="goDetail">
          <el-table-column prop="title" label="제목" min-width="400" />
          <el-table-column prop="writerName" label="작성자" width="120" />
          <el-table-column prop="createdAt" label="작성일" width="170" />
          <el-table-column
              prop="viewCount"
              label="조회수"
              width="100"
              align="center"
          />
        </DataTable>
      </div>

      <div v-else-if="!loading" class="empty-box">
        등록된 게시글이 없습니다.
      </div>
    </div>

    <!-- 내가 쓴 댓글 리스트 -->
    <div v-else>
      <div v-if="comments.length > 0">
        <DataTable :data="comments" :loading="loading" @select="goDetail">
          <el-table-column prop="postTitle" label="원본 게시글" min-width="400" />
          <el-table-column
              prop="commentContent"
              label="댓글 내용"
              min-width="300"
          />
          <el-table-column prop="createdAt" label="작성일" width="170" />
        </DataTable>
      </div>

      <div v-else-if="!loading" class="empty-box">
        등록된 댓글이 없습니다.
      </div>
    </div>

    <!-- 페이징 -->
    <div class="bottom-row" v-if="totalPages > 1">
      <Pagination
          :page="page"
          :total-pages="totalPages"
          @change-page="changePage"
      />
    </div>
  </section>
</template>

<style scoped>
.mypage-board-page {
  padding: 24px 32px;
}

/* 서브탭 (내가 쓴 게시글 / 내가 쓴 댓글) */
.sub-tab-row {
  display: flex;
  gap: 20px;
  margin: 20px 0 16px;
}

.sub-tab {
  background: none;
  border: none;
  padding: 4px 0;
  font-size: 18px;
  cursor: pointer;
  color: #888;
}

.sub-tab.active {
  color: #ff0000;
  font-weight: 700;
  border-bottom: 2px solid #ff0000;
}

/* 검색 */
.search-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.search-row input {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #ddd;
  padding: 0 16px;
}

.search-btn {
  width: 40px;
  height: 40px;
  background: #ff0000;
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}

/* 에러 / 빈 데이터 표시 */
.error-text {
  color: #ff0000;
  margin-bottom: 8px;
}

.empty-box {
  margin-top: 24px;
  padding: 40px 16px;
  text-align: center;
  color: #999;
  border-radius: 8px;
  border: 1px solid #eee;
}

/* 페이징 */
.bottom-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
