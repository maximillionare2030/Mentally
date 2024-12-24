import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const api = axios.create({
    baseURL: API_BASE_URL,
});

export const generate_response = async (prompt) => {
    try {
        console.log("Received prompt: " , prompt);
        const response = await api.post("/openai/generate-mental-health-tests", {
            prompt: prompt // Send as an object with the 'prompt' key
        });
        console.log("API Response:",  response.data);
        return response.data;
    } catch (err) {
        console.error("Error generating response:", err);
        throw err;
    }
};

