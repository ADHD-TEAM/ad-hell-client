<script setup>
import {ref, reactive, computed} from "vue";
import foldingIconSrc from '@/assets/icon/icon-folding.svg';
import {useRoute, useRouter} from "vue-router";
import LoginView from "@/pages/account/LoginView.vue";
import NotificationBell from "@/components/notification/NotificationBell.vue";
import HeadBarIconSrc from '@/assets/icon/icon-logo.svg'
import AlertIconSrc from '@/assets/icon/icon-headbar-alert.svg'
import MypageIconSrc from '@/assets/icon/icon-headbar-mypage.svg'
import { useAuthStore } from "@/stores/authStore.js";

const authStore = useAuthStore();
const isAdmin = computed(() => authStore?.user?.role === 'ADMIN');
const router = useRouter();
const route = useRoute();
const isAdminPage = computed(() => route.path.startsWith('/admin'));

const goAdminHome = () => {
  router.push({ name: 'AdminHome' });
};

const goUserHome = () => {
  router.push({ name: 'MainPage' })
}

const goLogin = () => {
  router.push({name : 'UserLoginView'});
}
const foldingIcon = reactive({
  src : foldingIconSrc,
  name : 'foldingIcon'
});
const HeadBarIcon = ref(
    { src : HeadBarIconSrc }
)
const MypageIcon = ref(
    {src : MypageIconSrc}
)
const AlertIcon = ref(
    {src : AlertIconSrc}
)
</script>

<template>
  <!-- Element Plus 헤더 컴포넌트 -->
  <el-header class="app-header">
    <!-- 실제 규격 1280 * 56을 맞추는 내부 컨테이너 -->
    <div class="header-inner">
      <!-- 왼쪽 영역 (로고/타이틀 등) -->
      <div class="header-left">
        <!-- 아이콘 -->
        <img
            :src="foldingIcon.src"
            :alt="foldingIcon.name"
            class="folding-img"
        />
        <!-- 로고 텍스트 -->
        <router-link :to="{ name: 'MainPage' }">
        <img :src = "HeadBarIcon.src"/>
        </router-link>
      </div>

      <!-- 오른쪽 영역 (메뉴, 버튼 등) -->
      <div class="header-right">
        <el-button
            v-if="isAdmin && !isAdminPage"
            class="admin-btn"
            @click="goAdminHome"
        >
          관리자 페이지
        </el-button>

        <el-button
            v-if="isAdmin && isAdminPage"
            class="user-btn"
            @click="goUserHome"
        >
          사용자 페이지
        </el-button>

        <!-- Element Plus 버튼들 예시 -->

        <!-- 알림 아이콘 + 뱃지 + 팝오버 모두 NotificationBell에서 처리 -->
        <NotificationBell :icon-src="AlertIcon.src" />

        <router-link :to="{ name: 'MyProfileUpdate' }">
          <img :src = "MypageIcon.src"/>
        </router-link>
        <el-button type="primary" @click="goLogin">로그인</el-button>
      </div>
    </div>
  </el-header>
</template>

<style scoped>
/* el-header 기본 높이가 60px이라 56px로 맞춰줌 */
.app-header {
  padding: 0;                    /* el-header의 기본 padding 제거 */
  background-color: #ffffff;
  border-bottom: 1px solid #ebeef5; /* Element Plus 스타일 비슷하게 */
  display: flex;
  justify-content: center;       /* 가운데에 1280 컨테이너 정렬 */
}
.folding-img{
  margin-right:8px;
  width: 24px;
  height: 24px;
}
/* 실제 규격: 1280 x 56 + 좌우 패딩 30 */
.header-inner {
  width: 100%;
  height: 56px;
  padding: 0 30px;               /* 좌우 패딩 30 */
  box-sizing: border-box;

  display: flex;
  align-items: center;           /* 세로 중앙 */
  justify-content: space-between;/* 좌우로 퍼지게 정렬 */
  gap: 0;                        /* 간격 0 */
}

/* 왼쪽/오른쪽 컨테이너 */
.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 24px;                        /* 버튼 간격도 0 기준 */
}

/* 로고 아이콘 스타일 */
.logo-icon {
  margin-right:8px;   /* 아이콘과 텍스트 사이 간격 */
  font-size: 40px;     /* 아이콘 크기 */
}

/* 로고 텍스트 예시 스타일 */
.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 필요하면 버튼 간 기본 margin 제거도 가능 (Element 설정에 따라) */
/*
.header-right .el-button + .el-button {
  margin-left: 0;
}
*/

.admin-btn {
  background: #ff0000 !important;
  color: white !important;
  border-radius: 8px;
  font-weight: 600;
  padding: 8px 16px;
}
.admin-btn:hover {
  background: #cc0000 !important;
}

.user-btn {
  background: #00aaff !important;
  color: white !important;
  border-radius: 8px;
  font-weight: 600;
}
.user-btn:hover {
  background: #0088cc !important;
}
</style>