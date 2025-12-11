import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // 외부 접속 허용
    allowedHosts: ["75e3382ab60f.ngrok-free.app"], // ngrok 도메인 허용
  },
});
