import { apiClient, getErrorMessage } from "./client";

export const generateResponse = async (prompt) => {
  try {
    const response = await apiClient.post("/openai/generate-mental-health-tests", {
      prompt,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to generate AI response."));
  }
};

export const generateBuddyResponse = async (prompt, mentalHealthData) => {
  try {
    const response = await apiClient.post("/openai/chat-bot-buddy", {
      request: { prompt },
      data: mentalHealthData,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to generate chatbot response."));
  }
};



