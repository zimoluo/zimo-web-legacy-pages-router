import MainPageLayout from "@/components/MainPageLayout";
import MainPageTitle from "@/components/MainPageTitle";
import MusicPlayerCard from "@/components/MusicPlayerCard";
import Timeline from "@/components/Timeline";

export default function Home() {
  const events = {
    "2023-09-12": "Event 1",
    "2025-10-3": "Event 2",
    "2024-11-12": "Event Event Event Event Event AWAWA",
  };

  return (
    <MainPageLayout theme="zimo">
      <MainPageTitle
        title="Greetings, I&#39;m&nbsp;Zimo."
        subtitle="Welcome to my website. I&#39;m glad you made it here."
      />
      <div className="p-4" style={{ width: "100vw" }}>
        <MusicPlayerCard
          url="https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/audio/Slanombie.mp3"
          theme="about"
          title="Song"
          author="author"
        />
      </div>
      <Timeline events={events} />
    </MainPageLayout>
  );
}
