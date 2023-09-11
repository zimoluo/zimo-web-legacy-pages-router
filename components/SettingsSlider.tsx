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
  onClick: (data: { key: number; value: T }) => void;
  initialValue?: T;
  theme: ThemeType;
}

const SettingsNotchBar: React.FC<SettingsNotchBarProps<string>> = ({
  values,
  onClick,
  initialValue,
  theme,
}) => {
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sliderColorClass = sliderColorMap[theme];
  const sliderBorderColorClass = sliderBorderColorMap[theme];
  const notchColorClass = notchColorMap[theme];
  const sliderButtonClass = sliderButtonColorMap[theme];

  const handleSetPosition = (positionPercent: number) => {
    const closestNotch = getClosestNotch(positionPercent);
    setSliderPos(closestNotch.position);
    onClick({ key: closestNotch.key, value: closestNotch.value });
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
    if (initialValue) {
      const key = values.indexOf(initialValue);
      const position = (100 / (values.length - 1)) * key;
      setSliderPos(position);
    }
  }, [initialValue, values]);

  const mouseMoveHandler = (e: MouseEvent) => {
    const positionPercent =
      ((e.clientX - containerRef.current!.getBoundingClientRect().left) /
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

  return (
    <div className="relative w-full h-8" ref={containerRef}>
      <div
        className={`absolute w-full h-2 ${sliderBorderColorClass} ${sliderColorClass} border-menu-entry border-opacity-80 bg-opacity-30 top-1/2 -translate-y-1/2 cursor-pointer`}
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
              className={`absolute bg-black scale-110 rounded-full h-3 w-0.5 -translate-y-0.75 ${notchColorClass} bg-opacity-80 -translate-x-1/2 `}
              style={{ left: `${positionPercent}%` }}
              onClick={() => handleSetPosition(positionPercent)}
            ></div>
          );
        })}
        <div
          className="absolute w-full transition duration-300 ease-in-out"
          style={{ transform: `translateX(${sliderPos}%)` }}
        >
          <div
            className={`${sliderBorderColorClass} ${sliderButtonClass} scale-150 border-slider w-2.5 h-6 rounded-full -translate-x-1 -translate-y-2.25 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            draggable={true}
            onDragStart={dragStartHandler}
            onDragEnd={mouseUpHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsNotchBar;
