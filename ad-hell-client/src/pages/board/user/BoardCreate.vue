  <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()

const title = ref('')
const content = ref('')
const categoryId = ref(null)
const imageFiles = ref([])

const onFileChange = (e) => {
  imageFiles.value = Array.from(e.target.files)
}

const submit = async () => {
  if (!title.value || !content.value) {
    ElMessage.warning('제목과 내용을 입력해주세요.')
    return
  }

  const form = new FormData()

  // 백엔드 BoardCreateRequest 구조에 맞게 boardInfo JSON 생성
  const boardInfo = {
    title: title.value,
    content: content.value,
    categoryId: categoryId.value,
  }

  form.append(
      'boardInfo',
      new Blob([JSON.stringify(boardInfo)], { type: 'application/json' })
  )

  imageFiles.value.forEach((file) => {
    form.append('imageFiles', file)
  })

  try {
    await axios.post('http://localhost:8080/api/boards', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    ElMessage.success('게시글이 등록되었습니다.')
    router.push('/boards')
  } catch (e) {
    console.error(e)
    ElMessage.error('등록에 실패했습니다.')
  }
}
</script>

<template>
  <el-card>
    <h2>게시글 등록</h2>

    <el-form label-width="100px">
      <el-form-item label="제목">
        <el-input v-model="title" />
      </el-form-item>

      <el-form-item label="내용">
        <el-input v-model="content" type="textarea" :rows="8" />
      </el-form-item>

      <el-form-item label="카테고리 ID">
        <el-input v-model="categoryId" type="number" placeholder="카테고리 ID" />
      </el-form-item>

      <el-form-item label="이미지">
        <input type="file" multiple @change="onFileChange" />
      </el-form-item>

      <el-form-item>
        <el-button type="danger" @click="submit">등록</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped></style>
