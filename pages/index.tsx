import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import NavBar from '../components/NavBar'

const Home: NextPage = () => {
  const _buildEventInfoCards = () => {
    const _infoCard = ({ title, subTitle, href }: any) => (
      <Link href={href} passHref>
        <a
          className="flex h-40 w-44 flex-col items-center justify-end gap-3 
        rounded-xl bg-gray-100 bg-opacity-20 py-8 drop-shadow-md backdrop-blur-lg"
        >
          <h1 className="text-center text-2xl font-bold">
            {title.toUpperCase()}
          </h1>
          <p className="text-sm text-gray-400">{subTitle}</p>
        </a>
      </Link>
    )

    return (
      <div className="flex gap-6">
        <_infoCard title="15 June" subTitle="upcoming" href="/about" />
        <_infoCard
          title="Lapangan Samrat"
          subTitle="Tondano - Minahasa"
          href="/about"
        />
        <_infoCard title="Score" subTitle="Competition" href="/about" />
      </div>
    )
  }

  //MAIN COMPONENT
  return (
    <div className="flex min-h-screen flex-col justify-end bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374')] bg-cover p-12 text-gray-100">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap"
          rel="stylesheet"
        ></link>

        <title>Palakat | local event publisher</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar activeTitle="Home" />

      <main className="flex w-full flex-col gap-6 font-openSans">
        <h1 className="text-4xl font-bold drop-shadow-lg">
          SUPER EXCITING EVENT DAY 2022
        </h1>
        <_buildEventInfoCards />
      </main>
    </div>
  )
}

export default Home
