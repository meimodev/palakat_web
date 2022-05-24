import { useEffect, useState } from 'react'

const CurrentStandingCard = ({ pageData, participants, stages }: any) => {
  //check if contain any score, display none if contain no score

  const data: any = []

  const [_data, _setData] = useState(data)
  useEffect(() => {
    populate()
  }, [pageData, participants])

  const populate = () => {
    //extract the only needed data
    if (!pageData || !participants || !stages) {
      return
    }
    const data: any = []
    pageData.forEach((e: any) => {
      return data.push(...e.scores)
    })

    let dataPerParticipant: any = []
    participants.forEach((p: any, i: number) => {
      let push = { name: p.name, scores: [] }

      data.forEach((d: any) => {
        if (d.participant.toLowerCase() === p.name.toLowerCase()) {
          push.scores.push({ stage: d.stage, score: d.score })
        }
      })

      dataPerParticipant.push(push)
    })

    //clean the dataPerParticipant

    // dataPerParticipant.forEach((d:any) => {
    //     let newScores = [];
    //     d.scores.foreach((s:any)=>{
    //         stages.forEach((stage:any) => {

    //         });
    //     })
    // });

    dataPerParticipant.forEach((data: any) => {
      let newScores: any = []
      stages.forEach((stage: any) => {
        newScores.push({ stage: stage.name, scores: [] })
        for (let index = 0; index < data.scores.length; index++) {
          const sc: any = data.scores[index]

          if (sc.stage.toLowerCase() === stage.name.toLowerCase()) {
            let findIndex = newScores.findIndex(
              (fi: any) => fi.stage.toLowerCase() === stage.name.toLowerCase()
            )
            newScores[findIndex].scores.push(sc.score)
          }
        }
      })
      data.scores = newScores
    })

    // console.log({ dataPerParticipant })
    _setData(dataPerParticipant)
  }

  const Row = ({ index, row }: any) => {
    return (
      <div className="flex gap-2">
        <div className="w-28 flex-1 text-left">{row.name}</div>
        {row.scores.map((e: any, i: any) => {
          return (
            <div className="w-6 text-center" key={i}>
              {e.scores.length < 1
                ? '0'
                : e.scores.reduce((total: number, current: number) => {
                    return total + current
                  })}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="my-5 text-sm  text-zinc-100">
      <div className="text-lg font-bold">CURRENT STANDING</div>

      {_data.map((e: any, i: number) => (
        <Row key={i} index={i} row={e} />
      ))}
    </div>
  )
}

export default CurrentStandingCard
