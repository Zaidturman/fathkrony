import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import Prayertimes from "@/components/Prayertimes.vue";
import SettingPage from "@/components/SettingPage.vue";
import HomePage from "@/components/HomePage.vue";
import SurahDetails from "@/components/SurahDetails.vue";
import Quran from "@/components/quran.vue";
import PrayerAzkar from "@/components/PrayerAzkar.vue";
import Azkar from "@/components/Azkar.vue";
import Watch from "@/components/Watch.vue";
import Books from "@/components/Books.vue";
import Hadeth from "@/components/Hadeth.vue";

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
    { path: "/surah/:id", component: SurahDetails },
    { path: "/quran", component: Quran },
    { path: "/adhkar/:id", name: "AdhkarDetails", component: PrayerAzkar },
    { path: "/azkar", component: Azkar },
    { path: "/watch", component: Watch },
    { path: "/books", component: Books },
    { path: "/hadeth", component: Hadeth },
  ],
});

export default router;
