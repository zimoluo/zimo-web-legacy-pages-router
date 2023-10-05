import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface Cache {
  [sub: string]: CacheUserData;
}

interface UserDataCacheContextProps {
  cache: Cache;
  setCache: React.Dispatch<React.SetStateAction<Cache>>;
  addCache: (sub: string, data: CacheUserData) => void;
  clearCache: () => void;
  removeCache: (sub: string) => void;
}

const UserDataCacheContext = createContext<
  UserDataCacheContextProps | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

export const UserDataCacheProvider: React.FC<Props> = ({ children }) => {
  const [cache, setCache] = useState<Cache>({});

  const addCache = useCallback(
    (sub: string, data: CacheUserData) => {
      setCache((prevCache) => ({
        ...prevCache,
        [sub]: data,
      }));
    },
    [setCache]
  );

  const clearCache = () => setCache({});

  const removeCache = useCallback((sub: string) => {
    setCache(prevCache => {
      const { [sub]: _, ...newCache } = prevCache;
      return newCache;
    });
  }, []);

  useEffect(() => {
    const clearCacheTimer = setTimeout(clearCache, 30 * 60 * 1000); // Clear cache every half an hour within session

    return () => clearTimeout(clearCacheTimer); // Cleanup timer on unmount
  }, [setCache]);

  return (
    <UserDataCacheContext.Provider
      value={{ cache, setCache, addCache, clearCache, removeCache }}
    >
      {children}
    </UserDataCacheContext.Provider>
  );
};

export const useUserDataCache = (): UserDataCacheContextProps => {
  const context = useContext(UserDataCacheContext);
  if (!context) {
    throw new Error(
      "useUserDataCache must be used within a UserDataCacheProvider"
    );
  }
  return context;
};
