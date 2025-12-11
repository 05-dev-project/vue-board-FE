<template>
  <div class="edit-wrapper">
    <div class="edit-container" v-if="board">
      <h2 class="edit-header">게시글 수정</h2>

      <form @submit.prevent="updatePost" class="edit-form">
        <div class="form-group">
          <label>제목</label>
          <input
            v-model="title"
            class="text-input"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div class="form-group">
          <label>내용</label>
          <textarea
            v-model="content"
            class="text-area"
            placeholder="내용을 입력하세요"
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="goBack">취소</button>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? "수정 중..." : "수정하기" }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="loading">
      <div class="loading-spinner"></div>
      <p>불러오는 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../api/axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const board = ref<any | null>(null);
const title = ref("");
const content = ref("");
const loading = ref(false);

const loadBoard = async () => {
  try {
    const id = route.params.id;
    const res = await api.get(`/api/board/${id}`);
    board.value = res.data.data;
    title.value = board.value.title;
    content.value = board.value.content;
  } catch (error) {
    console.error(error);
    alert("게시글을 불러오는 중 오류가 발생했습니다.");
    router.push("/board");
  }
};

onMounted(() => {
  loadBoard();
});

const updatePost = async () => {
  if (loading.value) return;

  if (!title.value.trim() || !content.value.trim()) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }

  loading.value = true;
  try {
    const id = route.params.id;
    await api.put(`/api/board/${id}`, {
      title: title.value,
      content: content.value,
    });

    router.push(`/board/${id}`);
  } catch (err: any) {
    console.error(err);
    if (err.response?.status === 401) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    } else {
      alert("글 수정 중 오류가 발생했습니다.");
    }
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  const id = route.params.id;
  router.push(`/board/${id}`);
};
</script>

<style scoped>
.edit-wrapper {
  padding: 2rem 1rem;
  min-height: calc(100vh - 80px);
}

.edit-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.edit-header {
  margin: 0 0 2rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
}

.edit-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.text-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #fff;
}

.text-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.text-input::placeholder {
  color: #999;
}

.text-area {
  width: 100%;
  min-height: 300px;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  background-color: #fff;
}

.text-area:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.text-area::placeholder {
  color: #999;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  border-color: #ccc;
  background: #f8f9fa;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
  .edit-container {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}
</style>
