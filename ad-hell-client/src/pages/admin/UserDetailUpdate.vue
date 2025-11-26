<script setup>
import DetailTable from "@/components/features/admin/DetailTable.vue";
import CommonButton from "@/components/common/CommonButton.vue";
import UpdateTable from "@/components/features/admin/UpdateTable.vue";
import {ref} from "vue";
import CommonModal from "@/components/common/CommonModal.vue";
import {useRoute, useRouter} from "vue-router";
const router = useRouter();
const pageToggle = ref(true); // true : detail , false : update
const cancelShowModal = ref(false);
const updateShowModal = ref(false);
const userId = Number(useRoute().params.id); // userId로 userDetail 정보 가져오기
const userDetail = {
  no : userId
  , role : '회원'
  , userLoginId : 'userLoginId'
  , nickname : 'nickname'
  , email : 'test@test.com'
  , status : 'active'
  , createdAt : '2025-01-25'
  , deactivedAt : '2025-01-25'
  , deletedAt : '2025-01-25'
};
const pageToggleBtn = () => {

  if (pageToggle.value == false) {
    // 수정일 때
    cancelShowModal.value = true;

  } else {
    // 상세 일때
    pageToggle.value = !pageToggle.value;
  }
}

const onConfirm = () => {
  console.log('취소합니다.');
  pageToggle.value = !pageToggle.value;
}

const onCancel = () => {
  console.log('취소 클릭됨')
}


const confirmUpdateBtn = () => {

  // 업데이트는 blur/ change event로 셋다 null이 아닐 경우 emit으로 값을 계속 넘겨줌

  // true 일 경우 update 가능, false 일 경우 update 안됨!
  //  true: 모달창 띄워주기
  updateShowModal.value = true;

  //  false: 모달창 띄워주기

}

const onUpdate = () => {
  // 수정 page -> 상세 page 이동
  pageToggle.value = !pageToggle.value;
}

const goList = () => {
  router.push({name : 'UserManagementList'});
}
</script>

<template>
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
        @click="confirmUpdateBtn"
    />

    <CommonButton
        :type="pageToggle ? 'update' : 'cancel'"
        :width="80"
        @click="pageToggleBtn"
    />

    <CommonButton
        v-if="pageToggle"
        type="list"
        :width="80"
        @click="goList"
    />
  </div>

  <CommonModal
      v-model="cancelShowModal"
      mode="confirm"
      message="정말 취소하시겠습니까?"
      confirm-text="확인"
      cancel-text="취소"
      @confirm="onConfirm"
      @cancel="onCancel"
  />

  <CommonModal
      v-model="updateShowModal"
      mode="confirm"
      message="정말 수정하시겠습니까?"
      confirm-text="확인"
      cancel-text="취소"
      @confirm="onUpdate"
      @cancel="onCancel"
  />
</template>
<style src="./styles/admin.css" scoped></style>