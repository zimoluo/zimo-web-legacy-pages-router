import MainPageLayout from '@/components/MainPageLayout'
import MainPageTitle from '@/components/MainPageTitle'

export default function Home() {
  return (
    <MainPageLayout theme='photos'>
      <MainPageTitle title='Album of Things, Album of Life.' subtitle='Photos, just like names, comprise the soul.'/>
    </MainPageLayout>
  )
}
