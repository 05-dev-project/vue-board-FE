<template>
  <div class="write-wrapper">
    <div class="write-container">
      <h2 class="write-header">게시글 작성</h2>

      <form @submit.prevent="submitPost" class="write-form">
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
            {{ loading ? "작성 중..." : "작성하기" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const title = ref("");
const content = ref("");
const loading = ref(false);

const submitPost = async () => {
  if (loading.value) return;

  if (!title.value.trim() || !content.value.trim()) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }

  loading.value = true;
  try {
    await api.post("/api/board", {
      title: title.value,
      content: content.value,
    });

    router.push("/board");
  } catch (err: any) {
    console.error(err);
    if (err.response?.status === 401) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    } else {
      alert("글 작성 중 오류가 발생했습니다.");
    }
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push("/board");
};
</script>

<style scoped>
.write-wrapper {
  padding: 2rem 1rem;
  min-height: calc(100vh - 80px);
}

.write-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.write-header {
  margin: 0 0 2rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
}

.write-form {
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

@media (max-width: 768px) {
  .write-container {
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
