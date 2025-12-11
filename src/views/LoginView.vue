<template>
  <div class="login-container">
    <h2>로그인</h2>

    <div>
      <input v-model="username" placeholder="아이디" class="text-input" />
    </div>

    <div>
      <input
        v-model="password"
        type="password"
        placeholder="비밀번호"
        class="text-input"
      />
    </div>

    <button @click="login" class="login-button">로그인</button>

    <p class="signup-link">
      계정이 없으신가요?
      <a @click="goSignup">회원가입</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  try {
    const params = new URLSearchParams();
    params.append("username", username.value);
    params.append("password", password.value);

    const response = await api.post("/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: false,
    });

    const token = response.data.data.accessToken;

    // JWT 저장
    localStorage.setItem("accessToken", token);

    alert("로그인 성공!");
    router.push("/board");
  } catch (error) {
    alert("로그인 실패! 아이디/비밀번호를 확인하세요.");
    console.error(error);
  }
};

const goSignup = () => {
  router.push("/signup");
};
</script>

<style scoped>
.login-container {
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

.login-button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.login-button:hover {
  background: #0062cc;
}

.signup-link a {
  color: #007bff;
  cursor: pointer;
}
</style>
