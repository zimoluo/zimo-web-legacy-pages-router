import MainPageLayout from '@/components/MainPageLayout'
import MainPageTitle from '@/components/MainPageTitle'

export default function Home() {
  return (
    <MainPageLayout theme='about' className='pointer-events-none'>
      <MainPageTitle title='Trinitas Humanae Ingenii.' subtitle='Thank you for the gaze of my crafts.'/>
    </MainPageLayout>
  )
}
