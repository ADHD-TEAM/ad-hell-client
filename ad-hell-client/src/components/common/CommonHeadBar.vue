<template>
  <!-- Element Plus 헤더 컴포넌트 -->
  <el-header class="app-header">
    <!-- 실제 규격 1280 * 56을 맞추는 내부 컨테이너 -->
    <div class="header-inner">
      <!-- 왼쪽 영역 (로고/타이틀 등) -->
      <div class="header-left">
        <span class="logo-text">AD-HELL</span>
      </div>

      <!-- 오른쪽 영역 (메뉴, 버튼 등) -->
      <div class="header-right">
        <!-- Element Plus 버튼들 예시 -->
        <el-button type="text">알림</el-button>
        <el-button type="primary">로그인</el-button>
      </div>
    </div>
  </el-header>
</template>

<script setup>
// 로직 필요 없으면 비워둬도 됨
</script>

<style scoped>
/* el-header 기본 높이가 60px이라 56px로 맞춰줌 */
.app-header {
  padding: 0;                    /* el-header의 기본 padding 제거 */
  background-color: #ffffff;
  border-bottom: 1px solid #ebeef5; /* Element Plus 스타일 비슷하게 */
  display: flex;
  justify-content: center;       /* 가운데에 1280 컨테이너 정렬 */
}

/* 실제 규격: 1280 x 56 + 좌우 패딩 30 */
.header-inner {
  width: 1280px;
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
  gap: 0;                        /* 버튼 간격도 0 기준 */
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
</style>