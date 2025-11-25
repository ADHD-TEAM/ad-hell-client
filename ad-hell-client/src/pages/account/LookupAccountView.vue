<script setup lang="ts">
import LogoView from "@/components/features/account/LogoView.vue";
import {ref , watchEffect} from "vue";
import {useRoute, useRouter} from "vue-router";
const pageText = ref(''); // 아이디 찾기, 비밀번호 찾기
const route = useRoute();
const router = useRouter();

// route로 아이디, 비밀번호 찾기 구분
watchEffect(() => {
  console.log(route.name);
  if (route.name === 'LookupIdView') {
    pageText.value = '아이디 찾기 완료';
  } else if (route.name === 'LookupPasswordView') {
    pageText.value = '비밀번호 재설정 완료';
  }
});

const goLoginPage = () => {
  router.push({name : 'UserLoginView'});
}

</script>

<template>
  <div class="block" >
    <LogoView />
    <div class="text-div">
      <span><strong>{{ pageText }}</strong></span>
    </div>

    <div class="lookup-div" v-if="route.name === 'LookupIdView'">
      <span>회원님이 가입하신 아이디는 아래와 같습니다.</span>

      <div class="lookup-id-div">
        ad***111
      </div>
    </div>

    <div class="lookup-div" v-if="route.name === 'LookupPasswordView'">
      <span>비밀번호가 성공적으로 변경되었습니다.</span>
      <span>새로운 비밀번호로 로그인할 수 있습니다.</span>
    </div>



    <el-button native-type="submit"
               class="btn-xxlage-red"
               @click="goLoginPage"
    >
      로그인하러 가기
    </el-button>
  </div>
</template>

<style src="./styles/account.css" scoped></style>