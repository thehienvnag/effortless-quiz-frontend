export const mutationTypes = {
  SAVE_QUIZZES: "SAVE_QUIZZES",
  ADD_QUIZ: "ADD_QUIZ",
  SAVE_STUDENT_ATTEMPT: "SAVE_STUDENT_ATTEMPT",
  SAVE_CURRENT_QUESTION: "SAVE_CURRENT_QUESTION",
  SAVE_LAUNCH_QUIZZES: "SAVE_LAUNCH_QUIZZES",
  SAVE_STUDENT_ANSWER: "SAVE_STUDENT_ANSWER",
  SAVE_STUDENT_ATTEMPT_LIST: "SAVE_STUDENT_ATTEMPT_LIST",
  SAVE_NUMBER_QUESTION: "SAVE_NUMBER_QUESTION",
};
export const mutations = {
  [mutationTypes.SAVE_QUIZZES]: (state, quizzes) => {
    if (quizzes.content) {
      quizzes.content = quizzes.content.map((quiz) =>
        Object.assign(quiz, { key: quiz.id })
      );
      state.quizzes = quizzes;
    }
  },
  [mutationTypes.SAVE_STUDENT_ATTEMPT]: (state, studentAttempt) => {
    state.studentAttempt = studentAttempt;
    state.studentAttempt.studentQuestionList = studentAttempt.studentQuestionList.map(
      (ques, i) => Object.assign(ques, { pos: i + 1 })
    );
  },
  [mutationTypes.SAVE_CURRENT_QUESTION]: (state, pos) => {
    if (pos) {
      state.currentQuestion = state.studentAttempt.studentQuestionList.find(
        (ques) => {
          return ques.pos === pos * 1;
        }
      );
    } else {
      state.currentQuestion = state.studentAttempt.studentQuestionList[0];
    }
  },
  [mutationTypes.SAVE_LAUNCH_QUIZZES]: (state, quizzes) => {
    state.launchQuizzes = quizzes;
  },
  [mutationTypes.SAVE_STUDENT_ANSWER]: (
    state,
    { quesId, answerId, questionTypeId }
  ) => {
    let chosenAnswerId = state.currentQuestion.chosenAnswerId;
    if (questionTypeId && questionTypeId === 2) {
      chosenAnswerId = "," + answerId;
    } else {
      if (chosenAnswerId && chosenAnswerId.includes(answerId)) {
        chosenAnswerId = chosenAnswerId.replace(`,${answerId}`, "");
      } else {
        chosenAnswerId += `,${answerId}`;
      }
      chosenAnswerId = chosenAnswerId.replace("null", "");
    }

    state.currentQuestion = { ...state.currentQuestion, chosenAnswerId };
    state.studentAttempt.studentQuestionList = state.studentAttempt.studentQuestionList.map(
      (ques) => {
        if (ques.id === quesId) {
          Object.assign(ques, { chosenAnswerId: chosenAnswerId });
        }
        return ques;
      }
    );
  },
  [mutationTypes.SAVE_STUDENT_ATTEMPT_LIST]: (state, studentAttemptList) => {
    state.studentAttemptList = studentAttemptList;
  },
  [mutationTypes.SAVE_NUMBER_QUESTION]: (state, num) => {
    state.numberOfQuestion = num;
  },
};
