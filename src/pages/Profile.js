import { useAuth } from "../components/AuthProvider.js";

const Profile = () => {
  const { user } = useAuth();
  return <div>this is your profile: {JSON.stringify(user)}</div>;
};

export default Profile;
