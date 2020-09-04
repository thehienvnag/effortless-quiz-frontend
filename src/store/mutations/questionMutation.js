import { storeQuizLocalStorage } from "../utils/Utilities";
export const mutationTypes = {
  SAVE_QUESTION: "SAVE_QUESTION",
  REMOVE_QUESTION: "REMOVE_QUESTION",
  SAVE_ALL_QUESTIONS: "SAVE_ALL_QUESTIONS",
  UPDATE_PART_OF_QUESTION: "SAVE_PART_OF_QUESTION",
};
export const mutations = {
  [mutationTypes.SAVE_QUESTION]: (state, quiz) => {
    state.currentHighestPos =
      state.questionList.reduce(
        (acc, { quizPos }) => (quizPos >= acc ? quizPos : acc),
        state.currentHighestPos
      ) + 1;
    const quesIndex = state.questionList.findIndex(
      (ques) => quiz.question.quizPos === ques.quizPos
    );
    if (quesIndex === -1)
      state.questionList.push(
        Object.assign(quiz.question, { quizPos: state.currentHighestPos })
      );
    else state.questionList[quesIndex] = quiz.question;
    storeQuizLocalStorage(quiz);
  },
  [mutationTypes.REMOVE_QUESTION]: (state, quizPos) => {
    state.questionList.splice(
      state.questionList.findIndex((ques) => ques.quizPos === quizPos),
      1
    );
  },
  [mutationTypes.UPDATE_PART_OF_QUESTION]: (state, ques) => {
    const index = state.questionList.findIndex(
      ({ quizPos }) => quizPos === ques.quizPos
    );
    if (index != -1)
      state.questionList[index] = Object.assign(
        state.questionList[index],
        ques
      );
  },
  [mutationTypes.SAVE_ALL_QUESTIONS]: (state, questions) => {
    if (!questions) {
      state.questionList = [];
    } else {
      state.questionList = questions.map(({ id, question }) =>
        Object.assign(question, {
          quizQuestionId: id,
          contentValue: question.content,
          options: question.answerList.map((ans) => ({
            value: ans.content,
          })),
          value: question.answerList
            .filter((ans) => ans.correct)
            .map((ans) => ans.content),
        })
      );
    }
  },
};
