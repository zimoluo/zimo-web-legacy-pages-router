import Image from "next/image";
import { formatAltText, formatDate, imageFallback } from "@/lib/util";
import { getProjectFavicon } from "@/lib/projects/util";

type Props = {
  title: string;
  description: string;
  date: string;
  author: string;
  slug: string;
  location: string;
};

const PhotosCard = ({
  title,
  description,
  location,
  date,
  author,
  slug,
}: Props) => {
  return (
      <></>
  );
};

export default PhotosCard;
