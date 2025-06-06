import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/deploy",
    name: "Deploy",
    component: () => import("../views/Deploy.vue"),
  },
  {
    path: "/status",
    name: "Status",
    component: () => import("../views/Status.vue"),
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("../views/Chat.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
