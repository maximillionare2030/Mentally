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

        return response.data.token;
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

        return response.data;
    } catch (err) {
        console.error('Error getting user data:', err.response?.data || err.message);
        return false;
    }
}


export const updateUserData = async (token, mentalHealthData) => {
    try {
        // Prepare the request data
        const requestData = {
            happiness: mentalHealthData.happiness,
            sadness: mentalHealthData.sadness,
            fear: mentalHealthData.fear,
            anger: mentalHealthData.anger,
            surprise: mentalHealthData.surprise,
            disgust: mentalHealthData.disgust,
            PHQ_score: mentalHealthData.PHQ_score
        };

        // Remove undefined fields
        Object.keys(requestData).forEach(key => 
            requestData[key] === undefined && delete requestData[key]
        );

        // Define the request headers
        const headers = {
            "Authorization": token,
            "Content-Type": "application/json"
        };

        // Make the API call to update mental health data
        const response = await api.post(
            `/user/update-mental-data`,
            requestData,
            { headers }
        );

        // Check if the response was successful
        if (response.status === 200) {
            console.log("Mental health data updated successfully:", response.data);
            return response.data;
        } else {
            throw new Error("Failed to update mental health data.");
        }
    } catch (error) {
        console.error("Error updating mental health data:", error);
        throw error;
    }
};


/**
 * 
 * Example call
 *     const handleUpdateData = async () => {
         const token = JSON.parse(localStorage.getItem('userData'))?.currentJWT;
 
         const mentalHealthData = {
             happiness: 8,
             sadness: 2,
             fear: 3,
             anger: 1,
             surprise: 5,
             disgust: 0,
             PHQ_score: 69999,
         };
     
         try {
             const result = await updateUserData(token, mentalHealthData);
             console.log('Updated mental health data:', result);
             // Handle success (e.g., display a success message)
         } catch (error) {
             console.error('Failed to update mental health data:', error);
             // Handle error (e.g., display an error message)
         }
     };
 
     handleUpdateData()
 */