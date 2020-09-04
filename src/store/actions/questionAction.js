import { mutationTypes } from "../mutations/questionMutation";
import { axiosInstance, authenticateAction } from "../../api-handlers/apiCall";
const {
  SAVE_QUESTION,
  REMOVE_QUESTION,
  UPDATE_PART_OF_QUESTION,
  SAVE_ALL_QUESTIONS,
} = mutationTypes;

export const actionTypes = {
  saveQuestion: "saveQuestion",
  removeQuestion: "removeQuestion",
  saveQuizQuestions: "saveQuizQuestions",
  updatePartOfQuestion: "updatePartOfQuestion",
  loadQuestionsByQuizId: "loadQuestionsByQuizId",
};
export const actions = {
  [actionTypes.saveQuestion]: ({ commit }, quizQuestion) => {
    commit(SAVE_QUESTION, quizQuestion);
  },
  [actionTypes.removeQuestion]: ({ commit }, quizPos) => {
    commit(REMOVE_QUESTION, quizPos);
  },
  [actionTypes.saveQuizQuestions]: authenticateAction(
    async ({ commit }, { userId, quizId, questions }) => {
      console.log(questions);
      const uri = `users/${userId}/quizzes/${quizId}/questions`;
      const { data } = await axiosInstance.post(uri, { questions: questions });
      commit(SAVE_ALL_QUESTIONS, data);
      return data;
    }
  ),
  [actionTypes.updatePartOfQuestion]: ({ commit }, ques) => {
    commit(UPDATE_PART_OF_QUESTION, ques);
  },
  [actionTypes.loadQuestionsByQuizId]: authenticateAction(
    async ({ commit }, { quizId, userId }) => {
      const uri = `users/${userId}/quizzes/${quizId}/questions`;
      const { data } = await axiosInstance.get(uri);
      commit(SAVE_ALL_QUESTIONS, data);
    }
  ),
};
