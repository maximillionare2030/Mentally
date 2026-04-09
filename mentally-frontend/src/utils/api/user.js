import { apiClient, getErrorMessage } from "./client";

export const signUp = async (nickname, email, password) => {
  try {
    const response = await apiClient.post("/user/signup", {
      email,
      nickname,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to sign up."));
  }
};

export const logIn = async (email, password) => {
  try {
    const response = await apiClient.post("/user/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to log in."));
  }
};

export const userPing = async (token) => {
  try {
    const response = await apiClient.post("/user/ping", {}, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    return false;
  }
};

export const getUserData = async (token) => {
  try {
    const response = await apiClient.post(
      "/user/get_user_data",
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch user data."));
  }
};


export const updateUserData = async (token, mentalHealthData) => {
  try {
    const requestData = {
      happiness: mentalHealthData.happiness,
      sadness: mentalHealthData.sadness,
      fear: mentalHealthData.fear,
      anger: mentalHealthData.anger,
      surprise: mentalHealthData.surprise,
      disgust: mentalHealthData.disgust,
      PHQ_score: mentalHealthData.PHQ_score,
      BDI_score: mentalHealthData.BDI_score,
      notes: mentalHealthData.notes,
    };

    Object.keys(requestData).forEach((key) => {
      if (requestData[key] === undefined) {
        delete requestData[key];
      }
    });

    const response = await apiClient.post("/user/update-mental-data", requestData, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to update mental health data."));
  }
};


export const getUserHistory = async (token, userId) => {
  try {
    const response = await apiClient.post(`/user/get-user-history?user_id=${userId}`, {}, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch user history."));
  }
};
