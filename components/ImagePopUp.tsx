import { addActivePopup, isActivePopup, removeActivePopup } from "@/lib/util";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface Props {
  src: string;
  onClose: () => void;
  altText?: string;
}

const ImagePopUp: React.FC<Props> = ({ src, onClose, altText = "" }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const instanceRef = useRef({}); // Create a unique object reference

  useEffect(() => {
    // Mark this popup as active
    addActivePopup(instanceRef.current);

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        // Check if this popup is the active one
        if (isActivePopup(instanceRef.current)) {
          // Remove the active popup
          removeActivePopup(instanceRef.current);
          // Close the popup
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      // Cleanup
      window.removeEventListener("keydown", handleEscape);
      removeActivePopup(instanceRef.current);
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
    <div className="fixed inset-0 flex items-center justify-center z-50 px-12 py-12">
      <Image
        src={src}
        alt={`${altText ? altText : "Zoomed-In Image"}`}
        className="image-popup-size object-contain opacity-0"
        style={style}
        height={800}
        width={800}
      />
      <button className="absolute top-3 right-3 z-50" onClick={onClose}>
        <Image
          src="/image-view-cross.svg"
          alt="Close Image Window"
          width={16}
          height={16}
          className="h-4 w-auto opacity-60 mix-blend-plus-lighter transform transition-transform duration-300 hover:scale-125"
        />
      </button>
    </div>
  );
};

export default ImagePopUp;
