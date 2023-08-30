import ZimoBackgroundAnimation from "./BackgroundAnimations/ZimoBackgroundAnimation";
import PhotosBackgroundAnimation from "./BackgroundAnimations/PhotosBackgroundAnimation";
import BlogBackgroundAnimation from "./BackgroundAnimations/BlogBackgroundAnimation";
import AboutBackgroundAnimation from "./BackgroundAnimations/AboutBackgroundAnimation";
import ProjectsBackgroundAnimation from "./BackgroundAnimations/ProjectsBackgroundAnimation";
import PhotosBackgroundAnimationWebkit from "./BackgroundAnimations/PhotoBackgroundAnimationWebkit";
import { ThemeType } from '../interfaces/themeMaps';
import { useEffect, useState } from 'react';

interface BackgroundAnimationProps {
  theme: ThemeType;
}

function isWebkit(): boolean {
  if (typeof window !== 'undefined') {
    const ua = window.navigator.userAgent;
    return /WebKit/.test(ua) && !/Chrome/.test(ua) && !/Chromium/.test(ua);
  }
  return false;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ theme }) => {
  const [isWebkitBrowser, setIsWebkitBrowser] = useState<boolean>(false);

  useEffect(() => {
    setIsWebkitBrowser(isWebkit());
  }, []);

  const AnimationMap: { [key in ThemeType]: React.ReactNode } = {
    zimo: <ZimoBackgroundAnimation />,
    photos: isWebkitBrowser ? <PhotosBackgroundAnimationWebkit /> : <PhotosBackgroundAnimation />,
    projects: <ProjectsBackgroundAnimation />,
    blog: <BlogBackgroundAnimation />,
    about: <AboutBackgroundAnimation />,
  };

  return <>{AnimationMap[theme]}</>;
};

export default BackgroundAnimation;
