import { url } from 'inspector'
import Link from 'next/link'

type Props = {
  title: string
  location: string
  region: string
  type: string
  date: string
  month: string
  isLive: boolean
  image?: string
}

const EventCard = ({
  title,
  location,
  region,
  type,
  date,
  month,
  isLive,
  image,
}: Props) => {
  const imageObject =
    image === undefined ? {} : { backgroundImage: `url(${image})` }

  return (
    <div className="my-4 flex h-40 items-center gap-6">
      <div className="flex-2 w-36 flex-col items-center justify-center text-center text-2xl font-bold">
        <div>{date.toUpperCase()}</div>
        <div>{month.toUpperCase()}</div>
        {isLive ? (
          <div className="pt-3 text-sm font-bold text-red-600">Live</div>
        ) : (
          <div className="pt-3 text-sm font-light text-zinc-300">Upcoming</div>
        )}
      </div>
      <div className="flex h-full flex-1 items-center gap-6 rounded-xl bg-zinc-700 ">
        <div
          className="h-full w-40 rounded-l-xl bg-cover"
          style={imageObject}
        />
        <div className="flex flex-1 flex-col">
          <div className="text-xl font-bold">{title.toUpperCase()}</div>
          <div className="text-lg">{location.toUpperCase()}</div>
          <div className="text-sm font-light text-zinc-300">{region}</div>
          <div className="pt-2 text-sm font-light text-zinc-400">{type}</div>
        </div>
        <div className="mr-6  flex flex-col ">
          <Link href={'/score'} passHref>
            <a className=" rounded-lg bg-zinc-100 p-4 ">
              <p className="text-md font-bold text-zinc-900">SCORE</p>
            </a>
          </Link>
          {isLive ? (
            <div className="pt-1 text-center text-sm text-red-600">LIVE</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default EventCard
