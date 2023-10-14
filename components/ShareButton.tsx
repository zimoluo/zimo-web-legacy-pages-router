import React, { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { downloadHtml } from "@/lib/about/util";

type Props = {
  title: string;
  description: string;
  url: string;
  platform:
    | "mobile"
    | "facebook"
    | "twitter"
    | "linkedin"
    | "copy"
    | "reddit"
    | "downloadHtml";
  className?: string;
  theme?: string;
};

const mobileIconThemeMap: { [key: string]: string } = {
  blog: "/share/general-share-blog.svg",
  projects: "/share/general-share-projects.svg",
};

const copyIconThemeMap: { [key: string]: string } = {
  blog: "/share/copy-icon-blog.svg",
  projects: "/share/copy-icon-projects.svg",
  about: "/share/copy-icon-about.svg",
  zimo: "/share/copy-icon-zimo.svg",
};

const copiedIconThemeMap: { [key: string]: string } = {
  blog: "/share/copy-success-blog.svg",
  projects: "/share/copy-success-projects.svg",
  about: "/share/copy-success-about.svg",
  zimo: "/share/copy-success-zimo.svg",
};

const downloadHtmlThemeMap: { [key: string]: string } = {
  about: "/share/download-as-html-about.svg",
  zimo: "/share/download-as-html-zimo.svg",
};

const failedIconThemeMap: { [key: string]: string } = {
  blog: "/share/copy-failed-blog.svg",
  projects: "/share/copy-failed-projects.svg",
  about: "/share/copy-failed-about.svg",
  zimo: "/share/copy-failed-zimo.svg",
};

function ShareButton({
  title,
  description,
  url,
  platform,
  className = "",
  theme = "blog",
}: Props) {
  const iconMap: { [key: string]: string } = {
    mobile: mobileIconThemeMap[theme],
    mobileprojects: "/zimo-favicon.svg",
    facebook: "/share/facebook-icon.svg",
    twitter: "/share/twitter-icon.svg",
    linkedin: "/share/linkedin-icon.svg",
    copy: copyIconThemeMap[theme],
    copied: copiedIconThemeMap[theme],
    failed: failedIconThemeMap[theme],
    reddit: "/share/reddit-icon.svg",
    downloadHtml: downloadHtmlThemeMap[theme],
  };

  const [iconState, setIconState] = useState<string>(platform);
  const [isOpaque, setOpacity] = useState<boolean>(true);
  const [shareInProgress, setShareInProgress] = useState<boolean>(false);
  const [isButtonAvailable, setButtonAvailable] = useState<boolean>(true);

  const initiateAnimation = (newIconState: string) => {
    setOpacity(false);
    setButtonAvailable(false);
    setTimeout(() => {
      setIconState(newIconState);
      setOpacity(true);
    }, 300); // animation duration
    setTimeout(() => {
      setOpacity(false);
    }, 1300); // time until next fade-out
    setTimeout(() => {
      setIconState(platform);
      setOpacity(true);
    }, 1600); // time until icon reset
    setTimeout(() => {
      setButtonAvailable(true);
    }, 1900);
  };

  const handleShare = () => {
    if (!isButtonAvailable) return;

    if (platform === "mobile") {
      handleMobileShare();
      return;
    }

    if (platform === "copy") {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          initiateAnimation("copied");
        })
        .catch(() => {
          initiateAnimation("failed");
        });
      return;
    }

    if (platform === "downloadHtml") {
      downloadHtml(description, title);
      return;
    }

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
          description
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}`;
        break;
    }
    window.open(shareUrl, "_blank");
  };

  const handleMobileShare = async () => {
    if (shareInProgress) return; // Exit function if a share operation is already in progress

    setShareInProgress(true); // Mark mobile share operation as in-progress
    try {
      await navigator.share({ text: title, url });
      // You can handle a successful share here if needed
    } catch (e) {
      // Handle failure or cancelation
    } finally {
      setShareInProgress(false); // Reset mobile share operation status
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`${
        isOpaque ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300 ease-in-out ${className}`}
    >
      {platform === "copy" ? (
        <Head>
          <link
            rel="preload"
            as="image"
            href="/share/copy-success-projects.svg"
          />
          <link rel="preload" as="image" href="/share/copy-success-blog.svg" />
          <link rel="preload" as="image" href="/share/copy-success-about.svg" />
          <link rel="preload" as="image" href="/share/copy-success-zimo.svg" />
          <link
            rel="preload"
            as="image"
            href="/share/copy-failed-projects.svg"
          />
          <link rel="preload" as="image" href="/share/copy-failed-blog.svg" />
          <link rel="preload" as="image" href="/share/copy-failed-about.svg" />
          <link rel="preload" as="image" href="/share/copy-failed-zimo.svg" />
        </Head>
      ) : (
        ""
      )}
      <Image
        src={iconMap[iconState]}
        alt={iconState}
        width={24}
        height={24}
        className="h-6 w-6"
      />
    </button>
  );
}

export default ShareButton;
