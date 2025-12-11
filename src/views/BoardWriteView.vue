<template>
  <div class="write-container">
    <h2>게시글 작성</h2>

    <div class="form-group">
      <label>제목</label>
      <input
        v-model="title"
        class="text-input"
        placeholder="제목을 입력하세요"
      />
    </div>

    <div class="form-group">
      <label>내용</label>
      <textarea
        v-model="content"
        class="text-area"
        placeholder="내용을 입력하세요"
      ></textarea>
    </div>

    <button class="submit-btn" @click="submitPost">작성하기</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const title = ref("");
const content = ref("");

const submitPost = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }

  try {
    await api.post("/api/board", {
      title: title.value,
      content: content.value,
    });

    alert("글 작성 완료!");
    router.push("/board"); // 글 목록으로 이동
  } catch (err: any) {
    console.error(err);
    if (err.response?.status === 401) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    } else {
      alert("글 작성 중 오류가 발생했습니다.");
    }
  }
};
</script>

<style scoped>
.write-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.text-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.text-area {
  width: 100%;
  height: 200px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.submit-btn {
  padding: 12px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn:hover {
  background: #0056b3;
}
</style>
