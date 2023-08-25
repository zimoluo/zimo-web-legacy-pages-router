import ZimoBackgroundAnimation from "./BackgroundAnimations/ZimoBackgroundAnimation";
import PhotosBackgroundAnimation from "./BackgroundAnimations/PhotosBackgroundAnimation";
import BlogBackgroundAnimation from "./BackgroundAnimations/BlogBackgroundAnimation";
import AboutBackgroundAnimation from "./BackgroundAnimations/AboutBackgroundAnimation";
import ProjectsBackgroundAnimation from "./BackgroundAnimations/ProjectsBackgroundAnimation";
import { ThemeType } from './themeMaps';

interface BackgroundAnimationProps {
  theme: ThemeType;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ theme }) => {
  const AnimationMap: { [key in ThemeType]: React.ReactNode } = {
    zimo: <ZimoBackgroundAnimation />,
    photos: <PhotosBackgroundAnimation />,
    projects: <ProjectsBackgroundAnimation />,
    blog: <BlogBackgroundAnimation />,
    about: <AboutBackgroundAnimation />,
  };

  return <>{AnimationMap[theme]}</>;
};

export default BackgroundAnimation;
