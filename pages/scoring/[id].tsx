import Head from 'next/head'
import { useRouter } from 'next/router'

const Scoring = () => {
  const router = useRouter()
  const { id } = router.query

  const data = {
    title: 'Super exciting event day 2022',
    date: '22 November 1992',
    time: '15:00 AM',
    place: 'Lapangan Samrat Tondano',
    region: 'Tondano - Minahasa',
    notes: [
      'This is the first note that would appear on note card, and if another one exist',
      'That would be the second item on this list card',
      'This instead is the third list of the card',
    ],
    participant: {
      name: 'Jhonny Manembz',
      image:
        'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872',
      number: '1',
      of: '22',
    },
    run: {
      class: 'Beginner Run',
      name: '1st run',
    },
  }

  const _buildNavBar = () => {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900 font-openSans text-sm ">
        <div className=" pt-6 pl-6 pr-6 ">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-4xl font-bold">PALAKAT</div>
            <div className="text-md self-center">Scoring Board</div>
          </div>
          <div className="flex text-lg font-bold">
            {data.title.toUpperCase()}
          </div>
          <div className="mt-2 h-1 rounded-lg bg-gray-100"></div>
        </div>
      </div>
    )
  }

  const _buildNoteCard = () => {
    return (
      <div className="rounded-lg bg-zinc-700 p-6">
        <div className="text-xl font-bold">NOTE !</div>
        <div className="text-md pl-6 font-light">
          {data.notes.map((e: string, i: number) => (
            <div key={i} className="list-item">
              {e}
            </div>
          ))}
        </div>
      </div>
    )
  }

  type ProfileCardProp = {
    image?: string
  }
  const _buildProfileCard = ({ image }: ProfileCardProp) => {
    const imageObject =
      image === undefined ? {} : { backgroundImage: `url(${image})` }

    return (
      <div
        className="h-48 w-full rounded-t-xl bg-zinc-100 bg-cover text-center"
        style={imageObject}
      ></div>
    )
  }

  const handleOnClick = (e: any) => {
    e.preventDefault()
    console.log('Submit is clicked')
  }

  return (
    <div className="min-h-screen select-none bg-zinc-900  font-openSans text-gray-50">
      <Head>
        <meta charSet="UTF-8" />

        <title>Scoring | {data.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="">
        <_buildNavBar />
      </div>

      <main className="px-6 pt-32">
        <div className="font-light">{data.place}</div>
        <div className="font-light">
          {data.date} | {data.time}
        </div>
        <div className="font-light">{data.region}</div>

        <div className="pt-6">
          <_buildNoteCard />
        </div>

        <div className="pt-12">
          <h1 className="text-center text-xl font-bold">
            PARTICIPANT {data.participant.number} of {data.participant.of}
          </h1>
          <div className="pt-6">
            <div className="flex justify-around gap-2">
              <div className="flex flex-1 flex-col items-center rounded-xl bg-zinc-700">
                <_buildProfileCard image={data.participant.image} />
                <div className="py-3 px-3 text-center">
                  {data.participant.name.toUpperCase()}
                </div>
              </div>
              <div className="flex-1 self-center">
                <div className="flex h-40 flex-col justify-center  text-center ">
                  <div className="text-xl font-bold">
                    {data.run.class.toUpperCase()}
                  </div>
                  <div className="text-xl font-bold">{data.run.name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-6 mt-12 overflow-hidden rounded-xl bg-zinc-100 text-zinc-900">
          <div>
            <form className="flex flex-col ">
              <input
                type="number"
                className="rounded-x border-0 bg-zinc-100 pt-4 text-center text-6xl font-bold focus:outline-none "
              />
              <label className="cursor-default py-3 text-center text-xl">
                score
              </label>
            </form>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={handleOnClick}
            className="mt-6 overflow-hidden rounded-xl bg-zinc-700 px-6 py-3 font-bold"
          >
            SUBMIT SCORE
          </button>
        </div>
      </main>
      <div className="py-16"></div>
    </div>
  )
}

export default Scoring
