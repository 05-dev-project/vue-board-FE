<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo" @click="goHome">
        <h1>게시판</h1>
      </div>
      <nav class="nav-menu">
        <router-link to="/board" class="nav-link">목록</router-link>
        <template v-if="isAuthenticated()">
          <button class="logout-btn" @click="handleLogout">로그아웃</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link login-link">로그인</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "../composables/auth";

const router = useRouter();
const { isAuthenticated, logout } = useAuth();

const goHome = () => {
  router.push("/board");
};

const handleLogout = async () => {
  if (confirm("로그아웃 하시겠습니까?")) {
    await logout();
    router.push("/login");
  }
};
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  cursor: pointer;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.8;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.login-link {
  background-color: rgba(255, 255, 255, 0.2);
}

.login-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.logout-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .header-container {
    padding: 1rem;
  }

  .logo h1 {
    font-size: 1.2rem;
  }

  .nav-menu {
    gap: 1rem;
  }

  .nav-link,
  .logout-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>

