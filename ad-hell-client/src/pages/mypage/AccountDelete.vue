<script setup>
import LogoView from "@/components/features/account/LogoView.vue";
import {reactive, ref, watch} from "vue";
const router = useRouter();
import CommonModal from "@/components/common/CommonModal.vue";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
const submitting = ref(false);
const errorMessage = ref('');
const formRef = ref(null); // validation (특정  필드 검증용)
const accountDeleteForm = reactive({
  password : ''
  , passwordCheck : ''

});

const rules = {
  password : [
    { required: true, message: '비밀번호를 입력하세요.', trigger: 'blur' },
    { min : 8, message: '비밀번호는 8자 이상이어야 합니다.', trigger: 'blur'}
  ], passwordCheck : [
    { required: true, message: '비밀번호 확인을 입력하세요.', trigger: 'blur' },
    {
      validator: (rule, value) => {
        console.log(rule);
        console.log(value);

        if (value !== accountDeleteForm.password) {
          return new Error('비밀번호와 일치하지 않습니다.');
        }

        return true;

      },trigger: ['blur', 'change']
    }
  ]
};

watch(() => accountDeleteForm.password,() => {
  formRef.value?.validateField('accountDeleteForm.password');
});

function cancelBtn() {
  router.push({name : 'MainPage'});
}

const showModal = ref(false);
const confirmDelete = () => {
  formRef.value.validate((valid) => {
    if(!valid) {
      return new Element('비밀번호를 다시 확인해주세요.');
    }
    showModal.value = true;
  });

}
const onConfirm = () => {
  accountDelete();
}

const onCancel = () => {
  console.log('취소 클릭됨')
}

const accountDelete= () => {
  submitting.value = true;
  errorMessage.value = '';

  try {

    // const result = await loginApi(payload);
    ElMessage.success('회원 탈퇴되었습니다.');
    router.push({name : 'MainPage'});
  } catch (e) {
    console.log(e);
    errorMessage.value = e.message || '회원탈퇴 중 오류가 발생했습니다.'
  } finally {
    submitting.value = false;
  }

}

</script>

<template>
  <div class="block">
    <LogoView />
    <div class="text-div">
      <span><strong>회원탈퇴</strong></span>
    </div>

    <div class="lookup-div">
      <span>회원 탈퇴 시 모든 정보가 삭제되며 복구가 불가능합니다.</span>
      <span>탈퇴를 원하신다면 비밀번호를 입력해주세요.</span>
    </div>

  <el-form :model="accountDeleteForm"
           :rules="rules"
           ref="formRef"
           @keydown.enter.prevent
  >
  <div class="input-div">
    <el-form-item class="input-form-label" prop="password">
      <div class="input-vertical">
        <el-input type="password"
                  v-model="accountDeleteForm.password"
                  class="input-size-large"
                  placeholder="비밀번호를 입력해주세요."
        />
      </div>
    </el-form-item>
  </div>
  <div class="input-div">
    <el-form-item  class="input-form-label" prop="passwordCheck">
      <div class="input-vertical">
        <el-input type="password"
                  v-model="accountDeleteForm.passwordCheck"
                  class="input-size-large"
                  placeholder="한번더 비밀번호를 입력해주세요."
        />
      </div>
    </el-form-item>
  </div>
    <el-form-item>
      <el-button class="btn-large-white"
                 :loading="submitting"
                 @click="confirmDelete"

      >
        회원탈퇴
      </el-button>
      <el-button class="btn-large-red"
                @click="cancelBtn"
      >
        취소
      </el-button>
    </el-form-item>
  </el-form>
  </div>

  <CommonModal
      v-model="showModal"
      mode="confirm"
      message="정말 탈퇴하시겠습니까?"
      confirm-text="확인"
      cancel-text="취소"
      @confirm="onConfirm"
      @cancel="onCancel"
  />
</template>
<style src="../account/styles/account.css" scoped></style>