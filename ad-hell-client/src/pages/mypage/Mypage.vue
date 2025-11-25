<script setup>

import UserMypageNav from "@/components/common/UserMypageNav.vue";
</script>

<template>
  <div class="mypage-blok">
    <div >
      <h3>마이페이지</h3>
    </div>
    <UserMypageNav />
    <!--  회원정보, 포인트, 광고, 게시판 , 문의/신고  -->
    <router-view />

  </div>
</template>
<style src="./styles/mypage.css" scoped></style>