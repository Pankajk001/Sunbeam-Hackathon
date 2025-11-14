import { useOutletContext } from "react-router-dom";
import ProfileSection from "../components/ProfileSection";

const AccountPage = () => {
  const { auth, onUpdateProfile, onChangePassword, profileBusy } = useOutletContext();

  return (
    <ProfileSection
      profile={auth.profile}
      onUpdateProfile={onUpdateProfile}
      onChangePassword={onChangePassword}
      busy={profileBusy}
    />
  );
};

export default AccountPage;

