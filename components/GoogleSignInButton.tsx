import React, { useEffect, useState } from 'react';
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
  
  const [buttonWidth, setButtonWidth] = useState<number>(100); // initial width in pixels

  useEffect(() => {
    const updateWidth = () => {
      const mediaWidth = window.innerWidth;
      let calculatedWidth: number;
      
      if (mediaWidth < 768) {
        calculatedWidth = mediaWidth - 100;
      } else {
        calculatedWidth = Math.min(mediaWidth * 0.9, 640) - 100; // 40rem is 640px
      }

      setButtonWidth(calculatedWidth);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const onSuccess = async (tokenResponse: any) => {
    const id_token = tokenResponse.credential;
    const payload = await fetchDecodedToken(id_token);
    const userData = await getUserByPayload(payload);
    setUser(userData);
    await setSessionToken(userData.secureSub);
    if (userData.websiteSettings !== null) {
      updateSettings(userData.websiteSettings);
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
