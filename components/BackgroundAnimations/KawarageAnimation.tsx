import { useEffect } from "react";
import { useRouter } from "next/router";

const KawarageAnimation: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    let currentFontSize = getRootFontSize();
    const phrases = [
      "kawarage?.()",
      "ofNullable(this) -> kawarage());",
      "class Kawarage();",
      "self.kawarage()",
      "this.kawarage();",
      "zimo.kawarage",
      "https://kawarage.tk",
      "this?.kawarage();",
      "startKawarage();",
      "public void getKawarage();",
      "(this ? kawarage() : void());",
      "if true { kawarage() }",
      "kawarage-zimo",
      "true ? kawarage() : null;",
      "Option(this).foreach(_ => kawarage())",
      "kawarage() ?? print('Failed');",
      "kawarage!()",
    ];
    let intervalId: string | number | NodeJS.Timeout | undefined;
    const lastPositions: number[] = [];
    const minDistance = 12;

    const setDynamicInterval = () => {
      clearInterval(intervalId);
      clearExistingTexts();

      const windowWidth = window.innerWidth;
      const newInterval = 950000 / windowWidth;

      intervalId = setInterval(addText, newInterval);
    };

    if (router.pathname.startsWith("/projects")) {
      setDynamicInterval();
      window.addEventListener("resize", setDynamicInterval);
    }

    setDynamicInterval();
    window.addEventListener("resize", setDynamicInterval);

    function getRootFontSize() {
      return parseInt(getComputedStyle(document.documentElement).fontSize, 10);
    }

    function randomIntFromRange(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function getRandomPhrase() {
      return phrases[randomIntFromRange(0, phrases.length - 1)];
    }

    function isTooClose(newPosition: number) {
      return lastPositions.some(
        (oldPosition) => Math.abs(newPosition - oldPosition) < minDistance
      );
    }

    function clearExistingTexts() {
      const floatingTexts = document.querySelectorAll(".flying-kawarage");
      floatingTexts.forEach((el) => el.remove());
    }

    function addText() {
      const leftPosition = randomIntFromRange(-10, 100);

      if (isTooClose(leftPosition)) {
        lastPositions.shift();
        return;
      }

      if (lastPositions.length >= 8) {
        lastPositions.shift();
      }
      lastPositions.push(leftPosition);

      let newFontSize = getRootFontSize() + 4;
      let newSpeed = newFontSize / currentFontSize;
      let textOpacity = 6;

      const textDiv = document.createElement("div");
      const shadowIndex = randomIntFromRange(1, 3);

      const shadowClasses = [
        "drop-shadow-2xl",
        "drop-shadow-xl",
        "drop-shadow-lg",
      ];
      textDiv.classList.add(shadowClasses[shadowIndex - 1]);

      const shadowAdjustments = [
        { fontSize: 2, speed: 14, opacity: 4 },
        { fontSize: 6, speed: 16, opacity: 10 },
        { fontSize: 8, speed: 19, opacity: 16 },
      ];

      const adjust = shadowAdjustments[shadowIndex - 1];
      newFontSize += randomIntFromRange(1, adjust.fontSize);
      newSpeed *= randomIntFromRange(13, adjust.speed);
      textOpacity += randomIntFromRange(0, adjust.opacity);

      textDiv.innerHTML = getRandomPhrase();
      textDiv.classList.add(
        "fixed",
        "transform",
        "-rotate-90",
        "z-[-20]",
        "font-arial-black",
        "text-teal-900",
        "font-bold",
        "flying-kawarage",
        "whitespace-nowrap"
      );
      textDiv.style.cssText = `
            left: ${leftPosition}%;
            bottom: ${-randomIntFromRange(80, 120)}vh;
            transition: bottom ${newSpeed}s linear;
            opacity: ${textOpacity / 100};
            width: 0.001rem;
            height: 0.001rem;
        `;
      textDiv.style.fontSize = `${newFontSize}px`;

      document.body.appendChild(textDiv);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          textDiv.style.bottom = "140vh";
        });
      });

      setTimeout(() => {
        textDiv.remove();
      }, (newSpeed + 1) * 1000);

      currentFontSize = newFontSize;
    }
    return () => {
      // Cleanup
      clearInterval(intervalId);
      clearExistingTexts();
      window.removeEventListener("resize", setDynamicInterval);
    };
  }, [router.pathname]);

  return null;
};

export default KawarageAnimation;
