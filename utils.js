// utils.js
export const checkApiError = (response) => {
  if (response.error) {
    if (response.error.code === 403) {
      throw new Error("YouTube API quota exceeded. Please try again later.");
    } else if (response.error.code === 400) {
      throw new Error("Invalid request to YouTube API.");
    } else {
      throw new Error("YouTube API error: " + response.error.message);
    }
  }
  return response;
};
