interface MainPageTitleProps {
  title: string;
  subtitle: string;
  className?: string;
}

const MainPageTitle: React.FC<MainPageTitleProps> = ({
  title,
  subtitle,
  className = "",
}) => {
  return (
    <header
      className={`main-page-title-height flex items-center justify-center ml-12 mr-12 mt-4 -mb-16 ${className}`}
    >
      <h1 className="text-left font-bold text-5xl md:text-6xl">
        {title}
        <div className="text-lg md:text-xl font-normal mt-4">{subtitle}</div>
      </h1>
    </header>
  );
};

export default MainPageTitle;
