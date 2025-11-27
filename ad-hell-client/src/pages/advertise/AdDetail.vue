<!-- src/pages/advertise/admin/AdDetail.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import AdminCommentList from '@/pages/advertise/AdminCommentList.vue'
import api from '@/api/api.js'
import AdminCommentList2 from "@/pages/advertise/AdminCommentList2.vue";

interface AdCommentDto {
  adCommentId: number;
  adId: number;
  userId: number;
  content: string;
  createdAt: string;
  updateAt: string;
}

interface AdCommentListData {
  adComments: AdCommentDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

interface AdFileDto {
  fileId: number;
  originFileName: string;
  storedName: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'VIDEO' | 'DOC' | string;
}

interface AdDto {
  adId: number;
  categoryId: number;
  categoryName: string;
  title: string;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  files: AdFileDto[];
}

// 백엔드 응답의 data 부분 구조
interface AdDetailData {
  ad: AdDto;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  errorCode: string | null;
  message: string | null;
  timestamp: string;
}


// 댓글 데이터용 타입
type CommentRow = {
  id: number
  writer: string
  content: string
}

// ---------- 라우터, 상태 ----------
const route = useRoute()
const router = useRouter()

// /admin/ads/:id 에서 :id 값 읽기
const adId = Number(route.params.id)

// 상세 정보 상태
const adTitle = ref('')
const createdAt = ref('')
const viewCount = ref(0)
const videoSrc = ref('')

const isLoading = ref(false)
const errorMessage = ref('')

// 댓글 상태
const comments = ref<CommentRow[]>([])

const loadComments = async () => {
  try {
    // baseURL 이 /api 라고 가정하면 실제 호출은: GET /api/ad/comments?adId=20
    const res = await api.get<ApiResponse<AdCommentListData>>('/ad/comments', {
      params: { adId }
    })

    const adComments = res.data.data.adComments

    // AdminCommentList가 기대하는 형태로 매핑
    comments.value = adComments.map((c) => ({
      id: c.adCommentId,
      writer: String(c.userId), // 일단 userId 로 채워두고, 나중에 닉네임 나오면 교체
      content: c.content
    }))
  } catch (e) {
    console.error('댓글 조회 실패:', e)
  }
}


// ---------- 광고 상세 조회 ----------
const loadAdDetail = async () => {
  if (!adId || Number.isNaN(adId)) {
    errorMessage.value = '잘못된 광고 ID 입니다.'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    // 응답 제네릭을 ApiResponse<AdDetailData>로 맞추기
    const res = await api.get<ApiResponse<AdDetailData>>(`/ads/${adId}`)

    // res.data.data.ad 에 실제 광고가 들어있음
    const ad = res.data.data.ad

    console.log('광고 상세 응답(ad만):', ad)

    adTitle.value = ad.title ?? ''
    createdAt.value = ad.createdAt ?? ''
    viewCount.value = ad.viewCount ?? 0

    const videoFile = (ad.files ?? []).find(
        (file) => file.fileType === 'VIDEO'
    )
    videoSrc.value = videoFile?.fileUrl ?? ''
  } catch (e) {
    console.error('광고 상세 조회 실패:', e)
    errorMessage.value = '광고 상세 정보를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}


// ---------- 버튼 핸들러들 ----------
const handleEditAd = () => {
  console.log('광고 수정', adId)
}

const handleHideAd = () => {
  console.log('광고 비공개 처리', adId)
}

const handleCancel = () => {
  router.back()
}

const handleEditComment = (id: number) => {
  console.log('댓글 수정:', id)
}

const handleDeleteComment = (id: number) => {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    comments.value = comments.value.filter((c) => c.id !== id)
  }
}

// 마운트 시 상세 데이터 로딩
onMounted(() => {
  loadComments()
  loadAdDetail()
})
</script>


<template>
  <section class="ad-detail-page">
    <!-- 로딩 / 에러 표시 -->
    <p v-if="isLoading">불러오는 중입니다...</p>
    <p v-else-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

    <!-- 상단 제목 + 메타 정보 -->
    <header class="ad-header" v-if="!isLoading && !errorMessage">
      <div class="ad-title-row">
        <span class="ad-title-label">광고 이름:</span>
        <span class="ad-title-text">{{ adTitle }}</span>
      </div>

      <div class="ad-meta-row">
        <span class="meta-item">
          작성일:
          <span class="meta-strong">{{ createdAt }}</span>
        </span>
        <span class="meta-divider">｜</span>
        <span class="meta-item">
          조회수:
          <span class="meta-strong">{{ viewCount.toLocaleString() }}</span>
        </span>
      </div>
    </header>

    <hr class="divider" v-if="!isLoading && !errorMessage" />

    <!-- 동영상(미디어) 영역 -->
    <div class="media-box" v-if="!isLoading && !errorMessage">
      <div class="media-placeholder" v-if="!videoSrc">
        <div class="play-icon">▶</div>
      </div>

      <video
          v-else
          class="media-placeholder"
          :src="videoSrc"
          controls
      />
    </div>

    <!-- 댓글 영역 -->
<!--    <AdminCommentList-->
<!--        v-if="!isLoading && !errorMessage"-->
<!--        :comments="comments"-->
<!--        @edit="handleEditComment"-->
<!--        @delete="handleDeleteComment"-->
<!--    />-->
    <AdminCommentList2  :adId="adId"/>

    <!-- 하단 광고 관리 버튼 -->
    <div
        class="bottom-buttons"
        v-if="!isLoading && !errorMessage"
    >
      <CommonButton
          type="update"
          :width="80"
          @click="handleEditAd"
      />
      <CommonButton
          type="reset"
          :width="80"
          @click="handleHideAd"
      />
      <CommonButton
          type="cancel"
          :width="80"
          @click="handleCancel"
      />
    </div>
  </section>
</template>


<style scoped lang="scss">
.ad-detail-page {
  padding: 24px 40px;
  box-sizing: border-box;
}

/* ---------------- 상단 제목/메타 ---------------- */

.ad-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ad-title-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ad-title-label {
  font-size: 14px;
  font-weight: 700;
}

.ad-title-text {
  font-size: 14px;
  font-weight: 700;
}

.ad-meta-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  font-size: 12px;
  color: #777;
}

.meta-item {
  white-space: nowrap;
}

.meta-strong {
  color: #ff0000;
  font-weight: 600;
  margin-left: 4px;
}

.meta-divider {
  color: #ddd;
}

.divider {
  margin: 12px 0 24px 0;
  border: none;
  border-top: 1px solid #f0f0f0;
}

/* ---------------- 미디어 박스 ---------------- */

.media-box {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.media-placeholder {
  width: 640px;
  max-width: 100%;
  height: 360px;
  background: #ffe3e3;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ff0000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

/* ---------------- 하단 버튼 ---------------- */

.bottom-buttons {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
