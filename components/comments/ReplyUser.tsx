import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUserDataBySub } from "@/lib/accountClientManager";
import { formatDate, imageFallback } from "@/lib/util";
import {
  ThemeType,
  lightTextColorMap,
  svgFilterMap,
  textColorMap,
} from "@/interfaces/themeMaps";
import { userIconMap } from "@/interfaces/userIconMap";

interface Props {
  sub: string;
  date: string;
  theme: ThemeType;
  toSub: string;
}

const ReplyUser: React.FC<Props> = ({ sub, date, theme, toSub }) => {
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const [userData, setUserData] = useState<UserData | null>(null);
  const [toData, setToData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async (targetSub: string) => {
      const data = await fetchUserDataBySub(targetSub, [
        "name",
        "profilePic",
        "state",
      ]);
      return data;
    };

    const fetchAndSetData = async () => {
      const data = await fetchData(sub);
      setUserData(data);

      if (toSub) {
        const fetchedToData = await fetchData(toSub);
        setToData(fetchedToData);
      }
    };

    fetchAndSetData();
  }, [sub, toSub]);

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
      <div className="flex justify-center items-center w-8 h-auto mr-3">
        <div className="w-full h-auto rounded-full overflow-hidden flex justify-center items-center">
          <Image
            src={userProfile}
            alt={`${userName}'s Profile`}
            className="h-full w-fit"
            width={32}
            height={32}
            onError={imageFallback("/favicon.svg")}
          />
        </div>
      </div>

      <div className="grid grid-rows-2">
        <div className="flex justify-start items-center">
          <p className="text-sm">{userName}</p>
          {userState !== "normal" && (
            <Image
              src={userIconMap[userState]}
              className="ml-1 h-2 md:h-3 w-auto aspect-square object-contain"
              height={20}
              width={20}
              alt={`User is ${userState}`}
            />
          )}
          {toData && (
            <>
              <Image
                className={`mx-1.5 h-2.5 w-auto aspect-square ${svgFilterClass}`}
                src="/reply-to.svg"
                alt="Replies to"
                height={10}
                width={10}
              />
              <p className="text-sm">{toData.name}</p>
              {toData.state !== "normal" && (
                <Image
                  src={userIconMap[toData.state]}
                  className="ml-1 h-2 md:h-3 w-auto aspect-square object-contain"
                  height={20}
                  width={20}
                  alt={`User is ${toData.state}`}
                />
              )}
            </>
          )}
        </div>

        <div className="flex justify-start items-center">
          <p className={`${lightTextColorClass} text-xs opacity-70`}>
            {`${formatDate(date)}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReplyUser;
