<template>
  <div class="detail-container" v-if="board">
    <h2 class="title">{{ board.title }}</h2>

    <div class="info">
      <span>작성자: {{ board.writer }}</span>
      <span>작성일: {{ formatDate(board.createdAt) }}</span>
    </div>

    <div class="content">
      <p>{{ board.content }}</p>
    </div>

    <div class="actions">
      <button class="back-btn" @click="goList">목록</button>

      <template v-if="isMyPost">
        <button class="edit-btn" @click="goEdit">수정</button>
        <button class="delete-btn" @click="deletePost">삭제</button>
      </template>
    </div>
  </div>

  <div v-else class="loading">불러오는 중...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";

const route = useRoute();
const router = useRouter();

const board = ref<any | null>(null);

// 로그인한 사용자 ID 가져오기 (JWT payload-decoding 가능하지만, 지금은 서버에서 사용)
const myId = Number(localStorage.getItem("memberId")); // 로그인 시 저장한다고 가정

const isMyPost = ref(false);

const loadDetail = async () => {
  const id = route.params.id;
  const res = await api.get(`/api/board/${id}`);
  board.value = res.data.data;

  // 본인 글인지 확인
  if (board.value.memberId === myId) {
    isMyPost.value = true;
  }
};

onMounted(() => {
  loadDetail();
});

const goList = () => router.push("/board");
const goEdit = () => router.push(`/board/${route.params.id}/edit`);

const deletePost = async () => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  try {
    await api.delete(`/api/board/${route.params.id}`);
    alert("삭제되었습니다.");
    router.push("/board");
  } catch (e) {
    alert("삭제 중 오류가 발생했습니다.");
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};
</script>

<style scoped>
.detail-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
}

.info {
  color: gray;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.content {
  margin: 20px 0;
  line-height: 1.6;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.back-btn,
.edit-btn,
.delete-btn {
  padding: 10px 14px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.delete-btn {
  background: #ff4d4d;
  color: white;
}

.back-btn {
  background: #ddd;
}

.loading {
  text-align: center;
  margin-top: 50px;
}
</style>
