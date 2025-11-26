<script setup>
import {reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import {regEmail} from "@/utils/format.js";
import {sendEmailbyCode} from "@/api/authApi.js"
const submitting = ref(false);
const errorMessage = ref('');
const labelPosition = ref('top');
const email = ref('');
const verifiedNumber = ref(null);
const sendEmailStatus = ref(false); // 이메일 인증
const isEmailVerified = ref(false); // 인증번호 확인
const emits = defineEmits(['sendStatus']);
const findStatus = ref(false);
const formRef = ref(null); // validation (특정  필드 검증용)
const localData = reactive(({
  sendStatus : sendEmailStatus
  , email : email
  , isEmailVerified : isEmailVerified
  , verifiedNumber : null
}))

const emialDataEmit = () => {
  emits('sendEmailData', {
    sendStatus: sendEmailStatus.value,
    email: localData.email,
    isEmailVerified: isEmailVerified.value,
    verifiedNumber: localData.verifiedNumber
  });
}
const timer = ref(300); // 5분 = 300초
let timerInterval = null;

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval); // 중복 실행 방지
  timer.value = 300; // 최기화
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }, 1000);
};

const formatTime = (seconds) => {
  const sec = seconds.value ?? seconds;
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

const sendEmail = async ()  => {
  submitting.value = true;
  errorMessage.value = '';
  if (!email.value) {
    ElMessage.error('이메일을 입력해주세요.');
    return;
  }

  if (!regEmail(email.value)) {
    return;
  }

  // TODO
  sendEmailStatus.value = true;
  emialDataEmit();
  try {
    // 1. 이메일 보내기
    let payload = {email : localData.email};
    const result = await sendEmailbyCode(payload);
    ElMessage.info('입력하신 이메일로 인증번호 발송했습니다. 인증번호를 입력해주세요.');

    // 2. 인증번호 input 활성화
    findStatus.value = true;

    // 3. 5분 타이머 시작
    startTimer();

  } catch (e) {
    console.log(e);
    errorMessage.value = e.message || '인증번호 보내기 중 오류가 발생했습니다.'
  }
};

const rules = {
  email : [
    // { required: true, message: '이메일을 입력하세요.', trigger: 'blur' },
    { validator: (rule, value) => {
        if (!regEmail(value)) {
          return new Error('이메일 형식에 맞춰 입력해주세요.');
        }

        return true;
      }, trigger: 'change'
    }
  ]
  , verifiedNumber : [
    { required: true, message: '인증번호를 입력하세요.', trigger: 'blur' },
  ]
}

watch(() => verifiedNumber, () => {
  formRef.value?.validateField('localData.verifiedNumber');
});

// 인증번호 체크 보내주기
const checkVerified = () => {

  emits('sendEmailData', {
    sendStatus: sendEmailStatus.value,
    email: localData.email,
    isEmailVerified: isEmailVerified.value,
    verifiedNumber: localData.verifiedNumber
  });
}

</script>

<template>
  <el-form :label-position="labelPosition"
           label-width="100px"
           @submit.prevent
           :rules="rules"
           :model="localData"
           ref="formRef"
  >
    <div class="input-div">
      <el-form-item label="이메일 인증" class="input-form-label" prop="email">
        <div class="input-vertical-center">
          <el-input
              type="email" v-model="localData.email"
                    placeholder="이메일를 입력해주세요."
          />
          <el-button class="btn-medium"
                     @mousedown.prevent.stop
                     @click="sendEmail"
          >
            이메일 인증
          </el-button>
        </div>
      </el-form-item>
      <el-form-item  v-if="sendEmailStatus" prop="verifiedNumber">
          <div class="input-vertical-center" >
            <el-input v-model="localData.verifiedNumber"
                      @blur="checkVerified"
                      placeholder="인증번호"
            />
          </div>
          <div class="text-left">
            <span class="font-small-red">{{ formatTime(timer) }}</span>
          </div>
      </el-form-item>
    </div>
  </el-form>
</template>
<style src="../../../pages/account/styles/account.css" scoped></style>