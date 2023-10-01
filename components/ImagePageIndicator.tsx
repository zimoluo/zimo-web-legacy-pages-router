type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

function ImagePageIndicator({ totalPages, currentPage, onPageChange }: Props) {
  return (
    <div className="flex space-x-1 md:space-x-2">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          className={`w-1.5 md:w-2 rounded-full aspect-square ${
            index === currentPage
              ? "bg-neutral-100 bg-opacity-80"
              : "bg-neutral-800 bg-opacity-40"
          }`}
          onClick={() => {
            if (index === currentPage) {
              return;
            }
            onPageChange(index);
          }}
        ></button>
      ))}
    </div>
  );
}

export default ImagePageIndicator;
