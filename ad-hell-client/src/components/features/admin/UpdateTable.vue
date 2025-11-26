<script setup>
import SendEmailForm from "@/components/features/account/SendEmailForm.vue";
import {reactive} from "vue";
const props = defineProps({
  user: {
    type : Object
    ,required: true
  }
});

// TODO : 미리 값 넣어주기
const updateForm = reactive({
  role : props.user.role
  , nickname : props.user.nickname
  , status : props.user.status
});
</script>

<template>
  <el-form>
  <table class="detail-table">
    <tbody>
    <tr>
      <th>NO</th>
      <td>{{props.user.no}}</td>
      <th>권한</th>
      <td>
        <el-form-item>
          <el-select v-model="updateForm.role">
            <el-option label="회원" value="user"/>
            <el-option label="관리자" value="admin"/>
          </el-select>
        </el-form-item>
      </td>
    </tr>
    <tr>
      <th>아이디</th>
      <td>{{ props.user.userLoginId }}</td>
      <th>닉네임</th>
      <td>
        <el-form-item>
          <el-input
              v-model="updateForm.nickname"
              placeholder="닉네임"
          />
        </el-form-item>
      </td>
    </tr>
    <tr>
      <th>이메일</th>
      <td colspan="3">
        <div>
          <!-- props /emit으로 값 넘겨주고 값 가져오는 거 추가해주기 -->
          {{ props.user.email }}
        </div>
      </td>
    </tr>
    <tr>
      <th>회원 상태</th>
      <td>
        <el-form-item>
          <el-select v-model="updateForm.status">
            <el-option label="활성화" value="active"/>
            <el-option label="비활성화" value="deactive"/>
            <el-option label="탈퇴" value="withdraw"/>
          </el-select>
        </el-form-item>
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
  </el-form>


</template>
<style src="@/pages/admin/styles/admin.css" scoped></style>