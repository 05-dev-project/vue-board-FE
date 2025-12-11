<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-header">
        <h2>로그인</h2>
        <p class="subtitle">게시판에 오신 것을 환영합니다</p>
      </div>

      <form @submit.prevent="login" class="login-form">
        <div class="input-group">
          <label>아이디</label>
          <input
            v-model="username"
            type="text"
            placeholder="아이디를 입력하세요"
            class="text-input"
            required
          />
        </div>

        <div class="input-group">
          <label>비밀번호</label>
          <input
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            class="text-input"
            required
          />
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? "로그인 중..." : "로그인" }}
        </button>
      </form>

      <div class="signup-link">
        <span>계정이 없으신가요?</span>
        <a @click="goSignup" class="link">회원가입</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/auth";

const username = ref("");
const password = ref("");
const loading = ref(false);
const router = useRouter();
const { setToken } = useAuth();

const login = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.append("username", username.value);
    params.append("password", password.value);

    const response = await api.post("/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    });

    const token = response.data.data.accessToken;

    // JWT를 메모리에 저장 (보안 강화)
    setToken(token);

    router.push("/board");
  } catch (error) {
    alert("로그인 실패! 아이디/비밀번호를 확인하세요.");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const goSignup = () => {
  router.push("/signup");
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 2rem 1rem;
}

.login-container {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
}

.subtitle {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1.25rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
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

.login-button {
  width: 100%;
  padding: 0.875rem;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.signup-link .link {
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: color 0.2s;
}

.signup-link .link:hover {
  color: #764ba2;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-container {
    padding: 2rem 1.5rem;
  }

  .login-header h2 {
    font-size: 1.5rem;
  }
}
</style>
