import axios from "axios";

const api = axios.create({
  baseURL: "https://8a16a23bf821.ngrok-free.app",
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // 토큰이 필요 없는 URL 목록
  const publicUrls = ["/login", "/api/auth/signup", "/api/auth/refresh"];

  const isPublic = publicUrls.some((url) => config.url?.startsWith(url));

  // public URL이 아니면 토큰 자동 추가
  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
