import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUserDataBySecureSub } from "@/lib/accountManager";
import { formatDate, imageFallback } from "@/lib/util";
import { ThemeType, lightTextColorMap, textColorMap } from "@/interfaces/themeMaps";
import { userIconMap } from "@/interfaces/userIconMap";

interface Props {
  secureSub: string;
  date: string;
  theme: ThemeType;
}

const CommentUser: React.FC<Props> = ({ secureSub, date, theme }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserDataBySecureSub(secureSub, [
        "name",
        "profilePic",
        "state",
      ]);
      setUserData(data);
    };

    fetchData();
  }, [secureSub]);

  const lightTextColorClass = lightTextColorMap[theme];
  const textColorClass = textColorMap[theme];

  if (!userData) return <div className="my-2 h-10">Loading...</div>;

  const {
    name: userName,
    profilePic: userProfile,
    state: userState,
  } = userData;

  return (
    <div className={`flex my-2 ${textColorClass}`}>
      <div className="flex justify-center items-center w-10 h-auto mr-4">
        <div className="w-full h-auto rounded-full overflow-hidden flex justify-center items-center">
          <Image
            src={userProfile}
            alt={`${userName}'s Profile`}
            className="h-full w-fit"
            width={40}
            height={40}
            onError={imageFallback("/favicon.svg")}
          />
        </div>
      </div>

      <div className="grid grid-rows-2">
        <div className="flex justify-start items-center">
          <p className="text-md">{userName}</p>
          {userState !== "normal" && (
            <Image
              src={userIconMap[userState]}
              className="ml-1.5 h-4 md:h-5 w-auto aspect-square object-contain"
              height={20}
              width={20}
              alt={`User is ${userState}`}
            />
          )}
        </div>

        <div className="flex justify-start items-center">
          <p className={`${lightTextColorClass} text-sm opacity-70`}>
            {`${formatDate(date)}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentUser;
