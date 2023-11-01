import React from "react";
import { evaluateGoogleAuthCode } from "@/lib/accountClientManager";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "./contexts/UserContext";
import { useSettings } from "./contexts/SettingsContext";
import Image from "next/image";
import { ThemeType } from "@/interfaces/themeMaps";

interface Props {
  theme: ThemeType;
}

const GoogleSignInButton: React.FC<Props> = ({ theme }) => {
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

  return (
    <button onClick={login} className="flex items-center w-full rounded-full">
      <Image
        src="/google-logo.svg"
        className="h-10 md:h-14 w-auto aspect-square"
        height={64}
        width={64}
        alt="Google's logo"
      />
      <div className="text-lg md:text-xl ml-2.5 font-bold">
        Sign in with Google
      </div>
    </button>
  );
};

export default GoogleSignInButton;
