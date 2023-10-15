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
      className={`main-page-title-height flex items-center justify-center ml-12 mr-12 -mb-24 ${className}`}
    >
      <h1 className="text-left font-bold text-6xl">
        {title}
        <div className="text-xl font-normal mt-4">{subtitle}</div>
      </h1>
    </header>
  );
};

export default MainPageTitle;
