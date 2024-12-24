import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const api = axios.create({
    baseURL: API_BASE_URL,
});

export const signUp = async (nickname, email, password) => {
    try {
        const userData = {
            "email": email,
            "nickname": nickname,
            "password": password,
        };

        console.log("Sending sign-up request with data:", userData);

        const response = await api.post("/user/signup", userData);

        console.log("Sign-up successful. Response data:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error occurred during sign-up.");
        console.error("Response data:", error.response?.data || "No response data");
        console.error("Error message:", error.message);

        return error.response?.data?.detail || error.message;
    }
};

export const logIn = async (email, password) => {
    const userData = {
        "email": email,
        "password": password
    };

    try {
        const response = await api.post("/user/login", userData);

        console.log("Log-in successful. Response data:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error occurred during log-in.");
        console.error("Response data:", error.response?.data || "No response data");
        console.error("Error message:", error.message);

        return error.response?.data?.detail || error.message;
    }
};

export const userPing = async (token) => {
    try {
        console.log("Pinging user with token:", token);

        const response = await api.post("/user/ping", token);

        console.log("Ping successful. Response data:", response.data);

        return response.data;
    } catch (err) {
        console.error("Error occurred during user ping.");
        console.error("Response data:", err.response?.data || "No response data");
        console.error("Error message:", err.message);

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

        console.log("User data fetched successfully. Response data:", response.data);

        return response.data;
    } catch (err) {
        console.error("Error occurred while fetching user data.");
        console.error("Response data:", err.response?.data || "No response data");
        console.error("Error message:", err.message);
        
        if (err.response?.data?.detail?.includes('Token used too early')) {
            console.error("Please check your system clock.");
        }

        return false;
    }
};


export const updateUserData = async (token, mentalHealthData) => {
    try {
        console.log("Preparing to update mental health data with token:", token);
        console.log("Initial mental health data:", mentalHealthData);

        const requestData = {
            happiness: mentalHealthData.happiness,
            sadness: mentalHealthData.sadness,
            fear: mentalHealthData.fear,
            anger: mentalHealthData.anger,
            surprise: mentalHealthData.surprise,
            disgust: mentalHealthData.disgust,
            PHQ_score: mentalHealthData.PHQ_score
        };

        Object.keys(requestData).forEach(key =>
            requestData[key] === undefined && delete requestData[key]
        );

        console.log("Processed mental health data for update:", requestData);

        const headers = {
            "Authorization": token,
            "Content-Type": "application/json"
        };

        console.log("Sending update request with headers:", headers);

        const response = await api.post(
            `/user/update-mental-data`,
            requestData,
            { headers }
        );

        console.log("Mental health data updated successfully. Response data:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error occurred while updating mental health data.");
        console.error("Response data:", error.response?.data || "No response data");
        console.error("Error message:", error.message);

        throw error;
    }
};
