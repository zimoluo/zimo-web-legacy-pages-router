import { useEffect, useMemo, useRef } from "react";
import { useBlogSearch } from "./contexts/BlogSearchContext";
import ArticleCardWrapper from "./ArticleCardWrapper";
import { ArticleCardProps } from "@/interfaces/articleCardData";
import { ThemeType } from "@/interfaces/themeMaps";
import { restoreDisplayText } from "@/lib/util";

type Props = {
  posts: ArticleCardProps[];
  theme?: ThemeType;
};

const ArticleCardGrid = ({ posts, theme = "zimo" }: Props) => {
  const { blogSearchContent } = useBlogSearch();

  function usePrevious<T>(value: T): T {
    const ref = useRef<T>(value);
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  const processSearchContent = (searchContent: string) => {
    return searchContent
      .trim()
      .split(/[,;，；]+/)
      .map((term) => term.trim())
      .filter(Boolean);
  };

  const doesMatchTextFilter = (text: string, searchTerm: string) => {
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const advancedFilter = (post: ArticleCardProps) => {
    // If search content is empty, include all (non-unlisted) posts
    if (!blogSearchContent.trim()) return true;

    // Process search content into array of search terms
    const searchTerms = processSearchContent(blogSearchContent);

    // Check each search term against the post
    return searchTerms.every((term) => {
      // If post.description exists, check it against the search term. Otherwise, just check the title.
      return (
        doesMatchTextFilter(post.title, term) ||
        (post.description &&
          doesMatchTextFilter(restoreDisplayText(post.description), term))
      );
    });
  };

  const visibilityArray = posts.map((post) => advancedFilter(post));

  const prevVisibilityArray = usePrevious(visibilityArray);

  const timeoutArray = useMemo(() => {
    const arrayLength = visibilityArray.length;
    const timeouts = new Array(arrayLength).fill(0);
    const INITIAL_DELAY = 0;
    const INITIAL_INCREMENT = 160;
    const MIN_DELAY = 80;
    const decayRate = Math.random() * 0.15 + 0.8;

    const calculateDelay = (currentDelay: number, decrement: number) => {
      const delay = currentDelay;
      const newDecrement = Math.max(MIN_DELAY, decrement * decayRate);
      const newDelay = currentDelay + newDecrement;
      return [delay, newDelay, newDecrement];
    };

    let currentDelayForVisible = INITIAL_DELAY;
    let currentDelayForNotVisible = INITIAL_DELAY;
    let decrementForVisible = INITIAL_INCREMENT * decayRate;
    let decrementForNotVisible = INITIAL_INCREMENT * decayRate;

    visibilityArray.forEach((isVisible, index) => {
      if (isVisible === prevVisibilityArray[index]) {
        [timeouts[index], currentDelayForVisible, decrementForVisible] =
          calculateDelay(currentDelayForVisible, decrementForVisible);
        currentDelayForNotVisible = INITIAL_DELAY;
        decrementForNotVisible = INITIAL_INCREMENT - decayRate;
      } else {
        [timeouts[index], currentDelayForNotVisible, decrementForNotVisible] =
          calculateDelay(currentDelayForNotVisible, decrementForNotVisible);
        currentDelayForVisible = INITIAL_DELAY;
        decrementForVisible = INITIAL_INCREMENT - decayRate;
      }
    });

    return timeouts;
  }, [visibilityArray]);

  return (
    <div className="grid grid-cols-1 mb-24 px-8 md:px-36">
      {posts.map((post, index) => (
        <ArticleCardWrapper
          key={index}
          {...post}
          theme={theme}
          isVisible={visibilityArray[index]}
          timeout={timeoutArray[index]}
          duration={Math.min(
            280,
            2800 /
              visibilityArray.filter((val, i) => val !== prevVisibilityArray[i])
                .length
          )}
        />
      ))}
    </div>
  );
};

export default ArticleCardGrid;
