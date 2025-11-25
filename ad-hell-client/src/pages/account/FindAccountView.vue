<script setup>
import SendEmailForm from "@/components/features/account/SendEmailForm.vue";
import {reactive, ref, watchEffect} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import LogoView from "@/components/features/account/LogoView.vue";
const labelPosition = ref('top');
const route = useRoute();
const router = useRouter();
const submitting = ref(false);
const errorMessage = ref('');
const pageText = ref(''); // 아이디 찾기, 비밀번호 찾기
const sendStatus = ref(false); // 이메일 인증
const isEmailVerified = ref(false); // 인증번호 확인
const formRef = ref(null); // validation (특정  필드 검증용)

// route로 아이디, 비밀번호 찾기 구분
watchEffect(() => {
  if (route.name === 'FindIdView') {
    pageText.value = '아이디 찾기';
  } else if (route.name === 'FindPasswordView') {
    pageText.value = '비밀번호 찾기';
  }
});

const AccountForm = reactive({
  email : ''
  , verifiedNumber : ''
  , loginId : ''
});


const handleSendStatus = (item) => {
  console.log(item.email);
  sendStatus.value = item.sendStatus;
  AccountForm.email = item.email;
  AccountForm.verifiedNumber = item.verifiedNumber;
  isEmailVerified.value = item.isEmailVerified;

}

const findAccount = async () => {
console.log("findAccount");
  submitting.value = true;
  errorMessage.value = '';

  let payload = {
    email : AccountForm.email
    , verifiedNumber : AccountForm.verifiedNumber
  }

  if (route.name === 'FindPasswordView') {
    payload.loginId = AccountForm.loginId;  // 아이디 추가
  }

  console.log(route.name);
  try {
    // const result = await loginApi(payload);
    // 페이지 이동
    if (route.name === 'FindIdView') {
      router.push({name : 'LookupIdView'});
    } else if (route.name === 'FindPasswordView') {
      router.push({name : 'LookupPasswordView'});
    }
  } catch (e) {
    console.log(e);
    errorMessage.value = e.message || `${pageText} 중 오류가 발생했습니다.`
  } finally {
    submitting.value = false;
  }

}


</script>

<template>
  <div class="block" >
    <LogoView />
    <div class="text-div">
      <span><strong>{{ pageText }}</strong></span>
    </div>

    <el-form :label-position="labelPosition"
        :model="AccountForm"
        @submit.prevent="findAccount"
        ref="formRef"

    >
      <div class="input-div" v-if="route.name === 'FindPasswordView'">
        <el-form-item label="아이디" class="input-form-label" prop="loginId" >
          <div class="input-vertical">
            <el-input type="text"
                      v-model="AccountForm.loginId"
                      class="input-size-large"
                      placeholder="아이디를 입력해주세요."
            />
          </div>
        </el-form-item>
      </div>
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
          {{ pageText }}
        </el-button>
      </el-form-item>
    </el-form>
    <div class="text-div">
      <router-link :to="{ name: 'UserLoginView' }"><span class="font-small-red">로그인</span></router-link>
    </div>
  </div>

</template>
<style src="./styles/account.css" scoped></style>