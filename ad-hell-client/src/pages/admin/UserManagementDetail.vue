<script setup>
import UserManagementNav from "@/components/common/UserManagementNav.vue";
import {useRoute} from "vue-router";
const userId = Number(useRoute().params.id);

console.log("#######################################################");
console.log(userId);
</script>

<template>
  <div class="admin-userManagement">
    <h3>회원관리</h3>

      <!--  nav 바  -->
      <UserManagementNav />

      <!--  table  -->
      <router-view />


  </div>


</template>
<style src="./styles/admin.css" scoped></style>
