import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MainAdminCard from '../../components/MainAdminCard'

import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import CustomDialog from '../../components/CustomDialog'
import { QRCodeSVG } from 'qrcode.react'

const Admin = () => {
  const router = useRouter()
  const { id } = router.query

  const data = {
    title: '-',
    date: '-',
    time: '-',
    place: '-',
    region: '-',
    // judges: { data: [], playing: -1, title: '-' },
    live: false,
    done: false,
    break: false,

    participants: { data: [], playing: -1, title: '-' },
    stages: { data: [], playing: -1, title: '-' },
    notes: [],
  }

  const judges = { data: [], playing: -1, title: '-' }

  const [_pageData, _setPageData] = useState(data)
  const [_judges, _setJudges] = useState(judges)

  const [isDialogAddingOpen, setIsDialogAddingOpen] = useState(false)
  const [_qrCode, _setQrCode] = useState('')
  const [_scorePools, _setScorePools] = useState([])

  const [_newParticipantName, _setNewParticipantName] = useState('')
  const [_newParticipantDialogOpen, _setNewParticipantDialogOpen] =
    useState(false)

  const generateRandomId = () => {
    return Math.random().toString(36).replace('0.', '')
  }

  const docReference = doc(db, 'events', 'come-and-skate-tondano-2022')
  const docReferenceRecords = doc(
    db,
    'events',
    'come-and-skate-tondano-2022-records'
  )
  const docReferenceJudges = doc(
    db,
    'events',
    'come-and-skate-tondano-2022-judges'
  )

  useEffect(() => {
    listenToDataChanges()
  }, [])

  const listenToDataChanges = async () => {
    onSnapshot(
      doc(db, 'events', 'come-and-skate-tondano-2022'),
      { includeMetadataChanges: true },
      (doc) => {
        // const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server'
        const res: any = doc.data()
        _setPageData({ ...res })
      }
    )

    onSnapshot(
      doc(db, 'events', 'come-and-skate-tondano-2022-judges'),
      { includeMetadataChanges: true },
      (doc) => {
        //  const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server'
        const res: any = doc.data()
        _setScorePools([...res.scores])
        _setJudges({ ...res.judges })
      }
    )
  }

  const _buildNavBar = () => {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900 font-openSans text-sm ">
        <div className="flex flex-col pt-6 pl-6 pr-6 ">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-4xl font-bold">PALAKAT</div>
            <div className="text-md self-center">Admin Panel</div>
          </div>
          <div className="flex text-lg font-bold">
            {_pageData.title.toUpperCase()}
          </div>
          <div className="flex items-center justify-between gap-2  py-2">
            <div
              className={
                'h-0.5 flex-1  rounded-lg ' +
                (_pageData.live ? 'bg-red-600 ' : 'bg-zinc-100')
              }
            ></div>
            <div className="">
              <button
                className={
                  'rounded-lg  py-2 px-10 ' +
                  (_pageData.live
                    ? 'bg-red-600 text-zinc-100'
                    : ' bg-zinc-700 text-zinc-100')
                }
                onClick={handleOnClickLive}
              >
                <p className="text-lg font-bold"> LIVE </p>
              </button>
            </div>
            <div
              className={
                'h-0.5 flex-1  rounded-lg ' +
                (_pageData.live ? 'bg-red-600 ' : '  bg-zinc-100')
              }
            ></div>
          </div>
        </div>
      </div>
    )
  }

  const handleOnClickLive = async () => {
    await updateDoc(docReference, {
      live: !_pageData.live,
    })
  }
  const handleOnClickWrap = async () => {
    //move the scores pool from judges document to dedicated document for score record

    await updateDoc(docReferenceRecords, {
      records: arrayUnion(..._scorePools),
    })

    //add 0 point for each participant to display their names on the screen
    let names = []
    console.log({ _pageData, _judges })
    const isFinalStage =
      _pageData.stages.playing + 1 === _pageData.stages.data.length

    if (!isFinalStage) {
      _pageData.participants.data.forEach((element) => {
        names.push({
          participant: element.name,
          judge: '0',
          stage: _pageData.stages.data[_pageData.stages.playing + 1].name,
          score: 0,
        })
      })
    }

    await updateDoc(docReferenceJudges, {
      scores: names,
    })
  }

  const handleOnClickNewParticipant = async () => {
    // TODO add the validation logics for broad users

    await updateDoc(docReference, {
      'participants.data': arrayUnion({
        name: _newParticipantName,
        action: '-',
      }),
    })

    _setNewParticipantDialogOpen(false)
  }

  return (
    <div className="min-h-screen select-none bg-zinc-900 font-openSans text-gray-50">
      <Head>
        <title>Admin | {_pageData.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <_buildNavBar />

      <main className="px-6 pt-44">
        <div className="font-light">{_pageData.place}</div>
        <div className="font-light">
          {_pageData.date} | {_pageData.time}
        </div>
        <div className="font-light">{_pageData.region}</div>

        <MainAdminCard
          config={_judges}
          onNext={undefined}
          onPrevious={undefined}
          onDelete={async (data: any, playing?: number) => {
            await updateDoc(docReferenceJudges, {
              'judges.data': data,
            })
          }}
          onAdd={async () => {
            let key = generateRandomId()
            await updateDoc(docReferenceJudges, {
              'judges.data': arrayUnion({
                claim: false,
                key: key,
                name: key,
                scores: [],
              }),
            })

            setIsDialogAddingOpen(true)
            let url = window.origin
            _setQrCode(url + '/scoring/' + key)
          }}
        />

        <MainAdminCard
          config={_pageData.stages}
          onDelete={async (data: any, playing?: number) => {
            await updateDoc(docReference, {
              stages: { ..._pageData.stages, data, playing },
            })
          }}
          onAdd={undefined}
          onNext={async (newData: any, playing: any) => {
            await updateDoc(docReference, {
              stages: { ..._pageData.stages, data: newData, playing },
            })
          }}
          onPrevious={async (newData: any, playing: any) => {
            console.log({ newData, playing })
            await updateDoc(docReference, {
              stages: { ..._pageData.stages, data: newData, playing },
            })
          }}
        />

        <div className="flex flex-col items-center">
          <button
            onClick={handleOnClickWrap}
            className="mt-6 overflow-hidden rounded-xl bg-zinc-700 px-6 py-3 font-bold"
          >
            WRAP SCORE
            <p className="text-sm font-light">
              {typeof _pageData.stages.data[_pageData.stages.playing] ===
              'undefined'
                ? '-'
                : _pageData.stages.data[_pageData.stages.playing].name}
            </p>
          </button>
        </div>

        <MainAdminCard
          config={_pageData.participants}
          onDelete={async (data: any, playing?: number) => {
            await updateDoc(docReference, {
              participants: { ..._pageData.participants, data, playing },
            })
          }}
          onAdd={() => {
            _setNewParticipantDialogOpen(true)
          }}
          onNext={async (newData: any, playing: any) => {
            await updateDoc(docReference, {
              participants: {
                ..._pageData.participants,
                data: newData,
                playing,
              },
            })
          }}
          onPrevious={async (newData: any, playing: any) => {
            console.log({ newData, playing })
            await updateDoc(docReference, {
              participants: {
                ..._pageData.participants,
                data: newData,
                playing,
              },
            })
          }}
        />

        {/* <CurrentStandingCard
          pageData={_judges.data}
          participants={_pageData.participants.data}
          stages={_pageData.stages.data}
        /> */}
      </main>
      <div className="py-16"></div>

      <CustomDialog
        open={isDialogAddingOpen}
        onDismiss={() => setIsDialogAddingOpen(!isDialogAddingOpen)}
      >
        <div className="flex flex-col items-start justify-between text-zinc-100">
          <div>
            <h1 className="text-lg font-bold">ADD NEW JUDGES</h1>
          </div>
          {_qrCode ? (
            <div className="my-6 self-center bg-white p-2">
              <QRCodeSVG value={_qrCode} />
            </div>
          ) : null}
          <div className="self-end rounded-xl border-2 border-zinc-200 py-2 px-4">
            <p>OK</p>
          </div>
        </div>
      </CustomDialog>
      <CustomDialog open={_newParticipantDialogOpen} onDismiss={() => {}}>
        <div className="flex flex-col items-start justify-between text-zinc-100">
          <form className="my-6 flex w-full flex-col text-zinc-900">
            <input
              type="text"
              value={_newParticipantName}
              onChange={(e) => {
                _setNewParticipantName(e.target.value)
              }}
              className=" text-md rounded-t-xl  bg-zinc-100  pt-4 pb-2 text-center font-bold focus:outline-none "
            />
            <div className="bg-zinc-100">
              <div className={`mx-auto h-0.5 w-4/5`}></div>
            </div>
            <label
              className={`rounded-b-xl bg-zinc-100 pt-2 pb-4 text-center text-sm `}
            >
              New Participant
            </label>
          </form>
          <div className="mt-10 flex gap-4 self-end">
            <button
              onClick={() => {
                _setNewParticipantName('')
                _setNewParticipantDialogOpen(false)
              }}
              className="rounded-lg bg-zinc-700  py-2 px-4 font-bold"
            >
              <i className="las la-times text-lg text-red-600"></i>
            </button>
            <button
              onClick={handleOnClickNewParticipant}
              className="rounded-lg bg-zinc-700  py-2 px-4 font-bold"
            >
              <i className="las la-check text-lg text-green-600"></i>
            </button>
          </div>
        </div>
      </CustomDialog>
    </div>
  )
}

export default Admin
