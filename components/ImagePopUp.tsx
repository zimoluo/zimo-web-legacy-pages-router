import {
  addActivePopup,
  isActivePopup,
  removeActivePopup,
  shimmerDataURL,
} from "@/lib/util";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface Props {
  src: string;
  onClose: () => void;
  altText?: string;
}

const ImagePopUp: React.FC<Props> = ({ src, onClose, altText = "" }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleImageClick = () => {
    window.open(src, "_blank");
  };

  const instanceRef = useRef({}); // Create a unique object reference

  useEffect(() => {
    // Mark this popup as active
    addActivePopup(instanceRef.current);

    // Storing current ref to ensure stable reference in cleanup
    const currentRef = instanceRef.current;

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        // Check if this popup is the active one
        if (isActivePopup(currentRef)) {
          // Remove the active popup
          removeActivePopup(currentRef);
          // Close the popup
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      // Cleanup
      window.removeEventListener("keydown", handleEscape);
      removeActivePopup(currentRef);
    };
  }, [onClose]);

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
    <div className="fixed inset-0 flex items-center justify-center z-80 px-12 py-12">
      <Image
        src={src}
        alt={`${altText ? altText : "Zoomed-In Image"}`}
        className="image-popup-size object-contain opacity-0 cursor-zoom-in"
        style={style}
        height={4000}
        width={4000}
        quality={90}
        placeholder={`data:image/svg+xml;base64,${shimmerDataURL(100, 100)}`}
        onClick={handleImageClick}
      />
      <button className="absolute top-3 right-3 z-50" onClick={onClose}>
        <Image
          src="/image-view-cross.svg"
          alt="Close Image Window"
          width={16}
          height={16}
          className="h-4 w-auto opacity-80 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-125"
        />
      </button>
    </div>
  );
};

export default ImagePopUp;
