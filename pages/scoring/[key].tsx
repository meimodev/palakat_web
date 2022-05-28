import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { db } from '../../firebase'
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import CustomDialog from '../../components/CustomDialog'

const Scoring = () => {
  const router = useRouter()
  const { key } = router.query

  const data = {
    title: '-',
    date: '-',
    time: '-',
    place: '-',
    region: '-',

    live: false,
    done: false,

    participants: { data: [], playing: 0, title: '-' },
    stages: { data: [], playing: 0, title: '-' },
    notes: [],
  }

  const judges = { data: [], playing: -1, title: '-' }

  const docReference = doc(db, 'events', 'come-and-skate-tondano-2022')
  const docReferenceJudges = doc(
    db,
    'events',
    'come-and-skate-tondano-2022-judges'
  )
  const docReferenceId = 'come-and-skate-tondano-2022'
  const docReferenceIdJudges = 'come-and-skate-tondano-2022-judges'

  const [_error, _setError] = useState('')
  const [_judges, _setJudges] = useState(judges)
  const [_data, _setData] = useState(data)
  const [_currentJudge, _setCurrentJudge] = useState({
    name: '',
    claim: false,
    scores: [],
  })
  const [_claimDialogOpen, _setClaimDialogOpen] = useState(false)
  const [_newJudgeName, _setNewJudgeName] = useState('')
  const [_newJudgeNameError, _setNewJudgeNameError] = useState('')
  const [_score, _setScore] = useState('')
  const [_scoreError, _setScoreError] = useState('')
  const [_isSubmitted, _setIsSubmitted] = useState(false)
  const [_confirmScoreDialogOpen, _setConfirmScoreDialogOpen] = useState(false)

  useEffect(() => {
    //check if the event still live and not done
    initDataListener()
  }, [])

  useEffect(() => {
    checkEventValidity()
  }, [key, _data])

  const checkEventValidity = async () => {
    const dataSnap = await getDoc(docReference)
    const judgesSnap = await getDoc(docReferenceJudges)

    const tData = { ...dataSnap.data() }
    const tJudges = { ...judgesSnap.data().judges }

    if (tJudges.data.length < 0) {
      return
    }
    const isEventDone = tData.done
    if (isEventDone) {
      _setError('EVENT DONE, see events score in event page')
      return
    }

    if (typeof key === 'undefined') {
      return
    }
    const keyExistIndex = tJudges.data.findIndex((e: any) => e.key === key)
    if (keyExistIndex < 0) {
      _setError('INVALID KEY, contact event official for futher assistance')
      return
    }
    const isEventLive = tData.live
    if (!isEventLive) {
      _setError('NOT LIVE, hold your horses tiger, event is coming')
      return
    }

    _setError('')
    const currJudge = tJudges.data[keyExistIndex]
    if (!currJudge.claim) {
      //open claim dialog
      _setClaimDialogOpen(true)
      return
    }
    _setCurrentJudge({ ...currJudge })
  }

  const initDataListener = () => {
    onSnapshot(docReference, (doc) => {
      const e: any = doc.data()
      _setData({ ...e })
      _setScore('')
      _setIsSubmitted(false)
    })
    onSnapshot(docReferenceJudges, (doc) => {
      const j: any = doc.data()
      _setJudges({ ...j })
    })
  }

  const _buildErrorPage = () => {
    return (
      <div>
        <Head>
          <title>PALAKAT | Whoops -_- </title>
        </Head>
        <div className="fixed top-0 bottom-0 left-0 right-0  bg-zinc-900 font-openSans text-sm text-zinc-100">
          <div className="flex h-screen w-screen flex-col items-center justify-center">
            <h1 className="text-6xl font-bold">PALAKAT</h1>
            <div className="my-2 flex justify-between gap-16 font-light">
              <Link href={'/'}>Home</Link>
              <Link href={'/events'}>Events</Link>
              <Link href={'/contact'}>Contact</Link>
            </div>
            <div className="text=xl mt-12 mb-36 text-center font-bold">
              {_error}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (_error) {
    return <_buildErrorPage />
  }

  const _buildNavBar = () => {
    return (
      <div className="fixed top-0 left-0 right-0 z-10 bg-zinc-900 font-openSans text-sm ">
        <div className=" pt-6 pl-6 pr-6 ">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-4xl font-bold">PALAKAT</div>
            <div className="text-md self-center">Scoring Board</div>
          </div>
          <div className="flex text-lg font-bold">
            {_data.title.toUpperCase()}
          </div>
          <div className="mt-2 h-1 rounded-lg bg-gray-100"></div>
        </div>
      </div>
    )
  }

  const _buildNoteCard = () => {
    return (
      <div className="rounded-lg bg-zinc-700 p-6">
        <div className="text-md font-bold">NOTE !</div>
        <div className="pl-6 text-sm font-light">
          {_data.notes.map((e: string, i: number) => (
            <div key={i} className="list-item">
              {e}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const _buildJudgeCard = () => {
    if (_currentJudge.name === '') {
      return <div></div>
    }
    return (
      <div className="flex flex-col  text-center">
        <div className="text-sm font-light uppercase">Judge</div>
        <div className="font-bold">{_currentJudge.name}</div>
      </div>
    )
  }

  const handleOnClickSubmitScore = async () => {
    //validate score
    //check if contain , replace to .
    let score
    if (_score.includes('.')) {
      score = parseFloat(_score.replaceAll(',', '.'))
    } else {
      score = parseFloat(_score)
    }

    if (isNaN(score)) {
      _setScoreError("Invalid score, can only be '0-9' ',' '.' ")
      return
    }

    _setConfirmScoreDialogOpen(true)
  }

  const handleOnClickNewJudge = async () => {
    if (_newJudgeName.length < 3) {
      _setNewJudgeNameError('minimum 3 character')
      return
    }

    const judgesSnap = await getDoc(docReferenceJudges)
    const newData = { ...judgesSnap.data().judges }
    const index = newData.data.findIndex((e: any) => e.key === key)
    newData.data[index].name = _newJudgeName
    newData.data[index].claim = true

    _setCurrentJudge(newData.data[index])
    _setClaimDialogOpen(!_claimDialogOpen)
    await updateDoc(docReferenceJudges, {
      'judges.data': newData.data,
    })
  }

  const handleOnClickConfirmDialogScore = async () => {
    let score
    if (_score.includes('.')) {
      score = parseFloat(_score.replaceAll(',', '.'))
    } else {
      score = parseFloat(_score)
    }

    const participantName =
      _data.participants.data[_data.participants.playing].name
    const stageName = _data.stages.data[_data.stages.playing].name
    const push = {
      judge: _currentJudge.name,
      participant: participantName,
      score: score,
      stage: stageName,
    }

    await updateDoc(doc(db, 'events', docReferenceIdJudges), {
      scores: arrayUnion(push),
    })

    _setIsSubmitted(true)
    _setConfirmScoreDialogOpen(false)
  }

  if (_data.participants.data.length < 1) {
    return (
      <div className="min-h-screen select-none bg-zinc-900  font-openSans text-gray-50">
        <div className="flex h-screen flex-col items-center justify-center">
          <div className="text-4xl font-bold">PALAKAT</div>
          <div>Loading things n stuff ...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen select-none bg-zinc-900  font-openSans text-gray-50">
      <Head>
        <title>Scoring | {_data.title}</title>
      </Head>

      <div className="">
        <_buildNavBar />
      </div>

      <main className="px-6 pt-32">
        <div className="text-xs font-light">{_data.place}</div>
        <div className="text-xs font-light ">
          {_data.region} | {_data.date}
        </div>

        <div className="pt-6">
          <_buildNoteCard />
        </div>

        <div className="pt-12">
          <_buildJudgeCard />
        </div>

        <div className="pt-3">
          <div className="flex flex-col items-center rounded-xl bg-zinc-700 px-3 py-5">
            <div>
              <h1 className="text-center text-xs font-bold">
                PARTICIPANT {_data.participants.playing + 1} of{' '}
                {_data.participants.data.length}
              </h1>
            </div>
            <div className="mt-4 text-center text-xl font-bold">
              {_data.participants.data[
                _data.participants.playing
              ].name.toUpperCase()}
            </div>
            <div className="">
              {_data.stages.data[_data.stages.playing].name}
            </div>
          </div>
        </div>
        <div className="mx-6 mt-6 overflow-hidden rounded-xl bg-zinc-100 text-zinc-900">
          <div>
            <form className="flex flex-col">
              <input
                type="number"
                value={_score}
                disabled={_isSubmitted}
                onChange={(e: any) => {
                  _setScore(e.target.value)
                  _setScoreError('')
                }}
                className="rounded-xl border-0 bg-zinc-100 pt-4 pb-2 text-center text-6xl font-bold focus:outline-none "
              />
              <div className="bg-zinc-100">
                <div
                  className={`mx-auto h-0.5 w-4/5 
                  ${_scoreError.length > 0 ? ' bg-red-600 ' : ' bg-zinc-800 '}`}
                ></div>
              </div>{' '}
              <label
                className={`rounded-b-xl bg-zinc-100 py-3 text-center text-sm ${
                  _scoreError.length > 0 ? ' text-red-600 ' : ' text-zinc-800 '
                }`}
              >
                {_scoreError.length > 0 ? _scoreError : 'score'}
                {_isSubmitted ? (
                  <i className="las la-check pl-2  font-bold text-green-500"></i>
                ) : null}
              </label>
            </form>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {_isSubmitted ? (
            <div className="mt-6 overflow-hidden rounded-xl py-3">
              WAITING NEXT PARTICIPANT ...
            </div>
          ) : (
            <button
              onClick={handleOnClickSubmitScore}
              className="mt-6 overflow-hidden rounded-xl bg-zinc-700 px-6 py-3 font-bold"
            >
              SUBMIT SCORE
            </button>
          )}
        </div>
      </main>
      <div className="py-16"></div>

      <CustomDialog open={_confirmScoreDialogOpen} onDismiss={() => {}}>
        <div className="flex flex-col items-start justify-between text-zinc-100">
          <div>
            <h1 className="text-lg font-bold">CONFIRM SCORE</h1>
          </div>

          <div className="pt-2 text-sm">
            <p>
              {_data.participants.data[
                _data.participants.playing
              ].name.toUpperCase()}
            </p>
            <p>{_data.stages.data[_data.stages.playing].name.toUpperCase()} </p>
            <p>score {_score}</p>
          </div>
          <div className="mt-10 flex gap-4 self-end">
            <button
              onClick={() => _setConfirmScoreDialogOpen(false)}
              className="rounded-lg bg-zinc-700  py-2 px-4 font-bold"
            >
              <i className="las la-times text-lg text-red-600"></i>
            </button>
            <button
              onClick={handleOnClickConfirmDialogScore}
              className="rounded-lg bg-zinc-700  py-2 px-4 font-bold"
            >
              <i className="las la-check text-lg text-green-600"></i>
            </button>
          </div>
        </div>
      </CustomDialog>

      <CustomDialog open={_claimDialogOpen} onDismiss={() => {}}>
        <div className="flex flex-col items-start justify-between text-zinc-100">
          <div>
            <h1 className="text-lg font-bold">NEW JUDGE</h1>
          </div>
          <form className="my-6 flex w-full flex-col text-zinc-900">
            <input
              type="text"
              value={_newJudgeName}
              onChange={(e) => {
                _setNewJudgeName(e.target.value)
                _setNewJudgeNameError('')
              }}
              className=" text-md rounded-t-xl  bg-zinc-100  pt-4 pb-2 text-center font-bold focus:outline-none "
            />
            <div className="bg-zinc-100">
              <div
                className={`mx-auto h-0.5 w-4/5 
                  ${
                    _newJudgeNameError.length > 0
                      ? ' bg-red-600 '
                      : ' bg-zinc-800 '
                  }`}
              ></div>
            </div>
            <label
              className={`rounded-b-xl bg-zinc-100 pt-2 pb-4 text-center text-sm ${
                _newJudgeNameError.length > 0
                  ? ' text-red-600 '
                  : ' text-zinc-800 '
              }`}
            >
              {_newJudgeNameError.length > 0
                ? _newJudgeNameError
                : 'Judge Name'}
            </label>
          </form>
          <button
            onClick={handleOnClickNewJudge}
            className="self-end  rounded-lg bg-zinc-700  py-2 px-4 font-bold"
          >
            OK
          </button>
        </div>
      </CustomDialog>
    </div>
  )
}

export default Scoring
