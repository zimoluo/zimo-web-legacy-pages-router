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
  refreshUserState,
  uploadGeneralLike,
} from "@/lib/accountManager";
import { decryptSub } from "@/lib/encryptSub";
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
      if (fetchedLikedBy) {
        setStoredLikedBy(fetchedLikedBy);
      } else {
        setStoredLikedBy([]);
      }
    };

    const smoothFetch = async () => {
      if (isLiking) return;
      await fetchAndSetLikedBy();
    };

    // Calling fetchAndSetComments immediately
    fetchAndSetLikedBy();

    // Setting up the interval to call fetchAndSetComments every 5 seconds
    const intervalId = setInterval(smoothFetch, 5000);

    // Clearing the interval when the component unmounts or the resourceLocation changes.
    return () => clearInterval(intervalId);
  }, [resourceLocation]); // Added resourceLocation as a dependency as it’s used inside the effect

  const shouldRevealFilled = useMemo(() => {
    if (!user || !storedLikedBy) {
      return false;
    }

    return storedLikedBy.includes(decryptSub(user.secureSub));
  }, [user, storedLikedBy]);

  async function evaluateLike() {
    if (isLiking || !user || !resourceLocation || !storedLikedBy) return;

    const newUser = await refreshUserState(user, setUser);

    if (newUser.state === "banned") return;

    setIsLiking(true);

    const decryptedSub = decryptSub(user.secureSub);

    // Temporarily update the client side for better user experience
    let temporaryLikedBy = storedLikedBy;
    if (storedLikedBy.includes(decryptedSub)) {
      // Return a new comment object with the decryptedSub removed from the likedBy array
      temporaryLikedBy = storedLikedBy.filter((sub) => sub != decryptedSub);
    } else {
      // Return a new comment object with the decryptedSub added to the likedBy array
      temporaryLikedBy = [...storedLikedBy, decryptedSub];
    }

    setStoredLikedBy(temporaryLikedBy);

    const downloadedLikedBy = await fetchGeneralLike(resourceLocation);

    let updatedLikedBy = downloadedLikedBy;

    if (downloadedLikedBy.includes(decryptedSub)) {
      // Return a new comment object with the decryptedSub removed from the likedBy array
      updatedLikedBy = downloadedLikedBy.filter((sub) => sub != decryptedSub);
    } else {
      // Return a new comment object with the decryptedSub added to the likedBy array
      updatedLikedBy = [...downloadedLikedBy, decryptedSub];
    }

    // Now, update the state
    await uploadGeneralLike(resourceLocation!, updatedLikedBy);
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
