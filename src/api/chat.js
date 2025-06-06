import axios from "axios";

const baseUrl = "https://my-ai-ufbo.vercel.app/api";

export const sendMessage = async (message, history) => {
  try {
    const response = await axios.post(`${baseUrl}/chat`, {
      message,
      history,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
