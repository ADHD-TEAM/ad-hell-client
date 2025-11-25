<script setup>
import {USER_STATUS_TAG} from "@/styles/js/statusTag.js"
const props = defineProps({
  user: {
    type : Object
    ,required: true
  }
});
</script>

<template>
  <table class="detail-table">
    <tbody>
    <tr>
      <th>NO</th>
      <td>{{props.user.no}}</td>
      <th>권한</th>
      <td>{{ props.user.role }}</td>
    </tr>
    <tr>
      <th>아이디</th>
      <td>{{ props.user.userLoginId }}</td>
      <th>닉네임</th>
      <td>{{ props.user.nickname }}</td>
    </tr>
    <tr>
      <th>이메일</th>
      <td colspan="3">{{ props.user.email }}</td>
    </tr>
    <tr>
      <th>회원 상태</th>
      <td>
        <el-tag :type="USER_STATUS_TAG[props.user.status]?.type || ''" round>
          {{ USER_STATUS_TAG[props.user.status]?.label || props.user.status }}
        </el-tag>

        <!--        <el-tag round><strong>활성화</strong></el-tag>-->
      </td>
      <th>가입일</th>
      <td>{{ props.user.createdAt }}</td>
    </tr>
    <tr>
      <th>탈퇴일</th>
      <td>{{ props.user.deletedAt }}</td>
      <th>비활성화일</th>
      <td>{{ props.user.deactivedAt }}</td>
    </tr>
    </tbody>
  </table>
</template>
<style src="@/pages/admin/styles/admin.css" scoped></style>