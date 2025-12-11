<template>
  <div class="signup-container">
    <h2>회원가입</h2>

    <input v-model="username" placeholder="아이디" class="text-input" />
    <input v-model="nickname" placeholder="닉네임" class="text-input" />

    <input
      v-model="password"
      type="password"
      placeholder="비밀번호"
      class="text-input"
    />

    <input
      v-model="confirmPassword"
      type="password"
      placeholder="비밀번호 확인"
      class="text-input"
    />

    <button @click="signup" class="signup-button">회원가입</button>

    <p class="login-link">
      이미 계정이 있으신가요?
      <a @click="goLogin">로그인하기</a>
    </p>
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

const router = useRouter();

const signup = async () => {
  if (password.value !== confirmPassword.value) {
    alert("비밀번호가 일치하지 않습니다!");
    return;
  }

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
  }
};

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

.text-input {
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}

.signup-button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: #0a7aff;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.signup-button:hover {
  background: #005fcc;
}

.login-link a {
  color: #007bff;
  cursor: pointer;
}
</style>
