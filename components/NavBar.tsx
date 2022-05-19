import type { NextPage } from 'next'
import { AppProps } from 'next/app'
import Link from 'next/link'

type Props = {
  activeTitle: string
}

const NavBar = ({ activeTitle }: Props) => {
  const _link = ({ href, title, isActive }: any) => (
    <div>
      <div className="flex flex-col items-center justify-center gap-1">
        <Link href={href}>{title}</Link>
        {isActive ? (
          <div className="h-1 w-10 rounded-md bg-gray-200 "></div>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-zinc-900 font-openSans text-sm ">
      <div className="h-40  pt-6 pl-12 pr-12 ">
        <div className="flex items-center justify-around">
          <div className="flex-1 text-4xl font-bold">PALAKAT</div>
          <div className="flex-2 flex justify-around gap-16 ">
            <_link href="/" title="Home" isActive={activeTitle === 'Home'} />
            <_link
              href="/events"
              title="Events"
              isActive={activeTitle === 'Events'}
            />
            <_link
              href="/contact"
              title="Contact"
              isActive={activeTitle === 'Contact'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
