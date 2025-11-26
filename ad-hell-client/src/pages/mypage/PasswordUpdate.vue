<script setup>
import {ElMessage} from "element-plus";
import SendEmailForm from "@/components/features/account/SendEmailForm.vue";
import {reactive, ref, watch} from "vue";
import CommonModal from "@/components/common/CommonModal.vue";
import {updateMyInfoApi, updatePasswordApi} from "@/api/userApi.js";
import {useRouter} from "vue-router";
const router = useRouter();
const submitting = ref(false);
const errorMessage = ref('');
const labelPosition = ref('top');
const sendStatus = ref(false); // 이메일 인증
const isEmailVerified = ref(false); // 인증번호 확인
const formRef = ref(null); // validation (특정  필드 검증용)
const passwordUpdateForm = reactive({
  password : ''
  , passwordCheck : ''
  , email : ''

});
const rules = {
 password : [
    { required: true, message: '비밀번호를 입력하세요.', trigger: 'blur' },
    { min : 8, message: '비밀번호는 8자 이상이어야 합니다.', trigger: 'blur'}
  ], passwordCheck : [
    { required: true, message: '비밀번호 확인을 입력하세요.', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (value !== passwordUpdateForm.password) {
          return new Error('비밀번호와 일치하지 않습니다.');
        }

        return true;

      },trigger: ['blur', 'change']
    }
  ]
};

watch(() => passwordUpdateForm.password,() => {
  formRef.value?.validateField('passwordUpdateForm.password');
});

// 이메일 전송시 회원가입 btn 활성화
const handleSendStatus = (item) => {
  sendStatus.value = item.sendStatus;
  passwordUpdateForm.email = item.email;
  isEmailVerified.value = item.isEmailVerified;

}

const showModal = ref(false);
const confirmUpdate = () => {
  formRef.value.validate((valid) => {
    if(!valid) {
      return new Element('닉네임을 입력해주세요.');
    }
    showModal.value = true;
  });
}

const onConfirm = () => {
  passwordUpdate();
}

const onCancel = () => {
  console.log('취소 클릭됨')
}


const passwordUpdate= async () => {
  submitting.value = true;
  errorMessage.value = '';

  let payload = {
    password: passwordUpdateForm.password
  }

  try {

    const result = await updatePasswordApi(payload);
    ElMessage.success('수정되었습니다.');
    router.push({name : 'MainPage'});
  } catch (e) {
    console.log(e);
    errorMessage.value = e.message || '비밀번호 수정 중 오류가 발생했습니다.'
  } finally {
    submitting.value = false;
  }
}

</script>

<template>
  <div class="block">
    <el-form :label-position="labelPosition"
             label-width="100px"
             :model="passwordUpdateForm"
             :rules="rules"
             ref="formRef"
             @keydown.enter.prevent
    >
      <!-- 이메일 인증 -->
      <div class="from-div">
        <SendEmailForm
            @sendEmailData="handleSendStatus"
        />
      </div>

      <div class="input-div">
        <el-form-item label="비밀번호" class="input-form-label" prop="password">
          <div class="input-vertical">
            <el-input type="password"
                      v-model="passwordUpdateForm.password"
                      class="input-size-large"
                      placeholder="비밀번호를 입력해주세요."
            />
          </div>
        </el-form-item>
      </div>
      <div class="input-div">
        <el-form-item label="비밀번호 확인" class="input-form-label" prop="passwordCheck">
          <div class="input-vertical">
            <el-input type="password"
                      v-model="passwordUpdateForm.passwordCheck"
                      class="input-size-large"
                      placeholder="비밀번호를 입력해주세요."
            />
          </div>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button class="btn-xxlage-red"
                   :loading="submitting"
                   :disabled="!sendStatus"
                   @click="confirmUpdate"
        >
          비밀번호 재설정
        </el-button>
      </el-form-item>


    </el-form>
  </div>

  <CommonModal
      v-model="showModal"
      mode="confirm"
      message="비밀번호 재설정하시겠습니까?"
      confirm-text="확인"
      cancel-text="취소"
      @confirm="onConfirm"
      @cancel="onCancel"
  />
</template>
<style src="../account/styles/account.css" scoped></style>