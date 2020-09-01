import { actions } from "../actions/quizAction";
import { mutations } from "../mutations/quizMutations";

export const quizModule = {
  state: {
    quizzes: [],
    studentAttempt: null,
    currentQuestion: null,
    launchQuizzes: null,
  },
  mutations: mutations,
  actions: actions,
};
