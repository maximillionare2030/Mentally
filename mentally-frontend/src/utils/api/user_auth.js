import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const api = axios.create({
    baseURL: API_BASE_URL,
});

export const signUp = async (nickname, email, password) => {
    try {
        const userData = {
            "email": email,
            "nickname": nickname, // corrected from email to nickname
            "password": password,
        };

        // Sending POST request to the API
        const response = await api.post("/user/signup", userData);

        // If successful, return the response message
        return response.data.message
    } catch (error) {
        console.error('Error signing up:', error.response?.data || error.message);

        // Access the "detail" field and return it
        return error.response?.data?.detail || error.message;  // Return the "detail" message if available
    }
};

export const logIn = async (email, password) => {
    const userData = {
        "email": email,
        "password": password
      }

      try {
        const response = await api.post("/user/login", userData);

        return response.data;
      } catch (error) {
        console.error('Error logging in:', error.response?.data || error.message);
        return error.response?.data?.detail || error.message;  // Return the "detail" message if available
      }

};

export const userPing = async (token) => {
    try {
        const response = await api.post("/user/ping", token);

        return response.data;
    } catch (err) {
        console.error('Error pinging:', err.response?.data || err.message);
        return false;
    }
};

export const getUserData = async (token) => {
    try {
        const response = await api.post("/user/get_user_data", {}, {
            headers: {
                'Authorization': token
            }
        });

        console.log('User data:', response.data); // Ensure the correct response is logged
        return response.data;
    } catch (err) {
        console.error('Error getting user data:', err.response?.data || err.message);
        return false;
    }
}