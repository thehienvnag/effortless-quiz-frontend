import { getCookie } from "../utils/Utilities";
import { mutationTypes } from "../mutations/quizMutations";
import { authenticateAction, axiosInstance } from "../../api-handlers/apiCall";
const {
  SAVE_QUIZZES,
  SAVE_STUDENT_ATTEMPT,
  SAVE_CURRENT_QUESTION,
  SAVE_LAUNCH_QUIZZES,
  SAVE_STUDENT_ANSWER,
  //    ADD_QUIZ
} = mutationTypes;

export const actionTypes = {
  loadQuizzes: "loadQuizzes",
  addQuiz: "addQuiz",
  loadQuizById: "loadQuizById",
  saveQuizQuestions: "saveQuizQuestions",
  launchQuiz: "launchQuiz",
  takeQuiz: "takeQuiz",
  loadLaunchQuizzes: "loadLaunchQuizzes",
  loadLaunchingQuizzes: "loadLaunchingQuizzes",
  loadStudentAttempt: "loadStudentAttempt",
  checkAnswer: "checkAnswer",
  changeQuestion: "changeQuestion",
  submitAttempt: "submitAttempt",
};
export const actions = {
  [actionTypes.loadQuizzes]: authenticateAction(
    async ({ commit }, { page = 0, size = 5, userId, q }) => {
      let uri = `users/${userId}/quizzes?page=${page}&size=${size}`;
      if (q) {
        uri += `&q=${q}`;
      }
      const { data } = await axiosInstance.get(uri);
      commit(SAVE_QUIZZES, data);
    }
  ),
  [actionTypes.addQuiz]: authenticateAction(
    async (context, { userId, quiz }) => {
      const uri = `users/${userId}/quizzes`;
      return await axiosInstance.post(uri, quiz);
    }
  ),
  [actionTypes.loadQuizById]: authenticateAction(
    async (context, { userId, quizId }) => {
      const uri = `users/${userId}/quizzes/${quizId}`;
      return await axiosInstance.get(uri);
    }
  ),
  [actionTypes.launchQuiz]: authenticateAction(
    async (context, { launchQuizInfo, quizId }) => {
      const userId = getCookie("userId");
      const uri = `users/${userId}/quizzes/${quizId}`;
      const { data } = await axiosInstance.put(uri, launchQuizInfo);
      return data;
    }
  ),
  [actionTypes.takeQuiz]: authenticateAction(
    async ({ commit, state }, { userId, quizCred }) => {
      const uri = `users/${userId}/take-quiz`;
      const { data } = await axiosInstance.put(uri, quizCred);
      commit(SAVE_STUDENT_ATTEMPT, data);
      if (state.studentAttempt) {
        commit(SAVE_CURRENT_QUESTION);
      }
      return data;
    }
  ),
  [actionTypes.loadLaunchQuizzes]: authenticateAction(
    async ({ commit }, { userId, quizId, size = 5, page = 0 }) => {
      const uri = `users/${userId}/quizzes/${quizId}/stagingQuizzes?page=${page}&size=${size}`;
      const { data } = await axiosInstance.get(uri);
      commit(SAVE_LAUNCH_QUIZZES, data);
      return data;
    }
  ),
  [actionTypes.loadLaunchingQuizzes]: authenticateAction(
    async ({ commit }, { userId, quizCode, size = 5, page = 0 }) => {
      const uri = `users/${userId}/stagingQuizzes?page=${page}&size=${size}&quizCode=${quizCode}`;
      const { data } = await axiosInstance.get(uri);
      commit(SAVE_LAUNCH_QUIZZES, data);
      return data;
    }
  ),
  [actionTypes.loadStudentAttempt]: authenticateAction(
    async ({ state, commit }, { userId, attemptId, pos }) => {
      const uri = `users/${userId}/studentAttempts/${attemptId}`;
      const { data } = await axiosInstance.get(uri);
      commit(SAVE_STUDENT_ATTEMPT, data);
      if (state.studentAttempt) {
        commit(SAVE_CURRENT_QUESTION, pos);
      }
    }
  ),
  [actionTypes.checkAnswer]: authenticateAction(
    ({ commit, state }, { attemptId, userId, quesId, answerId }) => {
      commit(SAVE_STUDENT_ANSWER, { quesId, answerId });
      const uri = `users/${userId}/studentAttempt/${attemptId}/studentQuestions/${quesId}`;
      let chosenAnswerId = state.currentQuestion.chosenAnswerId;
      if (!chosenAnswerId.length) {
        chosenAnswerId = null;
      }
      axiosInstance.put(uri, {
        chosenAnswerId: chosenAnswerId,
      });
    }
  ),
  [actionTypes.submitAttempt]: authenticateAction(
    async (state, { userId, attemptId }) => {
      const uri = `users/${userId}/studentAttempt/${attemptId}`;
      const { data } = await axiosInstance.put(uri);
      return data;
    }
  ),
  [actionTypes.changeQuestion]: ({ commit }, pos) => {
    commit(SAVE_CURRENT_QUESTION, pos);
  },
};
