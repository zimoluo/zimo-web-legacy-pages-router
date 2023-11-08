import React, { useRef, useState } from "react";
import { evaluateGoogleAuthCode } from "@/lib/accountClientManager";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "./contexts/UserContext";
import { useSettings } from "./contexts/SettingsContext";
import Image from "next/image";

const GoogleSignInButton: React.FC = () => {
  const { setUser } = useUser();
  const { settings, updateSettingsLocally } = useSettings();
  const [prompt, setPrompt] = useState("Sign in with Google");
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const promptRef = useRef<HTMLDivElement | null>(null);

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
    onError: () => {
      handleError();
    },
  });

  const handleError = () => {
    if (!promptRef.current) {
      return;
    }
    setIsPromptVisible(false);

    const handleTransitionEnd = () => {
      if (!promptRef.current) return;
      promptRef.current.removeEventListener(
        "transitionend",
        handleTransitionEnd
      );

      setPrompt("Open Zimo Web in a Browser to Sign in");
      setIsPromptVisible(true);
    };

    promptRef.current.addEventListener("transitionend", handleTransitionEnd);
  };

  return (
    <button
      onClick={login}
      className="flex items-center w-full rounded-full"
      onError={handleError}
    >
      <Image
        src="/google-logo.svg"
        className="h-12 md:h-16 w-auto aspect-square"
        height={64}
        width={64}
        alt="Google's logo"
      />
      <div
        className={`text-lg md:text-xl ml-2.5 font-bold transition-opacity duration-300 ease-in-out ${
          isPromptVisible ? "opacity-100" : "opacity-0"
        }`}
        ref={promptRef}
      >
        {prompt}
      </div>
    </button>
  );
};

export default GoogleSignInButton;
