<!-- src/components/comment/AdminCommentList.vue -->
<script setup>
import CommonButton from '@/components/common/CommonButton.vue'
import {onMounted, reactive, ref} from "vue";
import {updateMyInfoApi} from "@/api/userApi.js";
import {ElMessage} from "element-plus";
import {fetchAdComments} from "@/api/adCommnetApi.js";
const updateToggle = ref(false);
const props = defineProps({
  adId: Number
});

const adComments = ref([]);
const adCommentCount = ref(0);

const adCommentForm = reactive({
  adId : props.adId
  , adCommentId : ''
  , userId : ''
  , content : ''
  , createdAt : ''
  , updatedAt : ''
});

// type CommentRow = {
//   id: number
//   writer: string
//   content: string
// }
//
// const props = defineProps<{
//   comments: CommentRow[]
// }>()
//
// const emit = defineEmits<{
//   (e: 'edit', id: number): void
//   (e: 'delete', id: number): void
// }>()
//
// const handleEdit = (id: number) => {
//   emit('edit', id)
// }
//
// const handleDelete = (id: number) => {
//   emit('delete', id)
// }

const handleEdit = (id) => {
  updateToggle.value = !updateToggle.value;
}

const handleDelete = (id) => {

}

const adCommentList = async () => {

  try {
    const result = await fetchAdComments(props.adId);
    console.log(result.data);
    const data = result.data.data.adComments;
    adComments.value = data;
    adCommentCount.value = data.length;

    console.log(adComments.value);
    console.log(adCommentCount.value);
  } catch (e) {
    console.log(e);
    errorMessage.value = e.message || '댓글 조회 중 오류가 발생했습니다.';
  }

};

const adCommentWrite = () => {
  alert("등록");
}

const onCancel = () => {
  updateToggle.value = !updateToggle.value;
}
onMounted(() => {
  // 댓글 리스트 가져오기
  adCommentList();
})



</script>

<template>
  <section class="comment-section">

    <div class="comment-div">
      <h3 class="comment-title">댓글</h3>
      <div class="comment-title"> 총 {{ adCommentCount }}개</div>
    </div>

    <div class="comment-input-div">
      <div class="comment-input-form">
        <el-input
            v-model="adCommentForm.content"
            placeholder="댓글...."
            class="comment-input"
        />
        <CommonButton
            type="register"
            :width="54"
            :height="30"
            @click="adCommentWrite"
        />
      </div>
    </div>
    <div class="comment-list">

      <div class="comment-row" v-for="comment in adComments" :key="comment.adCommentId">
        <div class="comment-first-row">
          <!-- 왼쪽: 닉네임 + 시간 -->
          <div class="comment-info">
            <span class="comment-writer">{{ comment.nickname }}</span>
            <span class="comment-time">{{ comment.createdAt }}</span>
          </div>

          <!-- 오른쪽: 버튼 세트 -->
          <!-- 목록 일때 -->
            <div  v-if="!updateToggle">
              <CommonButton
                  type="update"
                  :width="54"
                  :height="30"
                  @click.stop="handleEdit(comment.adCommentId)"
              />
              <CommonButton
                  type="delete"
                  :width="54"
                  :height="30"
                  @click.stop="handleDelete(comment.adCommentId)"
              />
              <div class="report-btn">[신고]</div>
            </div>
            <!--      수정일 때       -->
            <div v-else >
              <CommonButton
                  type="update"
                  :width="54"
                  :height="30"
                  @click.stop=""
              />
              <CommonButton
                  type="cancel"
                  :width="54"
                  :height="30"
                  @click.stop="onCancel"
              />
            </div>
        </div>

        <!-- 댓글 내용 -->
        <div>
          <!-- 목록일 때 -->
          <div class="comment-content" v-if="!updateToggle">
            {{ comment.content }}
          </div>

          <!-- 수정 버튼 눌렀을 때 -->
          <div v-else>
            <el-form class="comment-input-form"
                     :model="adCommentForm"

            >
              <el-input
                  v-model="adCommentForm.content"
                  placeholder="댓글...."
                  class="comment-input"
              />

            </el-form>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.comment-section {

  padding : 20px;
}

.comment-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;

}
.comment-input-form {
  display: flex;       /* 가로 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
  gap: 8px;            /* input과 버튼 간격 */
  margin-bottom: 40px;
}

.comment-first-row {
  display: flex;
  justify-content: space-between; /* 왼쪽/오른쪽 분리 */
  align-items: center;
  margin-bottom: 4px;
}

.comment-info {
  display: flex;
  align-items: center;
  gap: 8px; /* 닉네임과 시간 간격 */
}
.comment-row {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0; /* border-width + border-style + border-color 한 번에 */
}
.comment-writer {
  font-weight: 700;
}

.comment-time {
  font-size: 12px;
  color: #888;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-btn {
  cursor: pointer;
  color: #f56565;
  font-size: 14px;
  font-weight: 500;
}
</style>
