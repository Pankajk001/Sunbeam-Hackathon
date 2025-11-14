import { useEffect, useState } from "react";

const ProfileSection = ({
  profile,
  onUpdateProfile,
  onChangePassword,
  busy,
}) => {
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    birth: "",
    password: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileForm((prev) => ({
        ...prev,
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
        birth: profile.birth || "",
      }));
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    const success = await onUpdateProfile(profileForm);
    if (success) {
      setProfileForm((prev) => ({ ...prev, password: "" }));
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    const success = await onChangePassword(passwordForm);
    if (success) {
      setPasswordForm({ oldPassword: "", newPassword: "" });
    }
  };

  return (
    <section className="card profile-card">
      <h2>Account</h2>
      <form className="form-grid" onSubmit={submitProfile}>
        <label>
          <span>First Name</span>
          <input
            type="text"
            name="first_name"
            value={profileForm.first_name}
            onChange={handleProfileChange}
            required
          />
        </label>
        <label>
          <span>Last Name</span>
          <input
            type="text"
            name="last_name"
            value={profileForm.last_name}
            onChange={handleProfileChange}
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={profileForm.email}
            onChange={handleProfileChange}
            required
          />
        </label>
        <label>
          <span>Mobile</span>
          <input
            type="tel"
            name="mobile"
            value={profileForm.mobile}
            onChange={handleProfileChange}
            placeholder="Update mobile"
            required
          />
        </label>
        <label>
          <span>Date of Birth</span>
          <input
            type="date"
            name="birth"
            value={profileForm.birth}
            onChange={handleProfileChange}
            required
          />
        </label>
        <label>
          <span>Current Password</span>
          <input
            type="password"
            name="password"
            value={profileForm.password}
            onChange={handleProfileChange}
            placeholder="Confirm to update profile"
            required
          />
        </label>
        <button className="primary" type="submit" disabled={busy}>
          {busy ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <div className="divider" />

      <form className="form-grid" onSubmit={submitPassword}>
        <label>
          <span>Old Password</span>
          <input
            type="password"
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
            required
          />
        </label>
        <label>
          <span>New Password</span>
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            minLength={4}
            required
          />
        </label>
        <button className="secondary" type="submit" disabled={busy}>
          {busy ? "Updating..." : "Change Password"}
        </button>
      </form>
    </section>
  );
};

export default ProfileSection;
