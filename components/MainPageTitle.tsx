interface MainPageTitleProps {
  title: string;
  subtitle: string;
  className?: string;
}

const MainPageTitle: React.FC<MainPageTitleProps> = ({ title, subtitle, className }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center ml-12 mr-12 -mt-12 ${className}`}>
      <div className="text-left font-bold text-6xl">
        {title}
        <div className="text-xl font-normal mt-4">
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default MainPageTitle;
