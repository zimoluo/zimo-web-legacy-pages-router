import React, { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { useSettings } from "./contexts/SettingsContext";

interface HalloweenEvent {
  image: string;
  audio: string;
  animation: string;
}

const HalloweenPulse: React.FC = () => {
  // State Declarations
  const [animation, setAnimation] = useState<string>("");
  const [background, setBackground] = useState<string>("");
  const [chance, setChance] = useState<number>(randomBetween(4, 6));
  const [cooldown, setCooldown] = useState<number>(0);
  const [waitingTime, setWaitingTime] = useState<number>(randomBetween(4, 8));
  const [eventImage, setEventImage] = useState<string>("");
  const [eventAudio, setEventAudio] = useState<string>("");
  const [opacity, setOpacity] = useState<string>("opacity-0");
  const [eventAnimation, setEventAnimation] = useState<string>("");

  // Contexts
  const { settings } = useSettings();

  // Constants
  const events: HalloweenEvent[] = [
    {
      image: "/halloween-event/bats.svg",
      audio: "/halloween-event/bats.wav",
      animation: "",
    },
    {
      image: "/halloween-event/pumpkin.svg",
      audio: "/halloween-event/pumpkin.mp3",
      animation: "animate-pumpkin-scale",
    },
    {
      image: "/halloween-event/witch.svg",
      audio: "/halloween-event/witch.wav",
      animation: "animate-witch-move",
    },
  ];

  const triggerEvent = (event: HalloweenEvent) => {
    setEventImage(event.image);
    setEventAudio(event.audio);
    setEventAnimation(event.animation);
    setAnimation("animate-halloween-event");
    setBackground("bg-halloween-event");
    setOpacity("opacity-100");
    setChance(randomBetween(4, 6));
    setCooldown(2);
    setWaitingTime(randomBetween(12, 18));

    // Reset after animation
    setTimeout(() => setOpacity("opacity-0"), 9000);
    setTimeout(() => {
      setEventImage("");
      setEventAudio("");
      setEventAnimation("");
    }, 9500);
  };

  const animationEndHandler = () => {
    setAnimation("");
    setBackground("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cooldown > 0) {
        setAnimation("animate-halloween-pulse");
        setBackground("bg-halloween-pulse");
        setCooldown(cooldown - 1);
      } else if (Math.random() < chance / 100) {
        triggerEvent(events[Math.floor(Math.random() * events.length)]);
      } else {
        setAnimation("animate-halloween-pulse");
        setBackground("bg-halloween-pulse");
        setChance((prevChance) => prevChance * randomBetween(1.05, 1.15));
        setWaitingTime(randomBetween(4, 8));
      }
    }, waitingTime * 1000);

    return () => clearTimeout(timer);
  }, [chance, cooldown, waitingTime]);

  // JSX Rendering
  return (
    <>
      <Head>
        {events.map((event) => (
          <link key={event.image} rel="preload" as="image" href={event.image} />
        ))}
      </Head>
      <div
        className={`fixed inset-0 w-screen h-screen z-90 ${background} ${animation} opacity-0 pointer-events-none select-none`}
        aria-hidden="true"
        onAnimationEnd={animationEndHandler}
      />
      <Image
        src={eventImage}
        alt="Halloween Effect"
        aria-hidden="true"
        height={100}
        width={100}
        className={`w-screen h-screen pointer-events-none select-none inset-0 fixed z-80 duration-300 transition-opacity ease-in-out ${opacity} ${eventAnimation}`}
      />
      {eventAudio && !settings.disableSoundEffect && (
        <audio key={eventAudio} autoPlay aria-hidden="true">
          <source
            src={eventAudio}
            type={eventAudio.endsWith(".mp3") ? "audio/mp3" : "audio/wav"}
          />
        </audio>
      )}
    </>
  );
};

// Utility Functions
const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export default HalloweenPulse;
