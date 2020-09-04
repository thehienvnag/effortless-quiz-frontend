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

export const setTokenToCookie = (userId, accessToken, refreshToken, role) => {
  if (userId) document.cookie = `userId=${userId};path=/;`;
  if (accessToken) document.cookie = `accessToken=${accessToken};path=/;`;
  if (refreshToken) document.cookie = `refreshToken=${refreshToken};path=/;`;
  if (role) document.cookie = `role=${role};path=/;`;
};
export const getCookie = (name) => {
  if (document.cookie) {
    const regex = new RegExp(`${name}=(.[^;]*)`, "gi");
    const matchedCookie = document.cookie.match(regex);
    return (
      matchedCookie &&
      matchedCookie[0]
        .toString()
        .replace(`${name}=`, "")
        .trim()
    );
  }
};

export const removeTokenFromCookie = () => {
  removeCookie("userId");
  removeCookie("accessToken");
  removeCookie("refreshToken");
  removeCookie("role");
};

export const getItemLocalStorage = (name) => {
  const userListLocal = localStorage.getItem(name);
  if (!userListLocal) {
    return null;
  }
  return JSON.parse(userListLocal);
};

export const removeCookie = (name) => {
  document.cookie = name + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;path=/;";
};
