import React, { useEffect } from "react";
import ShareButton from "./ShareButton";

type Props = {
  title: string;
  description: string;
  url: string;
};

const platforms: string[] = ["twitter", "facebook", "reddit", "linkedin"];

function ShareButtonBar({ title, description, url }: Props) {
  const [isMobileShareAvailable, setIsMobileShareAvailable] =
    React.useState(false);
  const [isBarHidden, setIsBarHidden] = React.useState(true);

  useEffect(() => {
    setIsMobileShareAvailable("share" in navigator);
  }, []);

  useEffect(() => {
    setIsBarHidden(false);
  }, []);

  return (
    <div className={`${isBarHidden ? "hidden" : "flex"}`}>
      {isMobileShareAvailable ? (
        <ShareButton
          title={title}
          description={description}
          url={url}
          platform="mobile"
          className="ml-3"
          theme="blog"
        />
      ) : (
        platforms.map((platform) => (
          <ShareButton
            key={platform}
            title={title}
            description={description}
            url={url}
            platform={platform as any}
            className="ml-3"
            theme="blog"
          />
        ))
      )}
      {/* Copy button is always visible */}
      <ShareButton
        title={title}
        description={description}
        url={url}
        platform="copy"
        className="ml-3"
        theme="blog"
      />
    </div>
  );
}

export default ShareButtonBar;
