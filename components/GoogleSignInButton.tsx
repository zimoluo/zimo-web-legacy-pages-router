// GoogleSignInButton.tsx

import {
  fetchDecodedToken,
  getUserByPayload,
  setSessionToken,
} from "@/lib/accountManager";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "./contexts/UserContext";
import { useSettings } from "./contexts/SettingsContext";

const GoogleSignInButton: React.FC = () => {
  const { setUser } = useUser();
  const { updateSettings } = useSettings();

  const onSuccess = async (tokenResponse: any) => {
    const id_token = tokenResponse.credential;
    const payload = await fetchDecodedToken(id_token);
    const userData = await getUserByPayload(payload);
    setUser(userData);
    await setSessionToken(userData);
    if (userData.websiteSettings !== null) {
      updateSettings(userData.websiteSettings);
    }
  };

  const onFailure = () => {
    console.log("Login failed");
  };

  return <GoogleLogin onSuccess={onSuccess} onError={onFailure} />;
};

export default GoogleSignInButton;
