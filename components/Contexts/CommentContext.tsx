import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const CommentContext = createContext<
  | {
      comments: CommentEntry[] | null;
      setComments: React.Dispatch<React.SetStateAction<CommentEntry[] | null>>;
      resourceLocation: string | null;
      setResourceLocation: React.Dispatch<React.SetStateAction<string | null>>;
    }
  | undefined
>(undefined);

export function CommentProvider({ children }: Props) {
  const [comments, setComments] = useState<CommentEntry[] | null>(null);
  const [resourceLocation, setResourceLocation] = useState<string | null>(null);

  return (
    <CommentContext.Provider value={{ comments, setComments, resourceLocation, setResourceLocation }}>
      {children}
    </CommentContext.Provider>
  );
}

export const useComments = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
};
