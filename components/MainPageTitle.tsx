import { ReactNode } from "react";

interface MainPageTitleProps {
  title: string;
  subtitle: string;
  className?: string;
  children?: ReactNode;
}

const MainPageTitle: React.FC<MainPageTitleProps> = ({
  title,
  subtitle,
  className = "",
  children = undefined,
}) => {
  return (
    <header
      className={`main-page-title main-page-title-desktop flex items-center justify-center px-12 mb-16 ${className}`}
    >
      <h1 className="text-left font-bold text-5xl md:text-6xl">
        {title}
        <div className="text-lg md:text-xl font-normal mt-4">{subtitle}</div>
        {children}
      </h1>
    </header>
  );
};

export default MainPageTitle;
