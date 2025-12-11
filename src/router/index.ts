import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/board",
    },

    { path: "/login", component: () => import("../views/LoginView.vue") },
    { path: "/signup", component: () => import("../views/SignupView.vue") },

    { path: "/board", component: () => import("../views/BoardListView.vue") },
    {
      path: "/board/write",
      component: () => import("../views/BoardWriteView.vue"),
    },
    {
      path: "/board/:id",
      name: "boardDetail",
      component: () => import("../views/BoardDetailView.vue"),
    },
    {
      path: "/board/:id/edit",
      component: () => import("../views/BoardEditView.vue"),
    },
    {
      path: "/cookie-test",
      name: "CookieTest",
      component: () => import("../views/CookieTestView.vue"),
    },
  ],
});

export default router;
