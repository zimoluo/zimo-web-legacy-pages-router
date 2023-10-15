import AboutQuestionList from "@/components/AboutQuestionList";
import MainPageLayout from "@/components/MainPageLayout";
import MainPageTitle from "@/components/MainPageTitle";
import { zimoIntro } from "@/lib/about/zimoIntro";
import { aboutDescriptions, aboutQuestions } from "@/lib/about/aboutQuestions";
import { enrichTextContent } from "@/lib/util";
import Image from "next/image";

export default function Home() {
  return (
    <MainPageLayout theme="about">
      <MainPageTitle
        title="Trinitas Ingenii Humani."
        subtitle="Thank you for the gaze of my crafts."
      />
      <div className="w-full px-8 md:px-14 mb-8 flex justify-center items-center">
        <article
          className="bg-color-about-opaque bg-cover bg-center rounded-xl overflow-hidden shadow-lg px-6 py-4 text-lg"
          style={{ maxWidth: "50rem" }}
        >
          <section className="mb-12">
            <Image
              src="/zimo-profile.svg"
              className="w-28 md:w-36 h-auto aspect-square float-right"
              height={144}
              width={144}
              alt="Zimo's Profile"
            />
            <h2 className="text-xl font-bold">About me</h2>
            {zimoIntro.split(/\n\s*\n/).map((paragraph, index) => (
              <p className="my-6" key={index}>
                {enrichTextContent(paragraph)}
              </p>
            ))}
          </section>
          <section>
            <AboutQuestionList
              questions={aboutQuestions}
              descriptions={aboutDescriptions}
            />
          </section>
        </article>
      </div>
    </MainPageLayout>
  );
}
