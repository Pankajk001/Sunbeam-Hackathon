import http from "./http";

export const registerUser = (payload) => http.post("/users/register", payload);
export const loginUser = (payload) => http.post("/users/login", payload);
export const updateProfile = (payload) =>
  http.put("/users/editprofile", payload);
export const updatePassword = (payload) =>
  http.put("/users/changepassword", payload);

export const fetchMovies = () => http.get("/movies/getAllMovies");
export const fetchReviews = () => http.get("/movies/getAllReviews");
export const createReview = (payload) =>
  http.post("/movies/createReview", payload);
export const editReview = (id, payload) =>
  http.put(`/movies/editReview/${id}`, payload);
export const removeReview = (movieId) =>
  http.delete(`/movies/deleteReview/${movieId}`);
