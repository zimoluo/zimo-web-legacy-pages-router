const ReadingBlur: React.FC = () => {

  return (
    <div className="flex justify-center items-center fixed inset-0 -z-5">
      <div
      className={`backdrop-blur pointer-events-none h-full w-full select-none`}
    >
    </div>
    </div>
    
  );
};

export default ReadingBlur;
