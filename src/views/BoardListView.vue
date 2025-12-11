<template>
  <div class="board-wrapper">
    <div class="board-container">
      <div class="board-header">
        <h2>게시판 목록</h2>
        <button class="write-btn" @click="goWrite">
          <span>✏️</span> 글쓰기
        </button>
      </div>

      <div class="board-list-container">
        <ul class="board-list" v-if="boards.length > 0">
          <li
            v-for="item in boards"
            :key="item.id"
            class="board-item"
            @click="goDetail(item.id)"
          >
            <div class="board-item-content">
              <h3 class="board-title">{{ item.title }}</h3>
              <div class="board-meta">
                <span class="board-writer">{{ item.writer }}</span>
                <span class="board-date">{{ formatDate(item.createdAt) }}</span>
              </div>
            </div>
            <span class="board-arrow">→</span>
          </li>
        </ul>
        <div v-else class="empty-state">
          <p>게시글이 없습니다.</p>
        </div>
      </div>

      <div class="pagination">
        <button class="page-btn" :disabled="page === 0" @click="prevPage">
          이전
        </button>
        <span class="page-info">{{ page + 1 }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="!hasNext" @click="nextPage">
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/auth";

const router = useRouter();
const { isAuthenticated } = useAuth();

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
  if (!isAuthenticated()) {
    alert("로그인이 필요합니다.");
    router.push("/login");
    return;
  }
  router.push("/board/write");
};

const goDetail = (id: number) => router.push(`/board/${id}`);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
</script>

<style scoped>
.board-wrapper {
  padding: 2rem 1rem;
  min-height: calc(100vh - 80px);
}

.board-container {
  max-width: 900px;
  margin: 0 auto;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.board-header h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
}

.write-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.write-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.write-btn:active {
  transform: translateY(0);
}

.board-list-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 2rem;
}

.board-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.board-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.board-item:last-child {
  border-bottom: none;
}

.board-item:hover {
  background-color: #f8f9fa;
}

.board-item-content {
  flex: 1;
}

.board-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.board-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.board-writer {
  font-weight: 500;
}

.board-date {
  color: #999;
}

.board-arrow {
  color: #ccc;
  font-size: 1.25rem;
  transition: transform 0.2s, color 0.2s;
}

.board-item:hover .board-arrow {
  transform: translateX(4px);
  color: #667eea;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
  color: #666;
  min-width: 60px;
  text-align: center;
}

@media (max-width: 768px) {
  .board-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .write-btn {
    width: 100%;
    justify-content: center;
  }

  .board-item {
    padding: 1rem;
  }

  .board-title {
    font-size: 1rem;
  }
}
</style>
