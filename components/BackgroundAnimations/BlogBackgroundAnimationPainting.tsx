import React, { useEffect, useState } from "react";
import Image from "next/image";

type Month =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

type DateRange = {
  start: { month: Month; day: number };
  end: { month: Month; day: number };
  images: string[];
};

const BlogBackgroundAnimationPainting: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const monthNames: Month[] = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const imageSets: DateRange[] = [
    {
      start: { month: "october", day: 15 },
      end: { month: "november", day: 15 },
      images: [
        "bat",
        "skull",
        "tombstone",
        ...Array.from({ length: 5 }, (_, i) => `pumpkin-${i + 1}`),
      ],
    },
  ];

  useEffect(() => {
    const currentDate = new Date();
    let images = ["mountain", "tower", "eunoe"]; // default images

    for (const { start, end, images: seasonalImages } of imageSets) {
      const startMonth = monthNames.indexOf(start.month);
      const endMonth = monthNames.indexOf(end.month);

      if (startMonth === -1 || endMonth === -1) {
        console.error("Invalid month name in imageSets");
        continue;
      }

      const startDate = new Date(
        currentDate.getFullYear(),
        startMonth,
        start.day
      );
      const endDate = new Date(currentDate.getFullYear(), endMonth, end.day);

      if (currentDate >= startDate && currentDate <= endDate) {
        images = seasonalImages;
        break;
      }
    }

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
