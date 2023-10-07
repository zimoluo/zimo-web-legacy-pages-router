import AboutQuestionList from "@/components/AboutQuestionList";
import MainPageLayout from "@/components/MainPageLayout";
import MainPageTitle from "@/components/MainPageTitle";

export default function Home() {
  const questions = [
    "What is your company's mission?",
    "Who are your clients?",
    "How do you ensure quality in your services?",
  ];

  const descriptions = [
    "Our mission is to provide excellent software solutions that empower businesses to achieve their goals.",
    "We cater to a diverse range of clients, from startups to established enterprises, spanning various industries.",
  ];

  return (
    <MainPageLayout theme="about">
      <MainPageTitle
        title="Trinitas Ingenii Humani."
        subtitle="Thank you for the gaze of my crafts."
      />
      <div className="w-full px-40 mb-8">
      <AboutQuestionList questions={questions} descriptions={descriptions} />
      </div>
    </MainPageLayout>
  );
}
