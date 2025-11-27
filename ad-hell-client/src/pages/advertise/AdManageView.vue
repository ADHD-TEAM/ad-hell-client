<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from "@/pages/advertise/PageTitle.vue";
import SearchBox from "@/pages/advertise/SearchBox.vue";
import Table from "@/pages/advertise/Table.vue";            // = AdListTable.vue
import Pagination from "@/pages/advertise/Pagination.vue";
import CommonButton from "@/components/common/CommonButton.vue";
import api from '@/api/api.js'

const router = useRouter()

// ---------------- 타입 정의 ----------------
type AdRow = {
  id: number
  title: string
  categoryName: string
  status: 'ACTIVE' | 'INACTIVE'
}

interface PaginationDto {
  currentPage: number
  totalPages: number
  totalItems: number
}

interface AdDto {
  adId: number
  title: string
  categoryName: string
  status: 'ACTIVE' | 'INACTIVE'
}

interface AdListResponse {
  ads: AdDto[]
  pagination: PaginationDto
}

interface ApiResponse<T> {
  success: boolean
  data: T
  errorCode: string | null
  message: string | null
  timestamp: string
}

// ---------------- 상태 ----------------

// 실제 테이블에 뿌릴 데이터
const ads = ref<AdRow[]>([])

// 검색 조건 (SearchBox에서 세팅해줌)
const searchConditions = ref({
  title: '',
  categoryId: '',
  status: '',
})

// 페이지네이션
const page = ref(1)           // 1부터 시작한다고 가정 (백엔드 규칙에 맞게 조정)
const size = 10               // 한 페이지에 몇 개씩
const totalPages = ref(1)
const isLoading = ref(false)

// ---------------- API 호출 ----------------

// TODO: 실제 엔드포인트에 맞게 수정 (예: '/ads' 또는 '/admin/ads')
const ADMIN_ADS_URL = '/admin/ads'

const fetchAds = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    // SearchBox에서 오는 값 중 'ALL'은 필터 없애는 걸로 처리
    const params: Record<string, any> = {
      page: page.value,
      size,
    }

    if (searchConditions.value.title.trim() !== '') {
      params.title = searchConditions.value.title.trim()
    }

    if (
        searchConditions.value.categoryId &&
        searchConditions.value.categoryId !== 'ALL'
    ) {
      params.categoryId = searchConditions.value.categoryId
    }

    if (
        searchConditions.value.status &&
        searchConditions.value.status !== 'ALL'
    ) {
      params.status = searchConditions.value.status
    }

    const res = await api.get<ApiResponse<AdListResponse>>(ADMIN_ADS_URL, {
      params,
    })

    const listResponse = res.data.data
    if (!listResponse) {
      console.error('응답에 data가 없습니다.', res.data)
      return
    }

    // 백엔드 DTO → 테이블에서 쓸 형태로 매핑
    ads.value = (listResponse.ads ?? []).map((ad) => ({
      id: ad.adId,
      title: ad.title,
      categoryName: ad.categoryName,
      status: ad.status,
    }))

    totalPages.value = listResponse.pagination?.totalPages ?? 1
  } catch (error) {
    console.error('관리자 광고 목록 조회 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// ---------------- 이벤트 핸들러 ----------------

// SearchBox에서 "검색" 버튼 클릭 시
const handleSearch = (form: { title: string; categoryId: string; status: string }) => {
  // 조건 저장
  searchConditions.value = { ...form }

  // 페이지를 1로 리셋하고 다시 조회
  page.value = 1
  fetchAds()
}

// 페이지네이션 변경 시
const changePage = (newPage: number) => {
  page.value = newPage
  fetchAds()
}

// 광고 등록 화면으로 이동
const goToCreateAd = () => {
  router.push('/adcreate')
}

// 처음 진입 시 한 번 조회
onMounted(() => {
  fetchAds()
})
</script>

<template>
  <section class="ad-manage-page">
    <PageTitle title="광고 목록 조회" />

    <!-- 메인 컨텐츠 영역 -->
    <div class="main-content">
      <!-- 🔍 검색 박스: 검색 이벤트 연결 -->
      <SearchBox @search="handleSearch" />

      <!-- 테이블: API 결과 전달 -->
      <Table :ads="ads" />
    </div>

    <!-- 🔥 페이지 하단 바 -->
    <div class="bottom-bar">
      <!-- 가운데 페이지네이션 -->
      <div class="bottom-pagination">
        <Pagination
            :page="page"
            :total-pages="totalPages"
            :max-buttons="5"
            @change="changePage"
        />
      </div>

      <!-- 오른쪽 광고 등록 버튼 -->
      <button class="bottom-register">
        <CommonButton
            type="register"
            :width="100"
            @click="goToCreateAd"
        />
      </button>
    </div>
  </section>
</template>

<style scoped>
/* 페이지 전체를 세로 flex 로 만들어서 하단 고정 느낌 */
.ad-manage-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px 40px;
  box-sizing: border-box;
}

/* 검색박스 + 테이블이 들어가는 영역 (위쪽) */
.main-content {
  flex: 1;
}

/* 하단 바: 페이지 끝쪽에 위치 */
.bottom-bar {
  position: relative;
  margin-top: 24px;
  padding-bottom: 24px;
}

/* 페이지네이션을 컨테이너 중앙에 */
.bottom-pagination {
  display: flex;
  justify-content: center;
}

/* 광고 등록 버튼: 같은 줄, 오른쪽 끝 */
.bottom-register {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  padding: 0;
}
</style>
