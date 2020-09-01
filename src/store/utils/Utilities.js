export const storeQuizLocalStorage = (quiz) => {
  const quizzesStr = localStorage.getItem("quizzes");
  let quizzes;
  if (quizzes) {
    quizzes = JSON.parse(quizzesStr);
    quizzes.push(quiz);
  } else {
    quizzes = [quiz];
  }
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
};

export const setTokenToCookie = (userId, accessToken, refreshToken) => {
  if (userId) document.cookie = `userId=${userId};path=/;`;
  if (accessToken) document.cookie = `accessToken=${accessToken};path=/;`;
  if (refreshToken) document.cookie = `refreshToken=${refreshToken};path=/;`;
};
export const getCookie = (name) => {
  if (document.cookie) {
    const regex = new RegExp(`${name}=(.[^;]*)`, "gi");
    return document.cookie
      .match(regex)[0]
      .toString()
      .replace(`${name}=`, "")
      .trim();
  }
};

export const removeTokenFromCookie = () => {
  document.cookie = "";
};

export const getItemLocalStorage = (name) => {
  const userListLocal = localStorage.getItem(name);
  if (!userListLocal) {
    return null;
  }
  return JSON.parse(userListLocal);
};

export const removeCookie = (name) => {
  document.cookie = name + '=; expires=Fri, 31 Dec 1999 23:59:59 GMT;path=/; domain=localhost:8081;'
}