const USER_DATA_KEY = "userData";

export const getStoredUserData = () => {
  const rawUserData = localStorage.getItem(USER_DATA_KEY);
  if (!rawUserData) {
    return null;
  }

  try {
    return JSON.parse(rawUserData);
  } catch (error) {
    localStorage.removeItem(USER_DATA_KEY);
    return null;
  }
};

export const setStoredUserData = (userData) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const clearStoredUserData = () => {
  localStorage.removeItem(USER_DATA_KEY);
};
