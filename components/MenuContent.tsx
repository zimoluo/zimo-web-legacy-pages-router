import { useUser } from "./contexts/UserContext";
import GoogleSignInButton from "./GoogleSignInButton";
import Image from "next/image";
import { useEffect } from "react";

const MenuContent = () => {
  const { user } = useUser();

  return (
    <div className="h-full w-full overflow-y-auto px-4">
      <GoogleSignInButton />
      <br />
      <div>
        ur stuff
        <br />
        <br />
        ur name
        <br />
        {user?.name}
        <br />
        ur pic
        <br />
        {user?.profilePic && (
          <Image src={user?.profilePic} height={24} width={24} alt="ur pic" />
        )}
        <br />
        ur mom
        <br />
        {user?.state}
        <br />
        ur things
        <br />
        {JSON.stringify(user)}
      </div>
    </div>
  );
};

export default MenuContent;
