<template>
  <div class="board-container">
    <h2>게시판 목록</h2>

    <button class="write-btn" @click="goWrite">글쓰기</button>

    <ul class="board-list">
      <li
        v-for="item in boards"
        :key="item.id"
        class="board-item"
        @click="goDetail(item.id)"
      >
        {{ item.title }}
      </li>
    </ul>

    <div class="pagination">
      <button :disabled="page === 0" @click="prevPage">이전</button>
      <span>{{ page + 1 }} / {{ totalPages }}</span>
      <button :disabled="!hasNext" @click="nextPage">다음</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const boards = ref<any[]>([]);
const page = ref(0);
const size = 10;

const totalPages = ref(1);
const hasNext = ref(false);

const loadBoards = async () => {
  const res = await api.get("/api/board", {
    params: {
      page: page.value,
      size: size,
    },
  });

  boards.value = res.data.data.content;
  totalPages.value = res.data.data.totalPages;
  hasNext.value = res.data.data.hasNext;
};

onMounted(() => {
  loadBoards();
});

const nextPage = () => {
  if (hasNext.value) {
    page.value++;
    loadBoards();
  }
};

const prevPage = () => {
  if (page.value > 0) {
    page.value--;
    loadBoards();
  }
};

const goWrite = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    router.push("/login");
    return;
  }
  router.push("/board/write");
};

const goDetail = (id: number) => router.push(`/board/${id}`);
</script>

<style scoped>
.board-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}

.board-list {
  list-style: none;
  padding: 0;
}

.board-item {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.board-item:hover {
  background: #f6f6f6;
}

.write-btn {
  margin-bottom: 16px;
  padding: 10px 14px;
}
</style>
