import Head from 'next/head'
import { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar'
import { db } from '../../firebase'
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'

const ScoreWithID = () => {
  const docReference = doc(db, 'events', 'come-and-skate-tondano-2022')
  const docReferenceJudges = doc(
    db,
    'events',
    'come-and-skate-tondano-2022-judges'
  )

  const [_data, _setData] = useState({
    title: '-',
    date: '-',
    time: '-',
    place: '-',
    region: '-',

    live: false,
    done: false,
    break: false,

    participants: { data: [], playing: 0, title: '-' },
    stages: { data: [{ name: '' }], playing: 0, title: '-' },
    notes: [],
  })
  const [_current, _setCurrent] = useState({})
  const [_judges, _setJudges] = useState({
    data: [],
    playing: -1,
    title: '-',
    scores: [],
  })
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    let docSnap = await getDoc(docReference)
    let d: any = docSnap.data()
    _setData({ ...d })
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

  const calculateData = () => {}

  const _buildTable = ({ head, data, title }) => {
    return (
      <div className="mt-6 rounded-sm bg-zinc-100  text-zinc-900">
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-bold uppercase">{title}</h1>
          <p className="text-sm  text-zinc-500">{_data.title}</p>
        </div>
        <div className="pb-8 ">
          <TableRow
            isHead
            index={'#'}
            name={head[1]}
            runs={[...head.filter((e, i) => i > 1)]}
          />
          {data.map((e: any, i: number) => {
            return (
              <TableRow
                index={(i + 1).toString()}
                isAccent={i % 2 === 0}
                name={e.name}
                runs={e.scores}
              />
            )
          })}
        </div>
      </div>
    )
  }

  const _buildScoreCard = () => {
    return (
      <div className="flex select-none rounded-xl bg-zinc-700 px-12 py-6 ">
        <div className="flex-1 self-center text-center text-2xl font-bold">
          SCORE RESULT
        </div>
        <div className="flex flex-1 flex-col ">
          <div className="text-lg font-bold">{_data.title.toUpperCase()}</div>
          <div className="flex gap-1 text-sm font-light">
            <div>{_data.date}</div>
            <div>|</div>
            <div>{_data.time}</div>
          </div>
          <div className="text-sm font-light">{_data.place}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  bg-zinc-900  font-openSans text-gray-50">
      <Head>
        <title>Score | {_data.title}</title>
      </Head>

      <div className=""></div>

      <NavBar activeTitle="Events" />

      <main className="p-12 pt-32">
        <_buildScoreCard />

        <_buildTable
          title="Beginner Run"
          head={['#', 'Name', '1st', '2nd', 'Total']}
          data={[
            { name: 'Jhonny Manembo', scores: [2.3, 4.4, 6.7] },
            { name: 'Jhonny Manembo', scores: [2.3, 4.4, 6.7] },
          ]}
        />

        <_buildTable
          title="Open Run"
          head={['#', 'Name', '1st', '2nd', 'Total']}
          data={[
            { name: 'Jhonny Manembo', scores: [2.3, 4.4, 6.7] },
            { name: 'Jhonny Manembo', scores: [2.3, 4.4, 6.7] },
          ]}
        />

        <_buildTable
          title="Final Beginner Run"
          head={['#', 'Name', '1st', '2nd', 'Total']}
          data={[
            { name: 'Jhonny Manembo', scores: [2.3, 4.4, 6.7] },
            { name: 'Jhonny Manembo', scores: [2.3, 4.4, 6.7] },
          ]}
        />

        <_buildTable
          title="Final Beginner Run"
          head={['#', 'Name', '1st', '2nd', 'Total']}
          data={[
            { name: 'Jhonny Manembo', scores: [2.3, 4.4, 6.7] },
            { name: 'Jhonny Manembo', scores: [2.3, 4.4, 6.7] },
          ]}
        />
      </main>
    </div>
  )
}

export default ScoreWithID
