import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import ConfirmLoginFB from "../views/ConfirmLoginFB.vue";
import ManageQuizzes from "../views/ManageQuizzes.vue";
import { getCookie } from "../store/utils/Utilities";

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
      const role = getCookie("role");
      console.log(role);
      if (role && role === "ROLE_NOT_CONFIRMED") {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
  {
    path: "/student-attempts/:stagingQuizzesId",
    name: "StudentAttempt",
    component: () => import("../views/StudentAttempts.vue"),
    beforeEnter: (to, from, next) => {
      const role = getCookie("role");
      if (role && role === "ROLE_TEACHER") {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
  {
    path: "/launchedQuizzes/:quizId",
    name: "LaunchQuiz",
    component: () => import("../views/ManageLaunchQuiz.vue"),
    beforeEnter: (to, from, next) => {
      const role = getCookie("role");
      if (role && role === "ROLE_TEACHER") {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
  {
    path: "/take-quiz",
    name: "ConfirmTakeQuiz",
    component: () => import("../views/ConfirmTakingQuiz.vue"),
    beforeEnter: (to, from, next) => {
      const role = getCookie("role");
      if (role && role === "ROLE_STUDENT") {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
  {
    path: "/attempts/:id/:pos?",
    name: "TakeQuiz",
    component: () => import("../views/TakingQuiz.vue"),
    beforeEnter: (to, from, next) => {
      const role = getCookie("role");
      if (role && role === "ROLE_STUDENT") {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
  {
    path: "/reviews/:attemptId",
    name: "ReviewQuiz",
    component: () => import("../views/ReviewQuiz.vue"),
    beforeEnter: (to, from, next) => {
      const role = getCookie("role");
      if (role) {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
  {
    path: "/past-attempts/:type?",
    name: "PastAttempt",
    component: () => import("../views/ShowStudentGrade.vue"),
    beforeEnter: (to, from, next) => {
      const role = getCookie("role");
      if (role && role === "ROLE_STUDENT") {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
  {
    path: "/quizzes",
    name: "Quizzes",
    component: () => import("../views/ManageQuizWrapper.vue"),
    children: [
      {
        path: "/",
        name: "QuizList",
        component: ManageQuizzes,
      },
      {
        path: "details/:id",
        name: "QuizDetail",
        component: () => import("../views/QuizDetails.vue"),
      },
    ],
    beforeEnter: (to, from, next) => {
      const role = getCookie("role");
      if (role && role === "ROLE_TEACHER") {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  const role = getCookie("role");
  if (to.name !== "ConfirmLogin" && role && role === "ROLE_NOT_CONFIRMED") {
    next({ name: "ConfirmLogin" });
  } else next();
});

export default router;
