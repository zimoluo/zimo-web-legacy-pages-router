import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const BlogSearchContext = createContext<
  | {
      blogSearchContent: string;
      setBlogSearchContent: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined
>(undefined);

export function BlogSearchProvider({ children }: Props) {
  const [blogSearchContent, setBlogSearchContent] = useState<string>("");

  return (
    <BlogSearchContext.Provider
      value={{ blogSearchContent, setBlogSearchContent }}
    >
      {children}
    </BlogSearchContext.Provider>
  );
}

export const useBlogSearch = () => {
  const context = useContext(BlogSearchContext);
  if (context === undefined) {
    throw new Error("useBlogSearch must be used within a BlogSearchProvider");
  }
  return context;
};
