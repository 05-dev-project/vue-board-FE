import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuth } from "../composables/auth";
import router from "../router";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const { getToken } = useAuth();
  const token = getToken();

  // 토큰이 필요 없는 URL 목록
  const publicUrls = ["/login", "/api/auth/signup", "/api/auth/refresh"];

  const isPublic = publicUrls.some((url) => config.url?.startsWith(url));

  // 로그아웃 API는 토큰이 필요하지만, publicUrls에 포함하지 않음 (자동으로 토큰 추가됨)

  // public URL이 아니면 토큰 자동 추가
  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 인터셉터 - 401 에러 시 refreshToken으로 재발급
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고, refresh API가 아니고, 아직 재시도하지 않은 경우
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/api/auth/refresh") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const { refreshAccessToken, clearToken } = useAuth();
      const newToken = await refreshAccessToken();

      if (newToken) {
        // 새로운 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        // refresh 실패 시 로그인 페이지로 리다이렉트
        clearToken();
        if (router.currentRoute.value.path !== "/login") {
          router.push("/login");
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
