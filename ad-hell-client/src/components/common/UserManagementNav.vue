<script setup>
import {userManagerNav} from "@/components/common/mypageNav.js";
import {useRouter} from "vue-router";
import {ref} from "vue";
const activeIndex = ref(1); // nav
const router = useRouter();

function handleNavClick(item) {
  activeIndex.value = item.index;
  if(item.linkTo) {
    router.push(item.linkTo);
  }
}

</script>

<template>
  <div class="nav-box">
    <el-menu
        :default-active="activeIndex"
        mode="horizontal"
    >
      <template v-for="item in userManagerNav" :key="item.index">
        <el-menu-item :index="item.index"
                      @click="() => handleNavClick(item)"
        >
          <strong>{{ item.title }}</strong>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.nav-box {
  height: 150px;
}
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