import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUserDataBySub } from "@/lib/accountClientManager";
import { formatDate, imageFallback } from "@/lib/util";
import {
  ThemeType,
  lightTextColorMap,
  textColorMap,
} from "@/interfaces/themeMaps";
import { userIconMap } from "@/interfaces/userIconMap";

interface Props {
  sub: string;
  date: string;
  theme: ThemeType;
}

const CommentUser: React.FC<Props> = ({ sub, date, theme }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserDataBySub(sub, [
        "name",
        "profilePic",
        "state",
      ]);

      setUserData(data);
    };

    fetchData();
  }, [sub]);

  const lightTextColorClass = lightTextColorMap[theme];
  const textColorClass = textColorMap[theme];

  if (!userData) return <div className="my-2 h-10" />;

  const {
    name: userName,
    profilePic: userProfile,
    state: userState,
  } = userData;

  return (
    <div className={`flex ${textColorClass} items-center`}>
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
          <p className="text-base">{userName}</p>
          {userState !== "normal" && (
            <Image
              src={userIconMap[userState]}
              className="ml-1.5 h-3 md:h-4 w-auto aspect-square object-contain"
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
