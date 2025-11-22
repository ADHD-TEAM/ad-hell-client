<script setup>
import { ref } from "vue";
import {mypageNav , mypageNavSub} from './mypageNav.js';

// nav sub 가져오기
function getNavSub(index) {
  const result = mypageNavSub.filter(item => item.tab === index);
  navSubStatus.value = result.length > 0;
  console.log(navSubStatus.value);
  console.log(result);
  return result;
}

const activeIndex = ref(1); // nav
const activeSubIndex = ref(1);
const navSubStatus = ref(true); // nav 상태
const navSub = ref(getNavSub(1)); // nav sub

// nav 선택시 nav sub 보여주기
const mypageNavHandleSelect = (index) => {
  activeIndex.value = index;
  navSub.value = getNavSub(index);
  // TODO : 나중에 router로 페이지 이동 시켜주기
};

const mypageNavSubHandleSelect = (index) => {
  activeSubIndex.value = index;
  // TODO : 나중에 router로 페이지 이동 시켜주기
}
</script>

<template>
  <!-- nav -->
  <div class="mypage-nav">
    <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="mypageNavHandleSelect"
    >
      <template v-for="item in mypageNav" :key="item.index">
        <el-menu-item :index="item.index">
          <strong>{{ item.title }}</strong>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
  <!-- nav-sub -->
  <div v-if="navSubStatus">
    <el-menu :default-active="activeSubIndex" mode="horizontal">
      <el-menu-item
          v-for="item in navSub"
          :key="item.index"
          :index="item.index"
          @select="mypageNavSubHandleSelect"
      >
        <strong>{{ item.title }}</strong>
      </el-menu-item>
    </el-menu>
  </div>
</template>
