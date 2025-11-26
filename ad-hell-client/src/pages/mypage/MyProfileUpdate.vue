<script setup>
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import CommonModal  from "@/components/common/CommonModal.vue";
import {
  fetchMyPushSetting,
  updateMyPushSetting,
} from '@/api/notificationApi.js'
import {useRouter} from "vue-router";

const router = useRouter()

const formRef = ref(null); // validation (특정  필드 검증용)
const submitting = ref(false);
const errorMessage = ref('');
const labelPosition = ref('top');
const updateForm = reactive({
  nickname : ''
  , notificationStatus : 'on'

});
const rules = {
  nickname : [
    { required: true, message: '닉네임을 입력하세요.', trigger: 'blur' },
    { min : 1, max : 30, message: '닉네임은 30자 내외여야 합니다.', trigger: 'blur'},
    {
      validator: async (rule, value) => {
        console.log(value)
        if (!value) return true; // 빈 값이면 다른 rule에서 처리
        try {
          //  const res = await fetch(`/api/check-loginId?value=${value}`);
          //  const data = await res.json();
          const data = {
            available : true
          }
          if (!data.available) {
            return new Error('이미 사용 중인 아이디입니다.');
          }

          return true;
        } catch (e) {
          return new Error('서버 확인 중 오류가 발생했습니다.');
        }
      },
      trigger: 'blur'
    }
  ]
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
  userInfoUpdate();
}

const onCancel = () => {
  console.log('취소 클릭됨')
}

// ===== 페이지 진입 시 초기값 세팅 =====
onMounted(async () => {
  try {
    // 푸시 알림 설정 조회 → 라디오에 반영
    const pushStatus = await fetchMyPushSetting()
    // pushStatus.pushEnabled: true/false 라고 가정
    updateForm.notificationStatus = pushStatus.pushEnabled ? 'on' : 'off'
  } catch (e) {
    console.error('[MyPage] push setting 조회 실패', e)
    // 실패하면 기본값 'on' 그대로 사용
  }
})

const userInfoUpdate= async () => {
  submitting.value = true;
  errorMessage.value = '';

  try {

    // 알림 수신 여부(on/off)
    await updateMyPushSetting(updateForm.notificationStatus)

    // const result = await loginApi(payload);
    ElMessage.success('수정되었습니다.');
    router.push({name : 'UserLoginView'});
  } catch (e) {
    console.log(e);
    errorMessage.value = e.message || '회원 수정 중 오류가 발생했습니다.'
  } finally {
    submitting.value = false;
  }

}

</script>

<template>
  <div class="block">
    <el-form :label-position="labelPosition"
             label-width="100px"
             :model="updateForm"
             :rules="rules"
             ref="formRef"
             @keydown.enter.prevent
    >

      <div class="input-div">
        <el-form-item label="아이디" class="input-form-label" prop="loginId" >
          <div class="input-vertical">
            <el-input type="text"
                      class="input-size-large"
                      placeholder="adhell"
                      disabled
            />
          </div>
        </el-form-item>
      </div>
      <div class="input-div">
        <el-form-item label="닉네임" class="input-form-label" prop="nickname">
          <div class="input-vertical">
            <el-input type="text"
                      v-model="updateForm.nickname"
                      class="input-size-large"
                      placeholder="닉네임을 입력해주세요."
                      @blur="() => formRef.value?.validateField('nickname')"
            />
          </div>
        </el-form-item>
      </div>
      <div class="input-div">
        <el-form-item label="이메일" class="input-form-label" prop="email">
          <div class="input-vertical">
            <el-input type="email"
                      class="input-size-large"
                      disabled
            />
          </div>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="알림 수신 여부" class="input-form-label" prop="gender">
          <el-radio-group v-model="updateForm.notificationStatus">
            <el-radio label="on">on</el-radio>
            <el-radio label="off">off</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button class="btn-xxlage-red"
                   @click="confirmUpdate"
        >
          회원 정보 수정
        </el-button>
      </el-form-item>
    </el-form>

    <div>
      <router-link :to="{name : 'AccountDelete'}">
      <span class="font-small">회원탈퇴</span>
      </router-link>
    </div>
  </div>

  <CommonModal
      v-model="showModal"
      mode="confirm"
      message="정말 수정하시겠습니까?"
      confirm-text="확인"
      cancel-text="취소"
      @confirm="onConfirm"
      @cancel="onCancel"
  />

</template>
<style src="../account/styles/account.css" scoped></style>