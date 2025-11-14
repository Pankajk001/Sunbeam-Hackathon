export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export const getStoredAuth = () => {
  const token = localStorage.getItem("movie_review_token");
  const profile = localStorage.getItem("movie_review_profile");
  return {
    token,
    profile: profile ? JSON.parse(profile) : null,
  };
};

export const persistAuth = (token, profile) => {
  localStorage.setItem("movie_review_token", token);
  localStorage.setItem("movie_review_profile", JSON.stringify(profile));
};

export const clearAuth = () => {
  localStorage.removeItem("movie_review_token");
  localStorage.removeItem("movie_review_profile");
};
