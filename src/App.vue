<template>
  <div class="app-wrapper">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuth } from "./composables/auth";
import AppHeader from "./components/AppHeader.vue";
import { useRoute } from "vue-router";

const { refreshAccessToken, isAuthenticated } = useAuth();
const route = useRoute();

// 앱 초기화 시 refreshToken으로 accessToken 재발급 시도
// 단, 로그인 페이지에서는 재발급 시도하지 않음
onMounted(async () => {
  // 로그인/회원가입 페이지가 아니고, 현재 인증되지 않은 상태일 때만 refresh 시도
  if (route.path !== "/login" && route.path !== "/signup" && !isAuthenticated()) {
    await refreshAccessToken();
  }
});
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background-color: #f5f7fa;
}
</style>
