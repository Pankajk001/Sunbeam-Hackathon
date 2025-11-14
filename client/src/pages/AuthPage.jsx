import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthSection from "../components/AuthSection";

const AuthPage = ({ onLogin, onRegister, busy, isAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/movies", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      <header className="page-hero">
        <p className="eyebrow">Movie Review Application</p>
        <h1>Movie Review Studio</h1>
        <p className="muted">
          Track every opinion in one place. Register or login to manage reviews.
        </p>
      </header>
      <div className="auth-layout">
        <AuthSection onLogin={onLogin} onRegister={onRegister} busy={busy} />
        <section className="card intro-card">
          <h2>Why use this dashboard?</h2>
          <ul>
            <li>Create secure account & manage password</li>
            <li>Browse curated movie list from the server</li>
            <li>Post, edit, or delete your personal reviews</li>
            <li>Responsive UI fits desktop and mobile screens</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;

