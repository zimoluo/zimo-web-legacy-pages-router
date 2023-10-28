import React, { useEffect, useState } from "react";
import Image from "next/image";
import { isHalloweenSeason } from "@/lib/seasonUtil";

const BlogBackgroundAnimationPainting: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const imageSets = {
    original: ["mountain", "tower", "eunoe"],
    halloween: [
      "bat",
      "skull",
      "tombstone",
      ...Array.from({ length: 5 }, (_, i) => `pumpkin-${i + 1}`),
    ],
  };

  useEffect(() => {
    const currentDate = new Date(new Date().toUTCString());
    let images = imageSets.original;

    if (isHalloweenSeason(currentDate)) {
      images = imageSets.halloween;
    }

    // Add other date-specific conditions here

    const randomIndex = Math.floor(Math.random() * images.length);
    setSelectedImage(images[randomIndex]);
  }, []);

  return selectedImage ? (
    <Image
      src={`/blog-painting-bg/${selectedImage}.svg`}
      alt="Blog Painting"
      height={0}
      width={0}
      className="absolute pointer-events-none painting-size"
      placeholder="empty"
      priority={true}
    />
  ) : null;
};

export default BlogBackgroundAnimationPainting;
