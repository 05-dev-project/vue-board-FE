<template>
  <div class="signup-wrapper">
    <div class="signup-container">
      <div class="signup-header">
        <h2>회원가입</h2>
        <p class="subtitle">새 계정을 만들어 시작하세요</p>
      </div>

      <form @submit.prevent="signup" class="signup-form">
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
          <label>닉네임</label>
          <input
            v-model="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
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

        <div class="input-group">
          <label>비밀번호 확인</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            class="text-input"
            required
          />
        </div>

        <button type="submit" class="signup-button" :disabled="loading">
          {{ loading ? "가입 중..." : "회원가입" }}
        </button>
      </form>

      <div class="login-link">
        <span>이미 계정이 있으신가요?</span>
        <a @click="goLogin" class="link">로그인하기</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";

const username = ref("");
const nickname = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const router = useRouter();

const signup = async () => {
  if (loading.value) return;

  if (password.value !== confirmPassword.value) {
    alert("비밀번호가 일치하지 않습니다!");
    return;
  }

  loading.value = true;
  try {
    await api.post("/api/auth/signup", {
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      nickname: nickname.value,
    });

    alert("회원가입 성공! 이제 로그인하세요.");
    router.push("/login");
  } catch (error) {
    alert("회원가입 실패. 입력 내용을 확인하세요.");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.signup-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 2rem 1rem;
}

.signup-container {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
}

.signup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.signup-header h2 {
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

.signup-form {
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

.signup-button {
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

.signup-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.signup-button:active:not(:disabled) {
  transform: translateY(0);
}

.signup-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.login-link .link {
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: color 0.2s;
}

.login-link .link:hover {
  color: #764ba2;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .signup-container {
    padding: 2rem 1.5rem;
  }

  .signup-header h2 {
    font-size: 1.5rem;
  }
}
</style>
