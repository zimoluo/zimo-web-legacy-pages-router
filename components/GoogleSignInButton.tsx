// GoogleSignInButton.tsx

import { fetchDecodedToken, getUserByPayload, setSessionToken } from "@/lib/accountManager";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "./Contexts/UserContext";

const GoogleSignInButton: React.FC = () => {

  const { setUser } = useUser();

  const onSuccess = async (tokenResponse: any) => {
    const id_token = tokenResponse.credential;
    const payload = await fetchDecodedToken(id_token);
    const userData = await getUserByPayload(payload);
    setUser(userData);
    setSessionToken(userData);
  };

  const onFailure = () => {
    console.log("Login failed");
  };

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onFailure}
    />
  );
};

export default GoogleSignInButton;
