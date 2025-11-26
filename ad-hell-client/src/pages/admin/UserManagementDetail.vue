<script setup xmlns="http://www.w3.org/1999/html">

import CommonButton from "@/components/common/CommonButton.vue";
import DetailTable from "@/components/features/admin/DetailTable.vue";
import {ref} from "vue";
import UpdateTable from "@/components/features/admin/UpdateTable.vue";
import CommonModal from "@/components/common/CommonModal.vue";
const pageToggle = ref(true); // true : detail , false : update

const userDetail = {
  no : 1
  , role : '회원'
  , userLoginId : 'userLoginId'
  , nickname : 'nickname'
  , email : 'test@test.com'
  , status : 'active'
  , createdAt : '2025-01-25'
  , deactivedAt : '2025-01-25'
  , deletedAt : '2025-01-25'
};
const showModal = ref(false);
const pageToggleBtn = () => {

  if (pageToggle.value == false) {
    // 수정일 때
    showModal.value = true;

  } else {
    // 상세 일때
    pageToggle.value = !pageToggle.value;
  }
}

const updateBtn = () => {
  // 업데이트는 blur/ change event로 셋다 null이 아닐 경우 emit으로 값을 계속 넘겨줌
  // true 일 경우 update 가능, false 일 경우 update 안됨!
  // 메세지 띄워주기!!
  alert("수정");
  // true 일경우 수정하면서 페이지 전환 해주기
  //pageToggle.value = !pageToggle.value;
}

const onConfirm = () => {
 console.log('취소합니다.');
  pageToggle.value = !pageToggle.value;
}

const onCancel = () => {
  console.log('취소 클릭됨')
}

</script>

<template>
  <div class="admin-userManagement">
    <h3>회원관리</h3>

      <!--  nav 바  -->


      <!--  table  -->
    <!-- 여기서 data 가져온 후에 detailTable에 내려주기 -->
      <DetailTable v-if="pageToggle"
        :user="userDetail"/>

      <UpdateTable v-else
         :user="userDetail"
      />
    <div class="btn-div">
      <CommonButton
          v-if="!pageToggle"
          type="update"
          :width="80"
          @click="updateBtn"
      />
      <CommonButton
          :type="pageToggle ? 'update' : 'cancel'"
          :width="80"
          @click="pageToggleBtn"
      />
    </div>
  </div>

  <CommonModal
      v-model="showModal"
      mode="confirm"
      message="정말 취소하시겠습니까?"
      confirm-text="확인"
      cancel-text="취소"
      @confirm="onConfirm"
      @cancel="onCancel"
  />
</template>
<style src="./styles/admin.css" scoped></style>
