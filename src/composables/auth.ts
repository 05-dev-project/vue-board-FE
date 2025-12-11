import { ref } from "vue";
import api from "../api/axios";

// 메모리에 accessToken 저장 (보안 강화)
const accessToken = ref<string | null>(null);

// refresh 중인지 추적 (동시 요청 방지)
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// 로그아웃 플래그 (로그아웃 후 자동 refresh 방지)
let isLoggedOut = false;

export const useAuth = () => {
  const setToken = (token: string) => {
    // Bearer prefix 제거 후 저장
    accessToken.value = token.replace(/^Bearer\s+/, "");
    // 토큰 설정 시 로그아웃 플래그 해제
    isLoggedOut = false;
  };

  const getToken = (): string | null => {
    return accessToken.value;
  };

  const clearToken = () => {
    accessToken.value = null;
  };

  const isAuthenticated = (): boolean => {
    return accessToken.value !== null;
  };

  // JWT 토큰에서 userId 추출
  const getUserId = (): number | null => {
    const token = accessToken.value;
    if (!token) return null;

    try {
      // JWT는 base64로 인코딩된 3부분으로 구성: header.payload.signature
      const parts = token.split(".");
      if (parts.length !== 3 || !parts[1]) return null;

      // payload 디코딩
      const payload = JSON.parse(atob(parts[1]));

      // userId 또는 id 필드 확인
      const userId = payload.userId || payload.id;
      return userId ? Number(userId) : null;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  // refreshToken으로 accessToken 재발급
  const refreshAccessToken = async (): Promise<string | null> => {
    // 로그아웃 상태면 refresh 시도하지 않음
    if (isLoggedOut) {
      return null;
    }

    // 이미 refresh 중이면 기존 Promise 반환
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const response = await api.post("/api/auth/refresh", {});

        const newAccessToken = response.data.data.accessToken;
        setToken(newAccessToken);
        isLoggedOut = false; // 성공 시 로그아웃 플래그 해제
        return newAccessToken;
      } catch (error) {
        // refresh 실패 시 토큰 제거
        clearToken();
        return null;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    try {
      // api 인스턴스를 사용하여 Authorization 헤더 포함
      await api.post("/api/auth/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 성공/실패 여부와 관계없이 토큰 제거
      clearToken();
      // refresh 상태도 초기화
      isRefreshing = false;
      refreshPromise = null;
      // 로그아웃 플래그 설정 (자동 refresh 방지)
      isLoggedOut = true;
    }
  };

  return {
    setToken,
    getToken,
    clearToken,
    isAuthenticated,
    refreshAccessToken,
    logout,
    getUserId,
  };
};
