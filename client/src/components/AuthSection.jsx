import { useState } from "react";

const registerDefaults = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  mobile: "",
  birth: "",
};

const loginDefaults = {
  email: "",
  password: "",
};

const AuthSection = ({ onLogin, onRegister, busy }) => {
  const [mode, setMode] = useState("login");
  const [registerForm, setRegisterForm] = useState(registerDefaults);
  const [loginForm, setLoginForm] = useState(loginDefaults);

  const toggleMode = (nextMode) => {
    setMode(nextMode);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      const success = await onLogin(loginForm);
      if (success) {
        setLoginForm(loginDefaults);
      }
    } else {
      const success = await onRegister(registerForm);
      if (success) {
        setRegisterForm(registerDefaults);
        setMode("login");
      }
    }
  };

  return (
    <section className="card auth-card">
      <div className="card-header">
        <button
          className={`pill ${mode === "login" ? "active" : ""}`}
          type="button"
          onClick={() => toggleMode("login")}
        >
          Login
        </button>
        <button
          className={`pill ${mode === "register" ? "active" : ""}`}
          type="button"
          onClick={() => toggleMode("register")}
        >
          Register
        </button>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        {mode === "login" ? (
          <>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Enter password"
                required
              />
            </label>
          </>
        ) : (
          <>
            <label>
              <span>First Name</span>
              <input
                type="text"
                name="first_name"
                value={registerForm.first_name}
                onChange={handleRegisterChange}
                placeholder="Pankaj"
                required
              />
            </label>
            <label>
              <span>Last Name</span>
              <input
                type="text"
                name="last_name"
                value={registerForm.last_name}
                onChange={handleRegisterChange}
                placeholder="Kumar"
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="Secure password"
                required
                minLength={4}
              />
            </label>
            <label>
              <span>Mobile</span>
              <input
                type="tel"
                name="mobile"
                value={registerForm.mobile}
                onChange={handleRegisterChange}
                placeholder="9876543210"
                required
              />
            </label>
            <label>
              <span>Date of Birth</span>
              <input
                type="date"
                name="birth"
                value={registerForm.birth}
                onChange={handleRegisterChange}
                required
              />
            </label>
          </>
        )}

        <button className="primary" type="submit" disabled={busy}>
          {busy
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Create Account"}
        </button>
      </form>
    </section>
  );
};

export default AuthSection;
