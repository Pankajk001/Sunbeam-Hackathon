import { useCallback, useEffect, useMemo, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  registerUser,
  loginUser,
  updateProfile,
  updatePassword,
  fetchMovies,
  fetchReviews,
  createReview,
  editReview,
  removeReview,
} from "./api";
import {
  clearAuth,
  decodeToken,
  getStoredAuth,
  persistAuth,
} from "./utils/auth";
import AuthPage from "./pages/AuthPage";
import MoviesPage from "./pages/MoviesPage";
import ReviewsPage from "./pages/ReviewsPage";
import AccountPage from "./pages/AccountPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import "./App.css";

const App = () => {
  const stored = getStoredAuth();
  const [auth, setAuth] = useState({
    token: stored.token,
    profile: stored.profile,
  });
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [authBusy, setAuthBusy] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  const isAuthenticated = Boolean(auth.token);
  const userId = auth.profile?.id || null;
  const navigate = useNavigate();

  const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message ||
    error?.message ||
    fallback ||
    "Something went wrong";

  const loadMovies = useCallback(async () => {
    const response = await fetchMovies();
    setMovies(response.data?.data || []);
  }, []);

  const loadReviews = useCallback(async () => {
    const response = await fetchReviews();
    setReviews(response.data?.data || []);
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      await Promise.all([loadMovies(), loadReviews()]);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to fetch dashboard data"));
    } finally {
      setLoadingDashboard(false);
    }
  }, [loadMovies, loadReviews]);

  useEffect(() => {
    if (auth.token) {
      loadDashboard();
    } else {
      setMovies([]);
      setReviews([]);
    }
  }, [auth.token, loadDashboard]);

  const handleRegister = async (payload) => {
    setAuthBusy(true);
    try {
      await registerUser(payload);
      toast.success("Account created! You can login now.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to register"));
      return false;
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogin = async (payload) => {
    setAuthBusy(true);
    try {
      const response = await loginUser(payload);
      const { token, first_name, last_name, email } = response.data?.data || {};
      if (!token) {
        throw new Error("Token missing in response");
      }
      const decoded = decodeToken(token);
      const profile = {
        id: decoded?.id,
        first_name,
        last_name,
        email,
      };
      persistAuth(token, profile);
      setAuth({ token, profile });
      toast.success(`Welcome back, ${first_name}!`);
      navigate("/movies", { replace: true });
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Invalid credentials"));
      return false;
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setAuth({ token: null, profile: null });
    toast.success("You have been logged out");
    navigate("/auth", { replace: true });
  };

  const handleProfileUpdate = async (payload) => {
    setProfileBusy(true);
    try {
      await updateProfile(payload);
      const { first_name, last_name, email, mobile, birth } = payload;
      const updatedProfile = {
        ...auth.profile,
        first_name,
        last_name,
        email,
        mobile,
        birth,
      };
      setAuth((prev) => ({ ...prev, profile: updatedProfile }));
      persistAuth(auth.token, updatedProfile);
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update profile"));
      return false;
    } finally {
      setProfileBusy(false);
    }
  };

  const handlePasswordChange = async (payload) => {
    setProfileBusy(true);
    try {
      await updatePassword(payload);
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update password"));
      return false;
    } finally {
      setProfileBusy(false);
    }
  };

  const handleCreateReview = async (payload) => {
    setReviewBusy(true);
    try {
      await createReview(payload);
      toast.success("Review added!");
      await loadReviews();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to add review"));
      return false;
    } finally {
      setReviewBusy(false);
    }
  };

  const handleEditReview = async (id, payload) => {
    setReviewBusy(true);
    try {
      await editReview(id, payload);
      toast.success("Review updated");
      await loadReviews();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update review"));
      return false;
    } finally {
      setReviewBusy(false);
    }
  };

  const handleDeleteReview = async (movieId) => {
    setReviewBusy(true);
    try {
      await removeReview(movieId);
      toast.success("Review deleted");
      await loadReviews();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete review"));
    } finally {
      setReviewBusy(false);
    }
  };

  const welcomeMessage = useMemo(() => {
    if (!auth.profile) return "Movie Review Studio";
    return `Hi ${auth.profile.first_name}, ready for your next review?`;
  }, [auth.profile]);

  const outletContext = {
    auth,
    movies,
    reviews,
    userId,
    profileBusy,
    reviewBusy,
    onUpdateProfile: handleProfileUpdate,
    onChangePassword: handlePasswordChange,
    onCreateReview: handleCreateReview,
    onEditReview: handleEditReview,
    onDeleteReview: handleDeleteReview,
  };

  return (
    <div className="app-shell">
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/movies" : "/auth"} replace />
          }
        />
        <Route
          path="/auth"
          element={
            <AuthPage
              busy={authBusy}
              onLogin={handleLogin}
              onRegister={handleRegister}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          element={
            <ProtectedLayout
              isAuthenticated={isAuthenticated}
              auth={auth}
              onLogout={handleLogout}
              welcomeMessage={welcomeMessage}
              loading={loadingDashboard}
              outletContext={outletContext}
            />
          }
        >
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
