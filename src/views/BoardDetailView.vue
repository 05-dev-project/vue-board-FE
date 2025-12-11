<template>
  <div class="detail-wrapper">
    <div class="detail-container" v-if="board">
      <div class="detail-header">
        <h1 class="title">{{ board.title }}</h1>
        <div class="info">
          <span class="info-item">
            <span class="info-label">작성자</span>
            <span class="info-value">{{ board.writer }}</span>
          </span>
          <span class="info-item">
            <span class="info-label">작성일</span>
            <span class="info-value">{{ formatDate(board.createdAt) }}</span>
          </span>
        </div>
      </div>

      <div class="content">
        <div class="content-text">{{ board.content }}</div>
      </div>

      <div class="actions">
        <button class="back-btn" @click="goList">← 목록</button>

        <div class="action-buttons" v-if="isMyPost">
          <button class="edit-btn" @click="goEdit">수정</button>
          <button class="delete-btn" @click="deletePost">삭제</button>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      <div class="loading-spinner"></div>
      <p>불러오는 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";
import { useAuth } from "../composables/auth";

const route = useRoute();
const router = useRouter();
const { getUserId } = useAuth();

const board = ref<any | null>(null);
const isMyPost = ref(false);

const loadDetail = async () => {
  const id = route.params.id;
  const res = await api.get(`/api/board/${id}`);
  board.value = res.data.data;

  // JWT에서 현재 사용자 ID 가져오기
  const myId = getUserId();

  // 본인 글인지 확인
  if (myId && board.value.memberId === myId) {
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
.detail-wrapper {
  padding: 2rem 1rem;
  min-height: calc(100vh - 80px);
}

.detail-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
}

.detail-header {
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #1a1a1a;
  line-height: 1.3;
}

.info {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.info-label {
  font-weight: 500;
  color: #999;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.content {
  margin: 2rem 0;
  min-height: 200px;
}

.content-text {
  line-height: 1.8;
  color: #333;
  font-size: 1.05rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.edit-btn,
.delete-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.delete-btn {
  background: #ff4757;
  color: white;
}

.delete-btn:hover {
  background: #ee5a6f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p {
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .detail-container {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .info {
    flex-direction: column;
    gap: 0.75rem;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .back-btn,
  .edit-btn,
  .delete-btn {
    width: 100%;
  }

  .action-buttons {
    width: 100%;
    flex-direction: column;
  }
}
</style>
