import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useEffect } from 'react'

import { db } from '../../firebase'
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'

const LiveEvent = () => {
  const docReference = doc(db, 'events', 'come-and-skate-tondano-2022')
  const docReferenceJudges = doc(
    db,
    'events',
    'come-and-skate-tondano-2022-judges'
  )
  const docReferenceId = 'come-and-skate-tondano-2022'
  const docReferenceIdJudges = 'come-and-skate-tondano-2022-judges'

  const router = useRouter()
  const { eventId } = router.query

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

  // const mockScoreData = [
  //   { participant: '1 Participant', score: 2.2, stage: 'Beginner Run 1st' },
  //   { participant: '1 Participant', score: 3, stage: 'Beginner Run 1st' },
  //   { participant: '1 Participant', score: 5, stage: 'Beginner Run 1st' },
  //   {
  //     participant: '4 Participant',
  //     score: 7.6,
  //     stage: 'Beginner Run 1st',
  //   },
  //   {
  //     participant: '4 Participant',
  //     score: 7.4,
  //     stage: 'Beginner Run 1st',
  //   },
  //   {
  //     participant: '4 Participant',
  //     score: 7.0,
  //     stage: 'Beginner Run 2nd',
  //   },
  //   {
  //     participant: '2 Participant',
  //     score: 7.6,
  //     stage: 'Beginner Run 1st',
  //   },
  //   {
  //     participant: '5 Participant',
  //     score: 7.6,
  //     stage: 'Beginner Run 1st',
  //   },
  //   {
  //     participant: '3 Participant',
  //     score: 7.6,
  //     stage: 'Beginner Run 1st',
  //   },
  //   {
  //     participant: '5 Participant',
  //     score: 7.6,
  //     stage: 'Beginner Run 2nd',
  //   },
  //   {
  //     participant: '5 Participant',
  //     score: 7.6,
  //     stage: 'Beginner Run 2nd',
  //   },
  // ]
  useEffect(() => {
    initDataListener()
  }, [])

  useEffect(() => {
    calculateScoreData()
  }, [_judges, _data])

  const initDataListener = () => {
    onSnapshot(docReference, (doc) => {
      let d: any = doc.data()
      _setData({ ...d })
    })
    onSnapshot(docReferenceJudges, (doc) => {
      let d: any = doc.data()
      _setJudges({ ...d })
    })
  }

  const calculateScoreData = () => {
    //if judges score is empty, than retrieve the participant list in event data to populate live scoring board participants

    /*make participant list object to assist in creating sum of scores
    {
      1st Participant:{},
      2nd Participant:{},
      3rd Participant:{},
      ...
    }
    make stages list object to help with stage grouping later on, important for
    determination of score-circle-appearance-count, but this object is dynamic, it depend on variety of stage in event-scores array {
      Open Run 1st: {},
      Open Run 2nd: {},
    }
    */
    function arrayUnique(arr, uniqueKey) {
      const flagList = new Set()
      return arr.filter(function (item) {
        if (!flagList.has(item[uniqueKey])) {
          flagList.add(item[uniqueKey])
          return true
        }
      })
    }

    let t = arrayUnique(_judges.scores, 'stage')
    let currentStages = {}
    t.forEach((e: any) => {
      currentStages[e.stage] = {}
    })
    t = arrayUnique(_judges.scores, 'participant')
    let currentParticipants = {}
    t.forEach((e: any) => {
      currentParticipants[e.participant] = {}
    })

    /* make participant list object to identify ease the sum of scores {
      1st Participant:{
          Open Run 1st: 99,
          Open Run 2nd: 22,
      },
      ...
    }
    */

    for (
      let index = 0;
      index < Object.keys(currentParticipants).length;
      index++
    ) {
      let indexKey = Object.keys(currentParticipants)[index]
      let filtered = _judges.scores.filter((data) => {
        return data.participant.toLowerCase() === indexKey.toLowerCase()
      })
      if (filtered.length > 0) {
        filtered.forEach((e) => {
          let stage = currentParticipants[indexKey][e.stage]
          let score = e.score

          if (isNaN(stage) || typeof stage === 'undefined') {
            currentParticipants[indexKey][e.stage] = 0
          }
          currentParticipants[indexKey][e.stage] += score
        })
      }
      currentParticipants[indexKey]['total'] = 0
      for (
        let j = 0;
        j < Object.keys(currentParticipants[indexKey]).length;
        j++
      ) {
        const elementKey = Object.keys(currentParticipants[indexKey])[j]
        if (elementKey.toLowerCase() !== 'total') {
          currentParticipants[indexKey]['total'] +=
            currentParticipants[indexKey][elementKey]
        }
      }
      currentParticipants[indexKey]['active'] =
        _data.participants.data[
          _data.participants.playing
        ].name.toLowerCase() === indexKey.toLowerCase()
    }

    _setCurrent({ ...currentParticipants })
  }

  const _buildScoreCard = ({
    active = false,
    index = 1,
    name,
    scores = [],
  }) => {
    const scoreBackground = active
      ? "bg-[url('/images/player-score-active.png')]"
      : "bg-[url('/images/player-score-inactive.png')]"

    const playerNameBackground = active
      ? "bg-[url('/images/player-name-active.png')]"
      : "bg-[url('/images/player-name-inactive.png')]"

    const color = active ? 'text-zinc-700' : 'text-zinc-900'

    return (
      <div className="flex gap-1 font-bold">
        <div
          className={`flex h-11 w-64 items-center bg-contain bg-no-repeat ${playerNameBackground}`}
        >
          <div className={`text-md flex items-center pl-3  ${color}`}>
            <p className="pr-0.5 text-sm">#</p>
            <p className="w-4">{index}</p>
            <p className="pl-2">{name}</p>
          </div>
        </div>

        {scores.map((e: any) => {
          return (
            <div
              key={e}
              className={`flex h-11 w-11 items-center justify-center bg-cover bg-no-repeat ${scoreBackground} ${color}`}
            >
              {e}
            </div>
          )
        })}
      </div>
    )
  }

  const sortByPoint = (obj) => {
    const order = []
    const res = {}
    Object.keys(obj).forEach((key) => {
      return (order[obj[key]['total'] - 1] = key)
    })
    order.forEach((key) => {
      res[key] = obj[key]
    })
    return res
  }

  const _buildScoreRow = () => {
    let curr = _current

    // console.log({ message: 'before', curr })
    // curr = sortByPoint(curr)
    console.log({ message: 'after', curr })

    const sepperateRow = (start: number, finish: number) => {
      //make the object an 'array'
      let objects = Object.keys(curr).sort((a, b) => {
        return curr[b].total - curr[a].total
      })
      return objects.map((e: any, i: number) => {
        let alteredIndex = i + start
        let alteredFinish =
          finish > Object.keys(curr).length ? Object.keys(curr).length : finish
        if (alteredIndex > alteredFinish) {
          return
        }
        let data = curr[e]
        let scores = []

        if (!Object.keys(curr)[alteredIndex]) {
          return
        }
        Object.keys(data).forEach((ee: any) => {
          if (ee.toLowerCase() !== 'total' && ee.toLowerCase() !== 'active') {
            scores.push(data[ee])
            return
          }
        })
        return (
          <_buildScoreCard
            key={Object.keys(curr)[alteredIndex]}
            index={alteredIndex + 1}
            name={Object.keys(curr)[alteredIndex]}
            scores={scores}
            active={data['active']}
          />
        )
      })
    }

    return (
      <div className="flex justify-around gap-3">
        <div className="flex flex-col gap-3">{sepperateRow(0, 9)}</div>
        <div className="flex flex-col gap-3">{sepperateRow(10, 19)}</div>
      </div>
    )
  }

  return (
    <div className="h-screen min-h-screen  overflow-hidden bg-zinc-900 bg-[url('/images/background.png')] bg-cover p-8 font-openSans text-gray-50">
      <Head>
        <title>LIVE SCORE | {_data.title}</title>
      </Head>

      <main className="flex h-full items-center font-openSans">
        <div className="flex h-full w-1/3 max-w-md flex-col justify-around">
          <div className="w-full self-center ">
            <img
              className="mx-auto"
              src="/images/logo.png"
              alt="logo image"
            ></img>
          </div>
          <div className=" text-center text-6xl font-bold uppercase shadow-black drop-shadow-xl">
            {_data.stages.data[_data.stages.playing].name}
          </div>
          <div className="relative h-28 ">
            <img
              className="absolute -bottom-44 left-0 right-0 h-52 w-52"
              src="/images/logo-mapalus.png"
              alt="logo mapalus image"
            />
          </div>
        </div>
        <div className=" flex-1 overflow-hidden p-4">
          <_buildScoreRow />
        </div>
        <img
          className="absolute left-[23rem] bottom-4 h-20 w-24 "
          src="/images/logo-aron.png"
          alt="Logo aron"
        />
        <img
          className="absolute left-64 -bottom-0 h-32 w-24"
          src="/images/logo-minahasa-skate.png"
          alt="Logo minahasa skate"
        />
      </main>
    </div>
  )
}

export default LiveEvent
