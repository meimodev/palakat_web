import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MainAdminCard from '../../components/MainAdminCard'

import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import CurrentStandingCard from '../../components/CurrentStandingCard'
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
    judges: { data: [], playing: -1, title: '-' },
    live: false,
    participants: { data: [], playing: -1, title: '-' },
    stages: { data: [], playing: -1, title: '-' },
    notes: [],
  }

  const judges = { data: [], playing: -1, title: '-' }

  const [_pageData, _setPageData] = useState(data)
  const [_judges, _setJudges] = useState(judges)

  const [isDialogAddingOpen, setIsDialogAddingOpen] = useState(false)
  const [_qrCode, _setQrCode] = useState('')

  const generateRandomId = () => {
    return Math.random().toString(36).replace('0.', '')
  }

  const docReference = doc(db, 'events', 'come-and-skate-tondano-2022')
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

        {/* <div className="flex flex-col items-center">
          <button className="mt-6 overflow-hidden rounded-xl bg-zinc-700 px-6 py-3 font-bold">
            WRAP SCORE
            <p className="text-sm font-light">Open Run 1st</p>
          </button>
        </div> */}

        <MainAdminCard
          config={_pageData.participants}
          onDelete={async (data: any, playing?: number) => {
            await updateDoc(docReference, {
              participants: { ..._pageData.participants, data, playing },
            })
          }}
          onAdd={undefined}
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
    </div>
  )
}

export default Admin
