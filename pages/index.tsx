import MainPageLayout from "@/components/MainPageLayout";
import MainPageTitle from "@/components/MainPageTitle";
import SocialMediaButtonArray from "@/components/SocialMediaButtonArray";

export default function Home() {
  return (
    <MainPageLayout theme="zimo">
      <MainPageTitle
        title="Greetings, I&#39;m&nbsp;Zimo."
        subtitle="Welcome to my website. I&#39;m glad you made it here."
      >
        <SocialMediaButtonArray theme="zimo" />
      </MainPageTitle>
      <div className="w-full px-6 md:px-14 mb-24 flex justify-center items-center"></div>
    </MainPageLayout>
  );
}
