<script setup>
import CommonButton from "@/components/common/CommonButton.vue";
const props = defineProps({
  userSearchBar: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['search'])
const { userSearchBar } = props
</script>

<template>
  <div class="board-search-box">
    <div class="search-inner">

      <el-form
          :model="userSearchBar"
          label-position="top"
          class="search-form"
      >
        <div class="search-grid">

          <el-form-item label="권한">
            <el-select v-model="userSearchBar.role" clearable>
              <el-option label="전체" value=""/>
              <el-option label="회원" value="user"/>
              <el-option label="관리자" value="admin"/>
            </el-select>
          </el-form-item>
          <el-form-item label="아이디">
            <el-input type="text"
                v-model="userSearchBar.userLoginId"
                placeholder="아이디"
                clearable
            />
          </el-form-item>

          <el-form-item label="닉네임">
            <el-input
                v-model="userSearchBar.nickname"
                placeholder="닉네임"
                clearable
            />
          </el-form-item>

          <el-form-item label="이메일">
            <el-input
                v-model="userSearchBar.email"
                placeholder="이메일"
                clearable
            />
          </el-form-item>

          <el-form-item label="회원 상태">
            <el-select v-model="userSearchBar.status" clearable>
              <el-option label="전체" value=""/>
              <el-option label="활성화" value="active"/>
              <el-option label="비활성화" value="deactive"/>
              <el-option label="탈퇴" value="withdraw"/>
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <div class="search-actions">
        <CommonButton type="search" @click="emit('search')" />
      </div>

    </div>
  </div>

</template>
<style src="@/styles/css/searchbar.css" scoped></style>