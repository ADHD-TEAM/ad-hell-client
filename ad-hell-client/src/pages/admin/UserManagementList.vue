<script setup>
import UserSearchBar from "@/components/features/admin/UserSearchBar.vue";
import {onMounted, reactive, ref} from "vue";
import DataTable from "@/components/common/DataTable.vue";
import {USER_STATUS_TAG} from "@/styles/js/statusTag.js"
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import Pagination from "@/components/common/Pagination.vue";
import CommonButton from "@/components/common/CommonButton.vue";
const router = useRouter();
const submitting = ref(false);
const errorMessage = ref('');
const page = ref('');
const totalPages = ref('');

const userSearchBar = reactive({
  id : null
  ,role : ''
  , userLoginId : ''
  , nickname : ''
  , email : ''
  , status : ''
});

// reactive로 변경 하기
const userInfo = [
  { id: 1, role : '관리자',userLoginId: '홍길동', nickname: '홍길동',email: 'hong@test.com', status: 'active' },
  { id: 2, role : '회원',userLoginId: '김철수', nickname: '홍길동',email:'kim@test.com', status: 'deactive' },
  { id: 3, role : '회원', userLoginId: '김철수', nickname: '홍길동',email:'kim@test.com', status: 'withdraw' },
]

const search = () => {
  submitting.value = true;
  errorMessage.value = '';

  try {

    // const result = await loginApi(userSearchBar);
    // TODO : 리스트를 userInfo에 넣어주기

    console.log(userSearchBar);



  } catch (e) {
    console.log(e);
    errorMessage.value = e.message || '회원 목록을 불러오는 중 오류가 발생했습니다.'
  } finally {
    submitting.value = false;
  }

}

function goDetail(id) {
  console.log(id)
  router.push({name : 'UserDetailUpdate', params: { id : id}});
}

onMounted(() => {
  // list 가져오기
  // search();
  // 가져온 리스트 totalPages 넣어주기
})
</script>

<template>
  <div class="admin-userManagement">
    <h3>회원관리</h3>

    <!--  검색 바  -->
    <UserSearchBar
    :user-search-bar="userSearchBar"
    @search="search"/>

    <!-- 테이블 -->
    <DataTable :data="userInfo" @select="goDetail">
      <el-table-column prop="role" label="권한" />
      <el-table-column prop="userLoginId" label="아이디" />
      <el-table-column prop="nickname" label="닉네임" />
      <el-table-column prop="email" label="이메일" />
      <el-table-column prop="status" label="상태">
        <template #default="{ row }">
          <el-tag :type="USER_STATUS_TAG[row.status]?.type || ''">
            {{ USER_STATUS_TAG[row.status]?.label || row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </DataTable>
    <!-- 페이지 네이션 -->
    <div class="board-bottom-row">
      <div class="bottom-left">
      </div>
    </div>

  </div>
</template>
<style src="./styles/admin.css" scoped></style>
<style src="../../styles/css/searchbar.css" scoped></style>