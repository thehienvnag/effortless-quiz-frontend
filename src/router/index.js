import Vue from "vue";
import VueRouter from "vue-router";
import Store from "../store/Store";
import Home from "../views/Home.vue";
import ConfirmLoginFB from "../views/ConfirmLoginFB.vue";
import ManageQuizzes from "../views/ManageQuizzes.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "404",
    component: Home,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/confirm-login",
    name: "ConfirmLogin",
    component: ConfirmLoginFB,
    beforeEnter: (to, from, next) => {
      const { userRoles } = Store.state.userStore.currentUser;
      if (!userRoles || !userRoles.length) next();
      else next({ name: "Home" });
    },
  },
  {
    path: "/quizzes",
    name: "Quizzes",
    component: ManageQuizzes,
  },
  {
    path: "/quizzes/:id/:type?",
    name: "Quizzes",
    component: () => import("../views/QuizDetails.vue"),
  },
  {
    path: "/launchedQuizzes/:quizId",
    name: "LaunchQuiz",
    component: () => import("../views/ManageLaunchQuiz.vue"),
  },
  {
    path: "/take-quiz",
    name: "ConfirmTakeQuiz",
    component: () => import("../views/ConfirmTakingQuiz.vue"),
  },
  {
    path: "/attempts/:id/:pos?",
    name: "TakeQuiz",
    component: () => import("../views/TakingQuiz.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const userLoggedIn = Store.state.userStore.currentUser;
//   if (to.name === "Home") next();
//   if (userLoggedIn && to.name === "ConfirmLogin") next();
//   if (userLoggedIn && userLoggedIn.userRoles && userLoggedIn.userRoles.length) next();
// });

export default router;
