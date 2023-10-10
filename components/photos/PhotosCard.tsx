import Image from "next/image";
import {
  enrichTextContent,
  formatDate,
  formatLocation,
  imageFallback,
} from "@/lib/util";

type Props = {
  title: string;
  date: string;
  author: string;
  authorProfile: string;
  location?: LocationData;
  instagramLink?: string;
};

const PhotosCard = ({
  title,
  location,
  date,
  author,
  authorProfile,
  instagramLink,
}: Props) => {
  return (
    <div className="mb-14">
      <div className={`flex text-orange-900 items-center`}>
        <div className="flex justify-center items-center w-10 h-auto mr-4">
          <div className="w-full h-auto rounded-full overflow-hidden flex justify-center items-center">
            <Image
              src={authorProfile}
              alt={`${author}'s Profile`}
              className="h-full w-10"
              width={40}
              height={40}
              onError={imageFallback("/favicon.svg")}
            />
          </div>
        </div>

        <div className="grid grid-rows-2">
          <div className="flex justify-start items-center">
            <p className="text-base">{author}</p>
          </div>
          <div className="flex justify-start items-center">
            {location && (
              <Image
                src="/location-pin.svg"
                alt="Location"
                className="h-4 w-auto aspect-square mr-1 opacity-75"
                height={16}
                width={16}
              />
            )}
            <p className={`text-orange-800 text-sm opacity-70`}>
              {`${location ? `${formatLocation(location)} · ` : ""}${formatDate(
                date
              )}`}
            </p>
          </div>
        </div>

        {instagramLink && (
          <div className="flex-grow flex justify-end items-start self-start">
            <a target="_blank" rel="noreferrer" href={instagramLink}>
              <Image
                src="/instagram-logo.svg"
                alt="Open in instagram"
                className="w-6 h-auto aspect-square"
                height={16}
                width={16}
              />
            </a>
          </div>
        )}
      </div>
      <p className="text-lg mt-2 mb-4">{enrichTextContent(title)}</p>
    </div>
  );
};

export default PhotosCard;
