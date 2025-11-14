import { NavLink, Navigate, Outlet } from "react-router-dom";

const tabs = [
  { path: "/movies", label: "Movies" },
  { path: "/reviews", label: "Reviews" },
  { path: "/account", label: "Account" },
];

const ProtectedLayout = ({
  isAuthenticated,
  auth,
  onLogout,
  welcomeMessage,
  loading,
  outletContext,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="protected-layout">
      <header className="app-header">
        <div>
          <p className="eyebrow">Movie Review Application</p>
          <h1>{welcomeMessage}</h1>
          <p className="muted">
            Browse titles, add reviews, and keep your profile up to date.
          </p>
        </div>
        <div className="user-chip">
          <div>
            <p>
              {auth.profile?.first_name} {auth.profile?.last_name}
            </p>
            <span>{auth.profile?.email}</span>
          </div>
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {loading && <p className="muted center">Loading dashboard...</p>}

      <main className="page-container">
        <Outlet context={outletContext} />
      </main>
    </div>
  );
};

export default ProtectedLayout;

