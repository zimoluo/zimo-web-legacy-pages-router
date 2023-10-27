import {
  ThemeType,
  generalLikeEmptySrc,
  generalLikeFilledSrc,
  lightTextColorMap,
} from "@/interfaces/themeMaps";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { fetchGeneralLike, updateLikedBy } from "@/lib/accountClientManager";
import Head from "next/head";

interface Props {
  theme: ThemeType;
  resourceLocation: string;
  positioned?: "left" | "right";
}

const GeneralLikeButton: React.FC<Props> = ({
  theme,
  resourceLocation,
  positioned = "right",
}) => {
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [storedLikedBy, setStoredLikedBy] = useState<string[] | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipTimeoutRef = useRef<any | null>(null);

  const isLikingRef = useRef(isLiking);
  const { user } = useUser();
  const lightTextColorClass =
    lightTextColorMap[theme] || lightTextColorMap["zimo"];
  const likeButtonEmptyImage =
    generalLikeEmptySrc[theme] || generalLikeEmptySrc["zimo"];
  const likeButtonFilledImage =
    generalLikeFilledSrc[theme] || generalLikeFilledSrc["zimo"];

  const handleMouseEnter = () => {
    if (!user) {
      // Clear any existing timeout to prevent unintended behavior
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    // Clear any existing timeout to prevent unintended behavior
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setIsTooltipVisible(false);
  };

  const handleClick = () => {
    if (!user && !isTooltipVisible) {
      setIsTooltipVisible(true);
      tooltipTimeoutRef.current = setTimeout(() => {
        setIsTooltipVisible(false);
      }, 2000);
    } else {
      evaluateLike();
    }
  };

  useEffect(() => {
    isLikingRef.current = isLiking;
  }, [isLiking]);

  useEffect(() => {
    const fetchAndSetLikedBy = async () => {
      if (isLikingRef.current) return;
      const fetchedLikedBy = await fetchGeneralLike(resourceLocation);
      if (isLikingRef.current) return;
      if (fetchedLikedBy) {
        setStoredLikedBy(fetchedLikedBy);
      } else {
        setStoredLikedBy([]);
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
    const updatedLikedBy = await updateLikedBy(resourceLocation!);
    setStoredLikedBy(updatedLikedBy);

    setIsLiking(false);
  }

  return (
    <div className="flex items-center relative">
      <Head>
        <link rel="preload" as="image" href={likeButtonEmptyImage} />
        <link rel="preload" as="image" href={likeButtonFilledImage} />
      </Head>
      <button
        onClick={handleClick}
        className={`${isLiking ? "cursor-wait" : ""} relative group`}
        disabled={isLiking}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
          aria-hidden="true"
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
      <div
        className={`${
          isTooltipVisible ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 ease-in-out bg-opacity-60 w-40 text-center absolute ${
          positioned === "right"
            ? "right-0 translate-x-4 translate-y-6"
            : "left-0 -translate-x-3 -translate-y-5"
        } bg-neutral-800 text-neutral-50 text-sm px-2.5 py-1 rounded-full select-none pointer-events-none`}
      >
        Sign in to leave a like!
      </div>
    </div>
  );
};

export default GeneralLikeButton;
