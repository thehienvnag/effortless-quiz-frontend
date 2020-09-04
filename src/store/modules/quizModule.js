import { actions } from "../actions/quizAction";
import { mutations } from "../mutations/quizMutations";

export const quizModule = {
  state: {
    quizzes: [],
    studentAttempt: null,
    currentQuestion: null,
    launchQuizzes: null,
    studentAttemptList: null,
    numberOfQuestion: null
  },
  mutations: mutations,
  actions: actions,
  
};
