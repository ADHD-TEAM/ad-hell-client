<script setup>

import UserMypageNav from "@/components/common/UserMypageNav.vue";
</script>

<template>
  <div class="mypage-blok">
    <div >
      <h3>마이페이지</h3>
    </div>
    <UserMypageNav />

    <router-view />


  </div>
</template>
<style src="./styles/mypage.css" scoped></style>