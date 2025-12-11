<template>
  <div class="container">
    <h2>Cookie Test</h2>

    <button @click="sendCookieTest" class="btn">쿠키 테스트 요청</button>

    <div class="result">
      <p>서버 응답:</p>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import api from "../api/axios";

const result = ref("아직 요청 없음");

const sendCookieTest = async () => {
  try {
    // ⭐ GET 요청이지만 반드시 withCredentials 필요
    const response = await api.get("/api/auth/cookie-test", {
      withCredentials: true,
    });

    result.value = response.data;
  } catch (err) {
    result.value = "에러 발생: " + err;
    console.error(err);
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.btn {
  padding: 10px 15px;
  background: #007bff;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
.btn:hover {
  background: #0062cc;
}
.result {
  margin-top: 20px;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
}
</style>
