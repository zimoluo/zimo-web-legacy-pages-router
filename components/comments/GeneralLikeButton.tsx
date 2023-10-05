import {
  ThemeType,
  generalLikeEmptySrc,
  generalLikeFilledSrc,
  lightTextColorMap,
} from "@/interfaces/themeMaps";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../contexts/UserContext";
import {
  fetchGeneralLike,
  uploadGeneralLike,
} from "@/lib/accountClientManager";
import Head from "next/head";

interface Props {
  theme: ThemeType;
  resourceLocation: string;
}

const GeneralLikeButton: React.FC<Props> = ({ theme, resourceLocation }) => {
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [storedLikedBy, setStoredLikedBy] = useState<string[] | null>(null);
  const { user, setUser } = useUser();
  const lightTextColorClass =
    lightTextColorMap[theme] || lightTextColorMap["zimo"];
  const likeButtonEmptyImage =
    generalLikeEmptySrc[theme] || generalLikeEmptySrc["zimo"];
  const likeButtonFilledImage =
    generalLikeFilledSrc[theme] || generalLikeFilledSrc["zimo"];

  useEffect(() => {
    const fetchAndSetLikedBy = async () => {
      const fetchedLikedBy = await fetchGeneralLike(resourceLocation);
      if (!isLiking) {
        if (fetchedLikedBy) {
          setStoredLikedBy(fetchedLikedBy);
        } else {
          setStoredLikedBy([]);
        }
      }
    };

    // Calling fetchAndSetComments immediately
    fetchAndSetLikedBy();

    // Setting up the interval to call fetchAndSetComments every 5 seconds
    const intervalId = setInterval(fetchAndSetLikedBy, 5000);

    // Clearing the interval when the component unmounts or the resourceLocation changes.
    return () => clearInterval(intervalId);
  }, [resourceLocation]); // Added resourceLocation as a dependency as it’s used inside the effect

  const shouldRevealFilled = useMemo(() => {
    if (!user || !storedLikedBy) {
      return false;
    }

    return storedLikedBy.includes(user.sub);
  }, [user, storedLikedBy]);

  async function evaluateLike() {
    if (
      isLiking ||
      !user ||
      !resourceLocation ||
      !storedLikedBy ||
      user.state === "banned"
    )
      return;

    setIsLiking(true);

    const userSub = user.sub;

    // Temporarily update the client side for better user experience
    let temporaryLikedBy = storedLikedBy;
    if (storedLikedBy.includes(userSub)) {
      // Return a new comment object with the userSub removed from the likedBy array
      temporaryLikedBy = storedLikedBy.filter((sub) => sub != userSub);
    } else {
      // Return a new comment object with the userSub added to the likedBy array
      temporaryLikedBy = [...storedLikedBy, userSub];
    }

    setStoredLikedBy(temporaryLikedBy);

    // Now, update the state
    const updatedLikedBy = await uploadGeneralLike(resourceLocation!);
    setStoredLikedBy(updatedLikedBy);

    setIsLiking(false);
  }

  return (
    <div className="flex items-center">
      <Head>
        <link rel="preload" as="image" href={likeButtonEmptyImage} />
        <link rel="preload" as="image" href={likeButtonFilledImage} />
      </Head>
      <button
        onClick={evaluateLike}
        className={`${isLiking ? "cursor-wait" : ""} relative group`}
      >
        <Image
          alt="Like Button"
          className={`h-6 w-auto aspect-square transform transition-transform duration-300 group-hover:scale-110`}
          height={24}
          width={24}
          src={likeButtonEmptyImage}
        />
        <Image
          alt="Like Button"
          aria-hidden={true}
          className={`h-6 w-auto aspect-square left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute transform transition-all duration-300 group-hover:scale-110 ${
            shouldRevealFilled ? "opacity-100" : "opacity-0"
          }`}
          height={24}
          width={24}
          src={likeButtonFilledImage}
        />
      </button>
      <div
        className={`ml-1.5 ${lightTextColorClass} text-lg ${
          storedLikedBy ? "" : "opacity-0"
        }`}
      >
        {storedLikedBy ? storedLikedBy.length : "0"}
      </div>
    </div>
  );
};

export default GeneralLikeButton;
