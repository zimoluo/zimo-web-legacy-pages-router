import {
  ThemeType,
  hundredBgColorMap,
  lightBgColorMap,
  progressBarBgColorMap,
  slightlyDarkBgColorMap,
  svgFilterMap,
  textColorMap,
} from "@/interfaces/themeMaps";
import React, { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import $ from "jquery";
import Head from "next/head";

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
  const trackTitle = title || "Audio Track";

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>(url);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState<boolean>(false);

  function calculateSeekPosition(clientX: number) {
    if (seekBarRef.current) {
      const rect = seekBarRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = x / rect.width;
      seek(percentage * duration);
    }
  }

  const handleStart = (clientX: number) => {
    setIsInteracting(true);
    calculateSeekPosition(clientX);
  };

  const handleMove = (clientX: number) => {
    if (isInteracting) {
      calculateSeekPosition(clientX);
    }
  };

  const handleEnd = () => {
    setIsInteracting(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => handleEnd();

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => handleEnd();

    if (isInteracting) {
      // Adding listeners to the document to ensure they always register
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      // Cleaning up listeners from the document
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isInteracting]);

  function getAudioMetaData(src: string): Promise<HTMLAudioElement> {
    setIsMetadataLoaded(false);
    return new Promise(function (resolve) {
      var audio = new Audio();

      $(audio).on("loadedmetadata", function () {
        resolve(audio);
      });

      audio.preload = "metadata";
      audio.src = src;
    });
  }

  useEffect(() => {
    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio?.addEventListener("play", handlePlay);
    audio?.addEventListener("pause", handlePause);

    return () => {
      audio?.removeEventListener("play", handlePlay);
      audio?.removeEventListener("pause", handlePause);
    };
  }, [audioRef]);

  useEffect(() => {
    const audioElement = audioRef.current;
    const updateCurrentTime = () => setCurrentTime(audioElement!.currentTime);

    audioElement?.addEventListener("timeupdate", updateCurrentTime);
    return () =>
      audioElement?.removeEventListener("timeupdate", updateCurrentTime);
  }, [audioRef]);

  useEffect(() => {
    getAudioMetaData(url).then((audio) => {
      setIsMetadataLoaded(true);
      setDuration(audio.duration);
    });
  }, [url]);

  const seek = (timeInSeconds: number): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
    }
  };

  const changeRate = (newRate: number): void => {
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
      setPlaybackRate(newRate);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  };

  const toggleIsLooping = (): void => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
  };

  const handleUrlChange = (newUrl: string): void => {
    setAudioUrl(newUrl);
    setCurrentTime(0);
    getAudioMetaData(newUrl).then((audio) => {
      setIsMetadataLoaded(true);
      setDuration(audio.duration);
    });
  };

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

    const sliceIndex = Math.max(2, maxIdxDuration);

    return partsTime
      .slice(sliceIndex)
      .map((t) => t.toString().padStart(2, "0"))
      .join(":");
  }

  const defaultCover = "/placeholder-audio-cover.svg";
  const progressBarPercentage = (currentTime / duration) * 100;

  const progressBarBgColorClass = progressBarBgColorMap[theme];
  const hundredBgClass = hundredBgColorMap[theme];
  const lightBgClass = lightBgColorMap[theme];
  const slightlyDarkBgClass = slightlyDarkBgColorMap[theme];
  const textColorClass = textColorMap[theme];
  const svgFilterClass = svgFilterMap[theme];

  return (
    <section
      className={`${lightBgClass} ${textColorClass} p-2.5 md:p-4 shadow-lg w-full bg-opacity-60 backdrop-blur-xl rounded-xl flex`}
    >
      <Head>
        <link rel="preload" as="image" href="/pause-track.svg" />
        <link rel="preload" as="image" href="/play-track.svg" />
      </Head>
      <audio ref={audioRef} src={audioUrl} loop={isLooping} />
      <div
        className={`w-24 self-center md:w-32 h-auto aspect-square rounded-xl overflow-hidden ${slightlyDarkBgClass} bg-opacity-90 shrink-0 mr-2.5 md:mr-3`}
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
        {author && (
          <h3 className="text-base md:text-xl -mt-1 md:mt-0">{author}</h3>
        )}
        <div className="flex-grow select-none pointer-events-none" />
        <div
          className={`flex w-full mb-1 transition-opacity duration-300 ease-in-out ${
            isMetadataLoaded
              ? "opacity-100"
              : "opacity-0 pointer-events-none select-none"
          }`}
        >
          <div className="w-0 relative">
            <div className="hidden whitespace-nowrap left-0 absolute very-narrow-screen-flex items-center">
              <button
                className="w-4 md:w-5 mr-0.5 h-auto aspect-squar"
                onClick={() => {
                  changeRate(1);
                }}
              >
                <Image
                  className={`w-full h-auto aspect-square ${svgFilterClass}`}
                  width={20}
                  height={20}
                  src="/playback-speed.svg"
                  alt="Reset Playback Speed"
                />
              </button>
              <div className="text-sm md:text-base">{`${playbackRate}x`}</div>
            </div>
          </div>
          <div className="flex items-center justify-end md:justify-center flex-grow space-x-2.5 md:space-x-6">
            <button
              className=""
              onClick={() => {
                seek(0);
                changeRate(1);
              }}
            >
              <Image
                className={`w-5 md:w-6 h-auto aspect-square ${svgFilterClass} transition-transform duration-300 ease-in-out hover:scale-110`}
                width={24}
                height={24}
                src="/back-to-start.svg"
                alt="Back to start"
              />
            </button>
            <button
              className=""
              onClick={() => changeRate(Math.max(0.25, playbackRate - 0.25))}
            >
              <Image
                className={`w-5 md:w-6 h-auto aspect-square ${svgFilterClass} transition-transform duration-300 ease-in-out hover:scale-110`}
                width={24}
                height={24}
                src="/speed-up-down.svg"
                alt="Slow down"
              />
            </button>
            <button className="" onClick={handlePlayPause}>
              <Image
                className={`w-5 md:w-6 h-auto aspect-square ${svgFilterClass} transition-transform duration-300 ease-in-out hover:scale-110`}
                width={24}
                height={24}
                src={isPlaying ? "/pause-track.svg" : "play-track.svg"}
                key={isPlaying ? "/pause-track.svg" : "play-track.svg"}
                alt={isPlaying ? "Pause" : "Play"}
              />
            </button>
            <button
              className=""
              onClick={() => changeRate(Math.min(2, playbackRate + 0.25))}
            >
              <Image
                className={`w-5 md:w-6 h-auto aspect-square ${svgFilterClass} rotate-180 transition-transform duration-300 ease-in-out hover:scale-110`}
                width={24}
                height={24}
                src="/speed-up-down.svg"
                alt="Speed up"
              />
            </button>
            <button className="relative group" onClick={toggleIsLooping}>
              <Image
                className={`w-5 md:w-6 h-auto aspect-square ${svgFilterClass} transition-transform duration-300 ease-in-out group-hover:scale-110`}
                src="/loop-track-off.svg"
                height={24}
                width={24}
                alt="Loop or not loop track"
              />
              <Image
                className={`select-none pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 md:w-6 h-auto aspect-square ${svgFilterClass} transition-all duration-300 ease-in-out group-hover:scale-110 ${
                  isLooping ? "opacity-100" : "opacity-0"
                }`}
                src="/loop-track.svg"
                height={24}
                width={24}
                alt="Loop or not loop track"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <div
          className={`flex items-center transition-opacity duration-300 ease-in-out ${
            isMetadataLoaded
              ? "opacity-100"
              : "opacity-0 pointer-events-none select-none"
          }`}
        >
          <span className="text-sm md:text-base">
            {formatTime(Math.max(currentTime, 0), duration)}
          </span>
          <div
            ref={seekBarRef}
            className={`mx-2 flex-grow h-6 py-2 cursor-pointer`}
            onMouseDown={(e) => handleStart(e.clientX)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onMouseUp={handleEnd}
            onTouchEnd={handleEnd}
          >
            <div
              className={`${hundredBgClass} bg-opacity-90 rounded-lg h-full`}
            >
              <div
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, progressBarPercentage)
                  )}%`,
                }}
                className={`${progressBarBgColorClass} rounded-lg h-2`}
              />
            </div>
          </div>
          <span className="text-sm md:text-base">{`-${formatTime(
            Math.max(0, duration - currentTime),
            duration
          )}`}</span>
        </div>
      </div>
    </section>
  );
};

export default MusicPlayerCard;
