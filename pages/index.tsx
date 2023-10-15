import MainPageLayout from "@/components/MainPageLayout";
import MainPageTitle from "@/components/MainPageTitle";

export default function Home() {
  return (
    <MainPageLayout theme="zimo">
      <MainPageTitle
        title="Greetings, I&#39;m&nbsp;Zimo."
        subtitle="Welcome to my website. I&#39;m glad you made it here."
      />
    </MainPageLayout>
  );
}
