<script setup>
import {reactive, ref, watchEffect} from "vue";
import {useRoute, useRouter} from "vue-router";
import { ElMessage } from 'element-plus';
import { loginApi } from '@/api/authApi.js'
const labelPosition = ref('top');
const route = useRoute();
const router = useRouter();
const mode = ref('user');
const modeId = ref('아이디');
const submitting = ref(false);
const errorMessage = ref('');

// route로 user, admin 인지 구분
watchEffect(() => {
  mode.value = route.name === 'AdminLoginView' ? 'admin' : 'user';
  modeId.value = route.name === 'AdminLoginView' ? '관리자 아이디' : '아이디';
});

const loginForm = reactive({
  loginId : ''
  , password : ''
});

// login
const login = async () => {

  submitting.value = true;
  errorMessage.value = '';

  try {
    const result = await loginApi(loginForm);
    ElMessage.success('로그인 되었습니다.');

    if (mode.value === 'user') {
      router.push({name : 'MainPage'});

    } else if (mode.value === 'admin') {
      router.push({name : 'AdminMainPage'});
    }
  } catch (e) {
    console.log(e);
    errorMessage.value = e.message || '로그인 중 오류가 발생했습니다.'
  } finally {
    submitting.value = false;
  }

};

</script>
<template>
  <div class="block">
    <router-link :to="{ name: 'MainPage' }">
      <div class="logo">
        <span class="logo-text">ADHD</span>
        <span >:광고당했대</span>
      </div>
    </router-link>

    <el-form :label-position="labelPosition"
             label-width="100px"
             :model="loginForm"
             @submit.prevent="login"
    >
      <div class="input-div">
        <el-form-item :label="modeId" class="input-form-label">
          <div class="input-vertical">
            <el-input
                v-model="loginForm.loginId"
                class="input-size-large"
                placeholder="아이디를 입력해주세요."
            />
            <!--            <span class="font-small-red">아이디를 입력해주세요.</span>-->
          </div>
        </el-form-item>
      </div>

      <div class="input-div">
        <el-form-item label="비밀번호" class="input-form-label">
          <div class="input-vertical">
            <el-input
                v-model="loginForm.password"
                class="input-size-large"
                placeholder="비밀번호를 입력해주세요."
            />
            <!--          <span class="font-small-red">아이디를 입력해주세요.</span>-->
          </div>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button native-type="submit"
                   class="btn-xxlage-red"
                   :loading="submitting"
        >
          로그인
        </el-button>
      </el-form-item>
    </el-form>


    <div>
      <div class="text-div" v-if="mode === 'user'">
        <div>
          <router-link :to="{ name: 'RecoverAccountView' }"><span class="font-small-red">아이디 찾기</span></router-link>
          <span class="font-small-red">/</span>
          <router-link :to="{ name: 'RecoverAccountView' }"><span class="font-small-red">비밀번호 찾기</span></router-link>
        </div>
        <router-link :to="{ name: 'SignUpView' }"><span class="font-small-red">회원가입</span></router-link>
      </div>

      <div v-if="mode === 'admin'">
        <span class="font-small-red">관리자 전용 페이지입니다.</span>
      </div>
    </div>
  </div>

</template>
<style src="./styles/account.css" scoped></style>