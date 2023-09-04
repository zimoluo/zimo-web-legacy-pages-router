import Image from "next/image";
import { useState, useEffect } from "react";

interface Props {
  src: string;
  onClose: () => void;
}

const ImagePopUp: React.FC<Props> = ({ src, onClose }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // Initial styles when mounted becomes true
    setStyle({
      opacity: 0,
      transform: "scale(1.25)",
    });

    // Animate to final styles
    setTimeout(() => {
      setStyle({
        opacity: 1,
        transform: "scale(1)",
        transition: "opacity 200ms, transform 200ms",
      });
    }, 100);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-12 py-12">
      <Image
        src={src}
        alt="Uncropped Image"
        className="image-popup-size object-contain opacity-0"
        style={style}
        height={800}
        width={800}
      />
      <button className="absolute top-4 right-4 z-50" onClick={onClose}>
        <Image
          src="/image-view-cross.svg"
          alt="Close Image Window"
          width={32}
          height={32}
          className="h-8 w-auto opacity-60 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-125"
        />
      </button>
    </div>
  );
};

export default ImagePopUp;
