import { NextPage } from 'next'
import Head from 'next/head'
import EventCard from '../../components/EventCard'
import NavBar from '../../components/NavBar'

const Events: NextPage = () => {
  return (
    <div className="min-h-screen select-none bg-zinc-900  font-openSans text-gray-50">
      <Head>
        <title>Palakat events</title>
      </Head>

      <div className=""></div>

      <main className="p-12">
        <NavBar activeTitle="Events" />

        <h1 className="pt-24 pb-2 text-2xl font-bold drop-shadow-lg">
          EVENT LIST
        </h1>

        <EventCard
          title={'SUPER EXCITING DAY EVENT 2022'}
          location={'Event location goes here'}
          region={'Tondano - Minahasa'}
          type={'competition'}
          date={'22'}
          month={'November'}
          isLive={false}
          image="https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872"
        />
        <EventCard
          title={'SUPER EXCITING DAY EVENT 2022'}
          location={'Event location goes here'}
          region={'Tondano - Minahasa'}
          type={'competition'}
          date={'22'}
          month={'Juni'}
          isLive={true}
          image="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374"
        />
        <EventCard
          title={'THIRD SUPER EXCITING DAY EVENT 2022'}
          location={'Event location goes here'}
          region={'Tondano - Minahasa'}
          type={'competition'}
          date={'22'}
          month={'November'}
          isLive={false}
          image="https://images.unsplash.com/photo-1621006276150-27039404abde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        />

        <EventCard
          title={'THIRD SUPER EXCITING DAY EVENT 2022'}
          location={'Event location goes here'}
          region={'Tondano - Minahasa'}
          type={'competition'}
          date={'22'}
          month={'November'}
          isLive={false}
        />

        <EventCard
          title={'THIRD SUPER EXCITING DAY EVENT 2022'}
          location={'Event location goes here'}
          region={'Tondano - Minahasa'}
          type={'competition'}
          date={'22'}
          month={'November'}
          isLive={false}
        />

        <EventCard
          title={'THIRD SUPER EXCITING DAY EVENT 2022'}
          location={'Event location goes here'}
          region={'Tondano - Minahasa'}
          type={'competition'}
          date={'22'}
          month={'November'}
          isLive={false}
        />

        <EventCard
          title={'THIRD SUPER EXCITING DAY EVENT 2022'}
          location={'Event location goes here'}
          region={'Tondano - Minahasa'}
          type={'competition'}
          date={'22'}
          month={'November'}
          isLive={false}
        />
      </main>
    </div>
  )
}
export default Events
