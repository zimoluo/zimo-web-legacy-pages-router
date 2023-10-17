import { ThemeType, svgFilterMap } from "@/interfaces/themeMaps";
import Image from "next/image";

interface Props {
  theme?: ThemeType;
}

const SocialMediaButtonArray: React.FC<Props> = ({ theme = "zimo" }) => {
  const filterClass = svgFilterMap[theme];
  const socialMedia = [
    {
      name: "Github",
      url: "https://github.com/zimoluo",
      icon: "/homepage-icons/github.svg",
    },
    {
      name: "Reddit",
      url: "https://www.reddit.com/user/g2245820920",
      icon: "/homepage-icons/reddit.svg",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/zeemoluo/",
      icon: "/homepage-icons/instagram.svg",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/WhiteGkings",
      icon: "/homepage-icons/twitter.svg",
    },
  ];

  return (
    <section className="flex space-x-2.5 text-2xl mt-8 -mb-16">
      <div
        className="flex-grow select-none pointer-events-none"
        aria-hidden="true"
      />
      {socialMedia.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src={platform.icon}
            className={`w-8 h-auto aspect-square ${filterClass} transition-transform duration-300 ease-in-out hover:scale-110`}
            width={16}
            height={16}
            alt={platform.name}
          />
        </a>
      ))}
    </section>
  );
};

export default SocialMediaButtonArray;
