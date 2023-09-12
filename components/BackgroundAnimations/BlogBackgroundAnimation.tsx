import Image from "next/image";
import BlogBackgroundAnimationPainting from "./BlogBackgroundAnimationPainting";
import { useSettings } from "../contexts/SettingsContext";

const BlogBackgroundAnimation = () => {
  const { settings } = useSettings();

  return (
    <>
      <div className="fixed inset-0 -z-20 flex items-center justify-center h-screen pointer-events-none opacity-40 select-none">
        <Image
          src="/blog-pane-eunoe.svg"
          alt="Eunoe Text"
          height={2000}
          width={1200}
          className="object-cover w-full h-full"
          placeholder="empty"
          priority={true}
        />
      </div>

      {settings.backgroundRichness === "rich" && (
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10 select-none">
          <Image
            src="/blog-painting-base-glow.svg"
            alt="Blog Painting"
            height="0"
            width="0"
            layout="fixed"
            className="absolute pointer-events-none painting-size animate-move-painting-glow"
            placeholder="empty"
            priority={true}
          />
          <Image
            src="/blog-painting-base-orb.svg"
            alt="Blog Painting"
            height="0"
            width="0"
            layout="fixed"
            className="absolute pointer-events-none painting-size"
            placeholder="empty"
            priority={true}
          />
          {!settings.disableCenterPainting && (
            <BlogBackgroundAnimationPainting />
          )}
        </div>
      )}
    </>
  );
};

export default BlogBackgroundAnimation;
