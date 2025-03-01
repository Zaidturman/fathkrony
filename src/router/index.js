import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import Prayertimes from "@/components/Prayertimes.vue";
import SettingPage from "@/components/SettingPage.vue";
import HomePage from "@/components/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/times",
      name: "prayer",
      component: Prayertimes,
    },
    {
      path: "/setting",
      name: "setting",
      component: SettingPage,
    },
  ],
});

export default router;
