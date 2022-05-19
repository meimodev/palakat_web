import { NextPage } from 'next'
import Head from 'next/head'
import NavBar from '../../components/NavBar'

const Contact: NextPage = () => {
  return (
    <div className="text-gray-100">
      <NavBar activeTitle="Contact" />

      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 bg-cover p-12 text-center">
        <Head>
          <meta charSet="UTF-8" />

          <link
            rel="stylesheet"
            href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css"
          ></link>

          <title>Palakat | Contact Us</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="w-full-4 flex flex-col gap-3 font-openSans">
          <h1 className="text-xl ">Had any question about tech n stuff ? </h1>
          <h1 className="text-4xl font-bold">FEEL FREE TO DROP US A MESSAGE</h1>
          <h1 className="mt-8 text-4xl font-bold">+62 895 2569 9078</h1>
          <div className="mt-4 flex justify-around">
            <a
              href="https://api.whatsapp.com/send?phone=6289525699078&text=Halo,%20Tolong%20infonya%20tentang%20palakat%20web"
              target="_blank"
              className="flex items-center justify-center gap-2"
            >
              <i className="lab la-whatsapp text-4xl"></i>
              <div>WhatsApp</div>
            </a>
            <a
              href="https://t.me/+6289525699078"
              target="_blank"
              className="flex items-center justify-center gap-2"
            >
              <i className="lab la-telegram  text-4xl"></i>
              <div>Telegram</div>
            </a>
          </div>
        </main>
      </div>
    </div>
  )
}
export default Contact
