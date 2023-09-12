import {
  ThemeType,
  notchColorMap,
  sliderBorderColorMap,
  sliderButtonColorMap,
  sliderColorMap,
} from "@/interfaces/themeMaps";
import React, { useState, useRef, useEffect } from "react";

interface SettingsNotchBarProps<T> {
  values: T[];
  text: string[];
  entry: T;
  setValue: (newValue: T) => void;
  theme: ThemeType;
}

const SettingsNotchBar: React.FC<SettingsNotchBarProps<string | number>> = ({
  values,
  setValue,
  entry,
  theme,
  text,
}) => {
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pendingPosition, setPendingPosition] = useState<number | null>(null);

  const sliderColorClass = sliderColorMap[theme];
  const sliderBorderColorClass = sliderBorderColorMap[theme];
  const notchColorClass = notchColorMap[theme];
  const sliderButtonClass = sliderButtonColorMap[theme];

  useEffect(() => {
    if (pendingPosition !== null) {
      const closestNotch = getClosestNotch(pendingPosition);
      if (closestNotch.value !== entry) {
        setValue(closestNotch.value);
      }
      setPendingPosition(null); // Reset the pending position
    }
  }, [pendingPosition, entry, setValue]);

  const handleSetPosition = (positionPercent: number) => {
    // Just set the pending position, actual setting will be done in useEffect
    setPendingPosition(positionPercent);
  };

  const getClosestNotch = (positionPercent: number) => {
    let closestDistance = Infinity;
    let closestNotch = { key: 0, value: values[0], position: 0 };

    values.forEach((value, key) => {
      const notchPositionPercent = (100 / (values.length - 1)) * key;
      const distance = Math.abs(notchPositionPercent - positionPercent);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestNotch = { key, value, position: notchPositionPercent };
      }
    });

    return closestNotch;
  };

  useEffect(() => {
    const key = values.indexOf(entry);
    const position = (100 / (values.length - 1)) * key;
    setSliderPos(position);
  }, [entry]);

  const mouseMoveHandler = (e: MouseEvent) => {
    const positionPercent =
      ((e.clientX - containerRef.current!.getBoundingClientRect().left) /
        containerRef.current!.clientWidth) *
      100;
    handleSetPosition(positionPercent);
  };

  const touchMoveHandler = (e: TouchEvent) => {
    const touch = e.touches[0];
    const positionPercent =
      ((touch.clientX - containerRef.current!.getBoundingClientRect().left) /
        containerRef.current!.clientWidth) *
      100;
    handleSetPosition(positionPercent);
  };

  const mouseUpHandler = () => {
    window.removeEventListener("mousemove", mouseMoveHandler);
    window.removeEventListener("mouseup", mouseUpHandler);
    setIsDragging(false);
  };

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
  };

  const touchStartHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    window.addEventListener("touchmove", touchMoveHandler);
    window.addEventListener("touchend", touchEndHandler);
  };

  const touchEndHandler = () => {
    window.removeEventListener("touchmove", touchMoveHandler);
    window.removeEventListener("touchend", touchEndHandler);
    setIsDragging(false);
  };

  useEffect(() => {
    // Cleanup in case component unmounts
    return () => {
      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", touchEndHandler);
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, []);

  return (
    <div
      className="relative w-full h-16 overflow-hidden select-none"
      ref={containerRef}
    >
      <div
        className={`absolute w-slider-bar h-2 ${sliderBorderColorClass} ${sliderColorClass} border-menu-entry border-opacity-80 bg-opacity-30 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 cursor-pointer`}
        onMouseUp={(e) => {
          const positionPercent =
            ((e.clientX - e.currentTarget.getBoundingClientRect().left) /
              e.currentTarget.clientWidth) *
            100;
          handleSetPosition(positionPercent);
        }}
      >
        {values.map((value, key) => {
          const positionPercent = (100 / (values.length - 1)) * key;
          return (
            <div
              key={key}
              className={`absolute scale-110 rounded-full h-3 w-0.5 -translate-y-0.75 ${notchColorClass} bg-opacity-80 -translate-x-1/2 `}
              style={{ left: `${positionPercent}%` }}
              onClick={() => handleSetPosition(positionPercent)}
            />
          );
        })}
        {text.map((eachText, key) => {
          const positionPercent = (100 / (values.length - 1)) * key;
          let translateXClass = "-translate-x-1/2";
          if (key === 0) {
            translateXClass = "-translate-x-1/4";
          } else if (key === text.length - 1) {
            translateXClass = "-translate-x-2/3";
          }
          return (
            <div
              key={key}
              className={`absolute translate-y-5 ${translateXClass} ${
                sliderPos === positionPercent ? "font-bold" : "font-normal"
              } text-xs select-auto`}
              style={{ left: `${positionPercent}%` }}
              onClick={() => handleSetPosition(positionPercent)}
            >
              {eachText}
            </div>
          );
        })}
        <div
          className="absolute w-full transition duration-300 ease-in-out"
          style={{ transform: `translateX(${sliderPos}%)` }}
        >
          <div
            className={`${sliderBorderColorClass} border-slider shadow-lg w-2.5 h-6 rounded-full transition-all ease-in-out -translate-x-1 -translate-y-2.25 ${
              isDragging
                ? "cursor-grabbing scale-150 bg-slider-highlight"
                : `cursor-grab scale-135 ${sliderButtonClass}`
            }`}
            draggable={true}
            onDragStart={dragStartHandler}
            onDragEnd={mouseUpHandler}
            onTouchStart={touchStartHandler}
            onTouchEnd={touchEndHandler}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsNotchBar;
