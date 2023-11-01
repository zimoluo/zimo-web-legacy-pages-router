import React from "react";
import { evaluateGoogleAuthCode } from "@/lib/accountClientManager";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "./contexts/UserContext";
import { useSettings } from "./contexts/SettingsContext";

const GoogleSignInButton: React.FC = () => {
  const { setUser } = useUser();
  const { settings, updateSettingsLocally } = useSettings();

  const validateCode = async (codeResponse: any) => {
    const codeAuth = codeResponse.code;
    const userData = await evaluateGoogleAuthCode(codeAuth, settings);
    if (userData === null) {
      return;
    }
    setUser(userData);
    if (userData.websiteSettings !== null) {
      updateSettingsLocally(userData.websiteSettings);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      validateCode(codeResponse);
    },
    flow: "auth-code",
  });

  return <button onClick={login}>click me to try new sign in</button>;
};

export default GoogleSignInButton;
