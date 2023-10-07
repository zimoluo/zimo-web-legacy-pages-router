import AboutQuestionList from "@/components/AboutQuestionList";
import MainPageLayout from "@/components/MainPageLayout";
import MainPageTitle from "@/components/MainPageTitle";
import { aboutDescriptions, aboutQuestions } from "@/lib/aboutQuestions";

export default function Home() {
  return (
    <MainPageLayout theme="about">
      <MainPageTitle
        title="Trinitas Ingenii Humani."
        subtitle="Thank you for the gaze of my crafts."
      />
      <div className="w-full px-8 md:px-14 mb-24 flex justify-center items-center">
        <div style={{ maxWidth: "50rem" }}>
          <AboutQuestionList
            questions={aboutQuestions}
            descriptions={aboutDescriptions}
          />
        </div>
      </div>
    </MainPageLayout>
  );
}
