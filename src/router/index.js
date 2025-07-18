import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
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
import Counter from "@/components/counter.vue";
import Mosqueclockwrapper from "@/components/mosqueclockwrapper.vue";
import Radio from "@/components/radio.vue";
import QuizApp from "@/components/QuizApp.vue";

const router = createRouter({
  history: createWebHashHistory(),
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
      path: "/counter",
      name: "counter",
      component: Counter,
    },
    {
      path: "/setting",
      name: "setting",
      component: SettingPage,
    },
    { path: "/surah/:id", name: "surah", component: SurahDetails },
    { path: "/quran", name: "quran", component: Quran },
    { path: "/adhkar/:id", name: "AdhkarDetails", component: PrayerAzkar },
    { path: "/azkar", component: Azkar },
    { path: "/watch", component: Watch },
    { path: "/books", component: Books },
    { path: "/hadeth", component: Hadeth },
    { path: "/mosqu-clock", component: Mosqueclockwrapper },
    { path: "/radio", component: Radio },
    { path: "/quiz", component: QuizApp },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
