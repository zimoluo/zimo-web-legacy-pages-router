import React, { useEffect, useRef, useState } from "react";
import { ThemeType, textColorMap } from "@/interfaces/themeMaps";
import CommentCard from "./CommentCard";
import { useComments } from "../contexts/CommentContext";
import { fetchComments } from "@/lib/accountManager";
import { ReplyProvider } from "../contexts/ReplyContext";
import { useSettings } from "../contexts/SettingsContext";

interface Props {
  theme: ThemeType;
  resourceLocation: string;
}

const CommentCardColumn: React.FC<Props> = ({ theme, resourceLocation }) => {
  const { settings } = useSettings();

  const {
    setComments,
    comments: contextComments,
    setResourceLocation,
  } = useComments();

  useEffect(() => {
    setResourceLocation(resourceLocation);
  }, [resourceLocation]);

  useEffect(() => {
    const fetchAndSetComments = async () => {
      const comments = await fetchComments(resourceLocation);
      if (comments && comments.length > 0) {
        setComments(comments);
      } else {
        setComments([]);
      }
    };

    // Calling fetchAndSetComments immediately
    fetchAndSetComments();

    // Setting up the interval to call fetchAndSetComments every 10 seconds
    const intervalId = setInterval(fetchAndSetComments, 10000);

    // Clearing the interval when the component unmounts or the resourceLocation changes.
    return () => clearInterval(intervalId);
  }, [resourceLocation]); // Added resourceLocation as a dependency as it’s used inside the effect

  if (settings.disableComments) {
    const textColorClass = textColorMap[theme];
    return (
      <section className={`flex justify-center items-center ${textColorClass}`}>
        <p>Comments are disabled.</p>
      </section>
    );
  }

  return (
    <section>
      {contextComments &&
        contextComments.map((comment, index) => (
          <ReplyProvider key={index}>
            <CommentCard index={index} theme={theme} />
          </ReplyProvider>
        ))}
    </section>
  );
};

export default CommentCardColumn;
