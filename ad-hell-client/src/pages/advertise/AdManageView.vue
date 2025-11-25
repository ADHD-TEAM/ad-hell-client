<script setup lang="ts">
import { ref } from 'vue'
import PageTitle from "@/pages/advertise/PageTitle.vue";
import SearchBox from "@/pages/advertise/SearchBox.vue";
import Table from "@/pages/advertise/Table.vue";
import Pagination from "@/pages/advertise/Pagination.vue";
import CommonButton from "@/components/common/CommonButton.vue";

const page = ref(1)
const totalPages = ref(10)

const changePage = (newPage: number) => {
  page.value = newPage
  // 여기서 API 다시 호출하거나, store 액션 불러도 됨
}
</script>

<template>
  <section class="ad-manage-page">
    <PageTitle title="광고 목록 조회" />

    <!-- 메인 컨텐츠 영역 -->
    <div class="main-content">
      <SearchBox />
      <Table />
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
        <CommonButton type="register" :width="100" />
      </button>
    </div>
  </section>
</template>

<style scoped>
/* 페이지 전체를 세로 flex 로 만들어서 하단 고정 느낌 */
.ad-manage-page {
  min-height: 100vh;           /* 화면 전체 높이 기준 */
  display: flex;
  flex-direction: column;
  padding: 24px 40px;
  box-sizing: border-box;
}

/* 검색박스 + 테이블이 들어가는 영역 (위쪽) */
.main-content {
  flex: 1;                     /* 남는 공간 채우기 */
}

/* 하단 바: 페이지 끝쪽에 위치 */
.bottom-bar {
  position: relative;
  margin-top: 24px;
  padding-bottom: 24px;        /* 아래 여백 조금 */
}

/* 페이지네이션을 컨테이너 중앙에 */
.bottom-pagination {
  display: flex;
  justify-content: center;     /* 수평 중앙 정렬 */
}

/* 광고 등록 버튼: 같은 줄, 오른쪽 끝 */
.bottom-register {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%); /* 세로 가운데 정렬 */
  border: none;
  background: transparent;
  padding: 0;
}
</style>
