<script setup>
import { ref } from "vue";
import {mypageNav , mypageNavSub} from './mypageNav.js';
import {useRouter} from "vue-router";
const router = useRouter();
// nav sub 가져오기
function getNavSub(index) {
  const result = mypageNavSub.filter(item => item.tab === index);
  navSubStatus.value = result.length > 0;
  return result;
}

function getTab(index) {

}

const activeIndex = ref(1); // nav
const activeSubIndex = ref(1);
const navSubStatus = ref(true); // nav 상태
const navSub = ref(getNavSub(1)); // nav sub

function handleNavClick(item) {

  if (activeIndex.value === item.index) {
    activeSubIndex.value = 1;
  }

  activeIndex.value = item.index;
  navSub.value = getNavSub(item.index);
  if (item.linkTo) {
    router.push(item.linkTo);
  }
}
function handleNavSubClick(item) {
  activeSubIndex.value = item.index;
  if (item.linkTo) {
    router.push(item.linkTo);
  }
}

</script>

<template>
  <!-- nav -->
  <div>
    <el-menu
        :default-active="activeIndex"
        mode="horizontal"
    >
      <template v-for="item in mypageNav" :key="item.index">
        <el-menu-item :index="item.index"
                @click="() => handleNavClick(item)"
        >
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
          @click="() => handleNavSubClick(item)"
      >
        <strong>{{ item.title }}</strong>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<style scoped>
:deep(.el-menu--horizontal) {
  display: flex;
  justify-content: center;   /* 메뉴 전체 중앙 정렬 */
  white-space: nowrap;       /* 메뉴 줄바꿈 금지 */
  overflow: visible !important; /* 메뉴 숨김 방지 */
}

:deep(.el-menu-item) {
  flex-shrink: 0;   /* 아이템 줄어들지 않도록 */
  padding: 0 20px;  /* 메뉴 아이템 간 간격 조절 */
}

:deep(.el-menu-item.is-active::after) {
  width: 50%;       /* 활성 메뉴 밑줄 길이 */
  left: 25%;        /* 밑줄 중앙 정렬 */
  transition: width 0.3s, left 0.3s; /* 부드러운 애니메이션 */
}
</style>
