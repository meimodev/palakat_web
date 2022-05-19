import Head from 'next/head'
import { useRouter } from 'next/router'
import NavBar from '../../components/NavBar'

const ScoreWithID = () => {
  const router = useRouter()
  const { id } = router.query

  const data = {
    title: 'Super exciting event day 2022',
    date: '22 November 1992',
    time: '15:00 AM',
    place: 'Lapangan Samrat Tondano',
    region: 'Tondano - Minahasa',
  }

  type TableRowProp = {
    isHead?: boolean
    isAccent?: boolean
    index: string
    name: string
    runs: any
  }
  const TableRow = ({ isHead, isAccent, index, name, runs }: TableRowProp) => {
    const bold = isHead ? ' font-bold ' : ' '
    const textSize = isHead ? ' text-lg ' : ' text-md '
    const accent = isAccent ? ' bg-zinc-200 ' : ''

    return (
      <div className={accent}>
        <div className={'flex justify-around gap-3 px-6 py-3 text-center'}>
          <div className={textSize + bold + 'max-w-12 w-12'}>{index}</div>
          <div className={'flex-1 text-left' + bold + textSize}>{name}</div>
          {runs.map((e: any, i: number) => (
            <div className={'w-12 text-center' + bold + textSize} key={i}>
              {e}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const _buildTable = () => {
    return (
      <div className="mt-6 rounded-sm bg-zinc-100  text-zinc-900">
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-bold">CLASS NAME</h1>
          <p className="text-sm  text-zinc-500">{data.title}</p>
        </div>
        <div className="pb-8 ">
          <TableRow
            isHead
            index={'#'}
            name={'Name'}
            runs={['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Total']}
          />
          <TableRow
            index={'1'}
            isAccent
            name={'Jhonny Mabembox'}
            runs={[10, 11, 12, 2.12, 14.99, 999.99]}
          />
          <TableRow
            index={'2'}
            name={'Marhayarudin Hartanus'}
            runs={[7, 12, 0, 99.99, 99.99, 999.99]}
          />
          <TableRow
            index={'3'}
            isAccent
            name={'Jhonny Mabembox'}
            runs={[10, 11, 12, 2.12, 14.99, 999.99]}
          />
          <TableRow
            index={'4'}
            name={'Marhayarudin Hartanus'}
            runs={[7, 12, 0, 99.99, 99.99, 999.99]}
          />
          <TableRow
            index={'5'}
            isAccent
            name={'Jhonny Mabembox'}
            runs={[10, 11, 12, 2.12, 14.99, 999.99]}
          />
          <TableRow
            index={'6'}
            name={'Marhayarudin Hartanus'}
            runs={[7, 12, 0, 99.99, 99.99, 999.99]}
          />
          <TableRow
            index={'7'}
            isAccent
            name={'Marhayarudin Hartanus'}
            runs={[7, 12, 0, 99.99, 99.99, 999.99]}
          />
        </div>
      </div>
    )
  }

  const _buildScoreCard = () => {
    return (
      <div className=" flex rounded-xl bg-zinc-700 px-12 py-6 ">
        <div className="flex-1 self-center text-center text-2xl font-bold">
          SCORE RESULT
        </div>
        <div className="flex flex-1 flex-col ">
          <div className="text-lg font-bold">{data.title.toUpperCase()}</div>
          <div className="flex gap-1 text-sm font-light">
            <div>{data.date}</div>
            <div>|</div>
            <div>{data.time}</div>
          </div>
          <div className="text-sm font-light">{data.place}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  bg-zinc-900  font-openSans text-gray-50">
      <Head>
        <meta charSet="UTF-8" />

        <title>Score | {data.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className=""></div>

      <NavBar activeTitle="Events" />

      <main className="p-12 pt-32">
        <_buildScoreCard />

        <_buildTable />
        <_buildTable />
        <_buildTable />
      </main>
    </div>
  )
}

export default ScoreWithID
