import React, { useEffect, useState } from "react";
import Image from "next/image";

const HalloweenPulse: React.FC = () => {
  const [animation, setAnimation] = useState("");
  const [background, setBackground] = useState("");
  const [chance, setChance] = useState(randomBetween(4, 6));
  const [cooldown, setCooldown] = useState(0);
  const [waitingTime, setWaitingTime] = useState(randomBetween(4, 8));
  const [eventImage, setEventImage] = useState("");
  const [eventAudio, setEventAudio] = useState("");
  const [previousEvent, setPreviousEvent] = useState<any>(null);
  const [opacity, setOpacity] = useState("opacity-0");

  const events = [
    { image: "/halloween-event/bats.svg", audio: "/halloween-event/bats.wav" },
    {
      image: "/halloween-event/pumpkin.svg",
      audio: "/halloween-event/pumpkin.mp3",
    },
    {
      image: "/halloween-event/witch.svg",
      audio: "/halloween-event/witch.wav",
    },
  ];

  useEffect(() => {
    let eventTriggeredLast = false;

    const timer = setTimeout(() => {
      if (cooldown > 0) {
        setAnimation("animate-halloween-pulse");
        setBackground("bg-halloween-pulse");
        setCooldown(cooldown - 1);
      } else {
        if (Math.random() < chance / 100) {
          let availableEvents = events;
          if (previousEvent !== null) {
            availableEvents = events.filter(
              (_, index) => index !== previousEvent
            );
          }

          const selectedIndex = Math.floor(
            Math.random() * availableEvents.length
          );
          const selectedEvent = availableEvents[selectedIndex];
          setEventImage(selectedEvent.image);
          setEventAudio(selectedEvent.audio);
          setPreviousEvent(events.indexOf(selectedEvent));

          setAnimation("animate-halloween-event");
          setBackground("bg-halloween-event");
          setOpacity("opacity-100");
          setChance(randomBetween(4, 6));
          setCooldown(2);
          eventTriggeredLast = true;

          setTimeout(() => setOpacity("opacity-0"), 9000);
          setTimeout(() => {
            setEventImage("");
            setEventAudio("");
          }, 9500);
        } else {
          setAnimation("animate-halloween-pulse");
          setBackground("bg-halloween-pulse");
          setChance((prevChance) => prevChance * randomBetween(1.05, 1.15));
        }
      }

      const newWaitingTime = eventTriggeredLast
        ? randomBetween(12, 18)
        : randomBetween(4, 8);

      setWaitingTime(newWaitingTime);
    }, waitingTime * 1000);

    return () => clearTimeout(timer);
  }, [chance, cooldown, waitingTime]);

  const animationEndHandler = () => {
    setAnimation("");
    setBackground("");
  };

  return (
    <>
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
        className={`w-screen h-screen pointer-events-none select-none inset-0 fixed z-80 duration-300 transition-opacity ease-in-out ${opacity}`}
      />
      {eventAudio && (
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

const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export default HalloweenPulse;
