import Vue from "vue";
import Vuex from "vuex";
import { userModule } from "./modules/userModule";
import { quizModule } from "./modules/quizModule";
import { questionModule } from "./modules/questionModule"
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    userStore: userModule,
    quizStore: quizModule,
    questionStore: questionModule
  },
});
export default store;


