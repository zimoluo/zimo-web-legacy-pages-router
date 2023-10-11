import {
  ThemeType,
  hundredBgColorMap,
  lightBgColorMap,
  progressBarBgColorMap,
  slightlyDarkBgColorMap,
  svgFilterMap,
  textColorMap,
} from "@/interfaces/themeMaps";
import React, { FC, useEffect, useState } from "react";
import { useAudioPlayer } from "react-use-audio-player";
import Image from "next/image";

interface Props {
  url: string;
  title?: string;
  author?: string;
  coverUrl?: string;
  theme: ThemeType;
}

const MusicPlayerCard: FC<Props> = ({
  url,
  title,
  author,
  coverUrl,
  theme,
}) => {
  const [trackTime, setTrackTime] = useState(0);
  const [rate, setLocalRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  const trackTitle = title || "Audio Track";

  const {
    play,
    pause,
    playing,
    duration,
    setRate,
    seek,
    getPosition,
    load,
    loop,
  } = useAudioPlayer();

  useEffect(() => {
    load(url);
  }, [load, url]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrackTime(getPosition());
    }, 1000);

    return () => clearInterval(timer);
  }, [getPosition]);

  useEffect(() => {
    setRate(rate);
  }, [rate, setRate]);

  useEffect(() => {
    loop(isLooping);
  }, [isLooping, loop]);

  function formatTime(time: number, duration: number) {
    time = Math.floor(time);
    duration = Math.floor(duration);

    const partsTime = [
      Math.floor(time / 86400),
      Math.floor((time % 86400) / 3600),
      Math.floor((time % 3600) / 60),
      time % 60,
    ];
    const maxIdxDuration = [86400, 3600, 60, 1].findIndex(
      (t, i, a) => duration >= t
    );

    return partsTime
      .slice(maxIdxDuration)
      .map((t) => t.toString().padStart(2, "0"))
      .join(":");
  }

  const defaultCover = "/placeholder-audio-cover.svg";
  const progressBarPercentage = (trackTime / duration) * 100;

  const progressBarBgColorClass = progressBarBgColorMap[theme];
  const hundredBgClass = hundredBgColorMap[theme];
  const lightBgClass = lightBgColorMap[theme];
  const slightlyDarkBgClass = slightlyDarkBgColorMap[theme];
  const textColorClass = textColorMap[theme];
  const svgFilterClass = svgFilterMap[theme];

  return (
    <div
      className={`${lightBgClass} ${textColorClass} p-4 shadow-lg w-full bg-opacity-50 backdrop-blur-xl rounded-xl flex`}
    >
      <div
        className={`w-24 self-center md:w-32 h-auto aspect-square rounded-xl overflow-hidden ${slightlyDarkBgClass} bg-opacity-90 shrink-0 mr-2 md:mr-3`}
      >
        <Image
          src={coverUrl || defaultCover}
          alt={`Cover of ${trackTitle}`}
          className="w-full h-auto object-cover"
          width={128}
          height={128}
        />
      </div>
      <div className="flex-grow flex flex-col justify-center">
        <h2 className="text-lg md:text-xl font-bold">{trackTitle}</h2>
        {author && <h3 className="text-lg md:text-xl">{author}</h3>}
        <div className="flex-grow select-none pointer-events-none" />
        <div className="flex w-full mb-1">
          <div className="w-0 relative">
            <div className="whitespace-nowrap left-0 absolute flex">
              <Image
                className={`w-5 mr-0.5 h-auto aspect-square ${svgFilterClass}`}
                width={20}
                height={20}
                src="/playback-speed.svg"
                alt="Playback Speed"
              />
              <div>{`${rate}x`}</div>
            </div>
          </div>
          <div className="flex items-center justify-end md:justify-center flex-grow space-x-2 md:space-x-1.5">
            <button className="" onClick={() => seek(0)}>
              <Image
                className={`w-5 h-auto aspect-square ${svgFilterClass} transition-transform duration-300 ease-in-out hover:scale-110`}
                width={20}
                height={20}
                src="/back-to-start.svg"
                alt="Back to start"
              />
            </button>
            <button
              className=""
              onClick={() => setLocalRate(Math.max(0.25, rate - 0.25))}
            >
              <Image
                className={`w-5 h-auto aspect-square ${svgFilterClass} transition-transform duration-300 ease-in-out hover:scale-110`}
                width={20}
                height={20}
                src="/speed-up-down.svg"
                alt="Slow down"
              />
            </button>
            <button className="" onClick={playing ? pause : play}>
              <Image
                className={`w-5 h-auto aspect-square ${svgFilterClass} transition-transform duration-300 ease-in-out hover:scale-110`}
                width={20}
                height={20}
                src={playing ? "/pause-track.svg" : "play-track.svg"}
                key={playing ? "/pause-track.svg" : "play-track.svg"}
                alt={playing ? "Pause" : "Play"}
              />
            </button>
            <button
              className=""
              onClick={() => setLocalRate(Math.min(2, rate + 0.25))}
            >
              <Image
                className={`w-5 h-auto aspect-square ${svgFilterClass} rotate-180 transition-transform duration-300 ease-in-out hover:scale-110`}
                width={20}
                height={20}
                src="/speed-up-down.svg"
                alt="Speed up"
              />
            </button>
            <button
              className="relative group"
              onClick={() => setIsLooping(!isLooping)}
            >
              <Image
                className={`w-5 h-auto aspect-square ${svgFilterClass} transition-transform duration-300 ease-in-out group-hover:scale-110`}
                src="/loop-track-off.svg"
                height={20}
                width={20}
                alt="Loop or not loop track"
              />
              <Image
                className={`select-none pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-auto aspect-square ${svgFilterClass} transition-all duration-300 ease-in-out group-hover:scale-110 ${
                  isLooping ? "opacity-100" : "opacity-0"
                }`}
                src="/loop-track.svg"
                height={20}
                width={20}
                alt="Loop or not loop track"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <span>{formatTime(trackTime, duration)}</span>
          <div
            className={`mx-2 flex-grow ${hundredBgClass} bg-opacity-90 rounded-lg h-2 cursor-pointer`}
            onClick={(e) => {
              const rect = (e.target as HTMLDivElement).getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              seek(percentage * duration);
            }}
          >
            <div
              style={{ width: `${progressBarPercentage}%` }}
              className={`${progressBarBgColorClass} rounded-lg h-2`}
            ></div>
          </div>
          <span>{formatTime(duration - trackTime, duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerCard;
