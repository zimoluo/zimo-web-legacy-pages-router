import ArticleCard from "@/components/ArticleCard";
import MainPageLayout from "@/components/MainPageLayout";
import MainPageTitle from "@/components/MainPageTitle";
import SocialMediaButtonArray from "@/components/SocialMediaButtonArray";
import Timeline from "@/components/Timeline";
import CommentCardColumn from "@/components/comments/CommentCardColumn";
import CommentTypeBox from "@/components/comments/CommentTypeBox";
import { CommentProvider } from "@/components/contexts/CommentContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import { securityCommentShutDown } from "@/lib/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [titleName, setTitleName] = useState("Zimo");
  const { settings } = useSettings();

  useEffect(() => {
    if (Math.random() < 0.01127) {
      const nameChoices = ["Kawarage", "Eunoe", "ZIMO"];
      setTitleName(nameChoices[Math.floor(Math.random() * nameChoices.length)]);
    }
  }, []);

  return (
    <MainPageLayout theme="zimo">
      <MainPageTitle
        title={`Greetings, I\u2019m\u00A0${titleName}.`}
        subtitle="Hello there. I'm glad you made it here."
      >
        <SocialMediaButtonArray theme="zimo" />
      </MainPageTitle>
      <div className="w-full px-6 md:px-14 mb-24 flex justify-center items-center">
        <div style={{ maxWidth: "54rem" }}>
          <article
            className={`shadow-lg rounded-xl bg-neutral-50 bg-opacity-90 ${
              settings.disableBackgroundBlur
                ? ""
                : "md:backdrop-blur-lg md:bg-opacity-40"
            } px-4 py-4 text-base`}
          >
            <h3 className="text-xl font-bold mb-2">Welcome to Zimo Web!</h3>
            This is my website: lab, personal playground, of frontend connecting
            to backend, of design meeting functionality. Explore the{" "}
            <Link href="/photos" className="underline underline-offset-2">
              Album
            </Link>
            ,{" "}
            <Link href="/blog" className="underline underline-offset-2">
              Blog
            </Link>
            , and{" "}
            <Link href="/projects" className="underline underline-offset-2">
              Projects
            </Link>{" "}
            page; you&apos;ll find things I&apos;ve done. Mostly. Or go to the{" "}
            <Link href="/about" className="underline underline-offset-2">
              About
            </Link>{" "}
            page for more on me and this website. Feel free to come back anytime
            and leave a message below, whether you wish to share a feedback or
            just drop a hello. Relax. Chill. Enjoy.
          </article>
          <div className="md:grid md:grid-cols-2 mt-6 md:gap-x-6">
            <section className="shadow-lg rounded-xl backdrop-blur-lg bg-neutral-50 bg-opacity-40 px-4 py-4 text-lg">
              <h3 className="text-xl font-bold mb-2">Featured</h3>
              <div>
                <ArticleCard
                  theme="zimo"
                  title="Spooky Halloween Update!"
                  section="blog"
                  slug="spooky-halloween-update"
                  date="2023-10-29T05:12:23Z"
                  description="Scary fast..."
                />
                <ArticleCard
                  theme="zimo"
                  title="Welcome to Zimo&nbsp;Web"
                  section="blog"
                  slug="welcome-to-zimo-web"
                  date="2023-10-26T14:08:52Z"
                  className="mt-4"
                  description="What has become the reality..."
                />
                <ArticleCard
                  theme="zimo"
                  title="Understanding Website Settings"
                  section="management"
                  slug="understanding-website-settings"
                  date="2023-10-22"
                  className="mt-4"
                  description="This page explains the settings of Zimo Web."
                />
              </div>
            </section>
            <section className="shadow-lg rounded-xl backdrop-blur-lg bg-neutral-50 bg-opacity-40 px-4 py-4 text-lg mt-6 md:mt-0">
              <h3 className="text-xl font-bold mb-2">Timeline</h3>
              <Timeline
                events={{
                  "2023-8-19": "The construction of Zimo Web begins.",
                  "2023-10-27":
                    "Zimo Web is released – exactly one month before my birthday.",
                }}
                theme="zimo"
              />
            </section>
          </div>
          <Link href="/management">
            <article className="shadow-lg rounded-xl backdrop-blur-lg bg-neutral-50 bg-opacity-40 px-4 py-4 text-base mt-6">
              <h3 className="text-xl font-bold mb-2">Website Management</h3>
              <p>
                Articles regarding the management and policies of Zimo Web can
                be found{" "}
                <span className="underline-offset-2 hover:underline">here</span>
                .
              </p>
            </article>
          </Link>
          {!settings.disableComments && !securityCommentShutDown && (
            <article className="shadow-lg rounded-xl backdrop-blur-lg bg-neutral-50 bg-opacity-40 px-4 py-4 text-base mt-6">
              <h3 className="text-xl font-bold mb-2">Say something...</h3>
              <CommentProvider>
                <CommentTypeBox
                  theme="zimo"
                  isExpanded={true}
                  messageWord="message"
                />
                <div className="px-4 mt-4">
                  <CommentCardColumn
                    theme="zimo"
                    resourceLocation="about/homepage/messages.json"
                  />
                </div>
              </CommentProvider>
            </article>
          )}
        </div>
      </div>
    </MainPageLayout>
  );
}
