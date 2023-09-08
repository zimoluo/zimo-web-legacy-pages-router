// GoogleSignInButton.tsx

import { fetchDecodedToken, updateUserByPayload } from "@/lib/accountManager";
import { GoogleLogin } from "@react-oauth/google";

const GoogleSignInButton: React.FC = () => {
  const onSuccess = async (tokenResponse: any) => {
    const id_token = tokenResponse.credential;
    const payload = await fetchDecodedToken(id_token);
    console.log(payload);
    updateUserByPayload(payload);
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
