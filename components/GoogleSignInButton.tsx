import React, { useEffect, useState } from "react";
import { evaluateGoogleIdToken } from "@/lib/accountClientManager";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "./contexts/UserContext";
import { useSettings } from "./contexts/SettingsContext";

const GoogleSignInButton: React.FC = () => {
  const { setUser } = useUser();
  const { settings, updateSettingsLocally } = useSettings();

  const [buttonWidth, setButtonWidth] = useState<number>(100);

  useEffect(() => {
    const updateWidth = () => {
      const mediaWidth = window.innerWidth;
      let calculatedWidth: number;

      if (mediaWidth < 768) {
        calculatedWidth = mediaWidth - 100;
      } else {
        calculatedWidth = Math.min(mediaWidth * 0.93, 640) - 100;
      }

      setButtonWidth(calculatedWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const onSuccess = async (tokenResponse: any) => {
    const id_token = tokenResponse.credential;
    const userData = await evaluateGoogleIdToken(id_token, settings);
    if (userData === null) {
      return;
    }
    setUser(userData);
    if (userData.websiteSettings !== null) {
      updateSettingsLocally(userData.websiteSettings);
    }
  };

  const onFailure = () => {
    console.log("Login failed");
  };

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onFailure}
      theme="outline"
      shape="pill"
      logo_alignment="left"
      size="large"
      text="signin_with"
      width={buttonWidth}
    />
  );
};

export default GoogleSignInButton;
