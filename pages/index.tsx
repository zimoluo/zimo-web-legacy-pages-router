import MainPageLayout from '@/components/MainPageLayout'
import MainPageTitle from '@/components/MainPageTitle'
import Timeline from '@/components/Timeline';

export default function Home() {

  const events = {
    "2023-9-12": "Event 1",
    "2023-10-3": "Event 2",
    "2022-9-12": "Event 3",
  };

  return (
    <MainPageLayout theme='zimo'>
      <MainPageTitle title='Greetings, I&#39;m&nbsp;Zimo.' subtitle='Welcome to my website. I&#39;m glad you made it here.'/>
      <Timeline events={events} />
    </MainPageLayout>
  )
}
