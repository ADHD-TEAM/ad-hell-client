<script setup>
import {reactive, ref, watch} from "vue";
import SendEmailForm from "@/components/features/account/SendEmailForm.vue";
import LogoView from "@/components/features/account/LogoView.vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
const router = useRouter();
const submitting = ref(false);
const errorMessage = ref('');
const labelPosition = ref('top');
const passwordCheck = ref('');  // 비밀번호 확인
const sendStatus = ref(false); // 이메일 인증
const isEmailVerified = ref(false); // 인증번호 확인
const formRef = ref(null); // validation (특정  필드 검증용)
const signUpForm = reactive({
  loginId : ''
  , password : ''
  , passwordCheck : ''
  , nickname : ''
  , email : ''

});


// 이메일 전송시 회원가입 btn 활성화
const handleSendStatus = (item) => {
  console.log(item.email);
  sendStatus.value = item.sendStatus;
  signUpForm.email = item.email;
  isEmailVerified.value = item.isEmailVerified;

}

const rules = {
  loginId : [
    { required: true, message: '아이디를 입력하세요.', trigger: 'blur' },
    { min : 3, message: '아이디는 3글자 이상이어야 합니다.', trigger: 'blur'},
    { min : 3, max : 30, message: '아이디는 30자 내외여야 합니다.', trigger: 'blur'},
    {
      validator: async (rule, value) => {
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
  ], password : [
    { required: true, message: '비밀번호를 입력하세요.', trigger: 'blur' },
    { min : 8, message: '비밀번호는 8자 이상이어야 합니다.', trigger: 'blur'}
  ], passwordCheck : [
    { required: true, message: '비밀번호 확인을 입력하세요.', trigger: 'blur' },
    {
      validator: (rule, value) => {
        console.log(rule);
        console.log(value);

        if (value !== signUpForm.password) {
          return new Error('비밀번호와 일치하지 않습니다.');
        }

        return true;

      },trigger: ['blur', 'change']
    }
  ], nickname : [
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
};

watch(() => passwordCheck, () => {
  formRef.value?.validateField('signUpForm.password');
});

const signUpApi = async () => {
  submitting.value = true;
  errorMessage.value = '';

  const payload = {
    loginId : signUpForm.loginId
    , password : signUpForm.password
    , nickname : signUpForm.nickname
    , email : signUpForm.email
  }

  try {

    // const result = await loginApi(payload);
    ElMessage.success('회원가입 되었습니다.');
    router.push({name : 'UserLoginView'});
  } catch (e) {
    console.log(e);
    errorMessage.value = e.message || '회원가입 중 오류가 발생했습니다.'
  } finally {
    submitting.value = false;
  }
};


const signUp = () => {
  // rules 체크
  formRef.value.validate((valid) => {
    if(!valid) {
      return new Element('입력 폼이 맞지않습니다. 다시 입력해주세요.');
    }
    // 인증번호가 맞는지 체크
    if (!isEmailVerified.value) {
      return new Element('인증번호가 맞지않습니다.');
    }

    // 회원가입
    signUpApi();
  })

};

</script>
<template>
  <div class="block" >

    <LogoView />
    <div class="text-div">
      <span><strong>회원가입</strong></span>
    </div>

      <el-form :label-position="labelPosition"
               label-width="100px"
               :model="signUpForm"
               @submit.prevent="signUp"
               :rules="rules"
               ref="formRef"
               @keydown.enter.prevent
      >

        <div class="input-div">
          <el-form-item label="아이디" class="input-form-label" prop="loginId" >
            <div class="input-vertical">
              <el-input type="text"
                  v-model="signUpForm.loginId"
                  class="input-size-large"
                  placeholder="아이디를 입력해주세요."
                  @blur="() => formRef.value?.validateField('loginId')"
              />
            </div>
          </el-form-item>
        </div>
        <div class="input-div">
          <el-form-item label="닉네임" class="input-form-label" prop="nickname">
            <div class="input-vertical">
              <el-input type="text"
                  v-model="signUpForm.nickname"
                  class="input-size-large"
                  placeholder="닉네임를 입력해주세요."
                  @blur="() => formRef.value?.validateField('nickname')"
              />
            </div>
          </el-form-item>
        </div>
        <div class="input-div">
          <el-form-item label="비밀번호" class="input-form-label" prop="password">
            <div class="input-vertical">
              <el-input type="password"
                  v-model="signUpForm.password"
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
                  v-model="signUpForm.passwordCheck"
                  class="input-size-large"
                  placeholder="비밀번호를 입력해주세요."
              />
            </div>
          </el-form-item>
        </div>
        <!-- 이메일 인증 -->
        <div class="from-div">
          <SendEmailForm
              @sendEmailData="handleSendStatus"
          />
        </div>
        <el-form-item>
          <el-button native-type="submit"
                     class="btn-xxlage-red"
                     :loading="submitting"
                     :disabled="!sendStatus"
          >
            회원가입
          </el-button>
        </el-form-item>

      </el-form>

    <div class="text-div">
      <router-link :to="{ name: 'UserLoginView' }"><span class="font-small-red">로그인</span></router-link>
    </div>
  </div>
</template>
<style src="./styles/account.css" scoped></style>