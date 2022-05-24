import { useEffect, useState } from 'react'
import CustomDialog from './CustomDialog'
import { QRCodeSVG } from 'qrcode.react'

type MainAdminCard = {
  config: any
  onDelete: any
  onNext: any
  onPrevious: any
  onAdd: any
}

const MainAdminCard = ({
  config,
  onDelete,
  onNext,
  onPrevious,
  onAdd,
}: MainAdminCard) => {
  const [_config, set_Config] = useState(config)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    set_Config(config)
  }, [config])

  const _buildCardFooter = ({ currentIndex, currentPlaying }: any) => {
    return (
      <div className="flex justify-between px-3 pt-6 pl-6">
        <_buildButton
          icon={<i className="las la-trash text-xl"> </i>}
          color=" bg-red-500 "
          onClick={() => handleOnClickDeleteFooter(currentIndex)}
        />
        <div className="flex items-center gap-3">
          <_buildButton
            icon={<i className="las la-caret-left text-xl"></i>}
            onClick={() => handleOnClickPrev(currentPlaying)}
            isDisabled={currentPlaying === 0}
          />
          {currentPlaying + 1} of {_config.data.length}
          <_buildButton
            icon={<i className="las la-caret-right text-xl"></i>}
            onClick={() => handleOnClickNext(currentPlaying)}
            isDisabled={currentPlaying + 1 === _config.data.length}
          />
        </div>
      </div>
    )
  }

  const handleOnClickRow = (index: number) => {
    if (selectedIndex > -1 && _config.playing > -1) {
      setSelectedIndex(index)
    }
  }

  const handleOnClickDeleteFooter = (index: number) => {
    if (index == _config.playing) {
      console.log('active playing!')
      return
    }

    const row = _config.data[index]

    const newData = _config.data.filter((e: any) => {
      return e.name.toLowerCase() !== row.name.toLowerCase()
    })

    // const newData = _config.data.splice(index, 1)
    // set_Config({ ..._config, data: newData })

    let playing = _config.playing
    if (index < _config.playing) {
      playing--
    }

    if (onDelete) {
      onDelete(newData, playing)
    }
  }

  const handleOnClickDeleteRow = (row: any) => {
    const newData = _config.data.filter((e: any) => {
      return e.name.toLowerCase() !== row.name.toLowerCase()
    })

    // set_Config({ ..._config, data: newData })
    if (onDelete) {
      onDelete(newData)
    }
  }

  const handleOnClickNext = (index: number) => {
    const currentRow = { ..._config.data[index] }
    currentRow.action = '-'
    const nextRow = { ..._config.data[index + 1] }
    nextRow.action = 'playing'
    const newData = [..._config.data]
    newData[index] = currentRow
    newData[index + 1] = nextRow

    // set_Config({ ..._config, data: newData, playing: _config.playing + 1 })

    if (onNext) {
      onNext(newData, _config.playing + 1)
    }
  }
  const handleOnClickPrev = (index: number) => {
    const currentRow = { ..._config.data[index] }
    currentRow.action = '-'
    const nextRow = { ..._config.data[index - 1] }
    nextRow.action = 'playing'
    const newData = [..._config.data]
    newData[index] = currentRow
    newData[index - 1] = nextRow

    // set_Config({ ..._config, data: newData, playing: _config.playing - 1 })

    if (onPrevious) {
      onPrevious(newData, _config.playing - 1)
    }
  }
  const handleOnAdd = () => {
    if (onAdd) {
      onAdd()
    }
  }

  if (_config.data.length === 0) {
    return (
      <div className="mt-6 overflow-hidden rounded-md bg-zinc-100  text-zinc-900">
        <div className="flex items-center justify-between px-3 pb-3 pt-3">
          <div className="font-bold">{_config.title.toUpperCase()}</div>
          <_buildButton
            icon={<i className="las la-plus text-xl"></i>}
            onClick={handleOnAdd}
            isDisabled={false}
          />
        </div>
      </div>
    )
  }

  return (
    // <MainAdminCardContext.Provider
    //   value={{ config: _config, setConfig: set_Config }}
    // >
    <div className="mt-6 overflow-hidden rounded-md bg-zinc-100 pb-9 text-zinc-900">
      <div className="flex items-center justify-between px-3 pb-3 pt-3">
        <div className="font-bold">{_config.title.toUpperCase()}</div>
        <_buildButton
          icon={<i className="las la-plus text-xl"></i>}
          onClick={handleOnAdd}
          isDisabled={false}
        />
      </div>
      {_config.data.map((e: any, i: any) => {
        return (
          <_buildRow
            row={e}
            key={i}
            index={i}
            isSelected={i === selectedIndex && _config.playing > -1}
            onClickRow={() => handleOnClickRow(i)}
            onClickDelete={() => handleOnClickDeleteRow(e)}
          />
        )
      })}
      {_config.playing > -1 ? (
        <div>
          <_buildCardFooter
            currentIndex={selectedIndex}
            currentPlaying={_config.playing}
          />
        </div>
      ) : null}
    </div>
    // </MainAdminCardContext.Provider>
  )
}

export default MainAdminCard

const _buildRow = ({
  index,
  row,
  isSelected,
  onClickRow,
  onClickDelete,
}: any) => {
  const last = !row.action ? (
    <_buildButton
      icon={<i className="las la-trash text-xl"></i>}
      color=" bg-red-500 "
      onClick={onClickDelete}
    />
  ) : (
    <p>{row.action}</p>
  )
  const selectBg = isSelected ? ' bg-zinc-300 ' : ''
  return (
    <div className={'flex flex-col py-2 px-3' + selectBg} onClick={onClickRow}>
      <div className="flex items-center justify-around ">
        <div className="w-6 text-center">{index + 1}</div>
        <div className="flex-1">{row.name}</div>
        <div className="w-14 text-center">{last}</div>
      </div>
    </div>
  )
}

const _buildButton = ({ icon, color, onClick, isDisabled }: any) => {
  let bgCol = color ? color : ' bg-zinc-900 '
  let textCol = ' text-zinc-100 '
  if (isDisabled) {
    bgCol = ' bg-zinc-400 '
    textCol = ' text-zinc-200 '
  }
  return (
    <button
      className={`rounded-md ${bgCol} px-2 py-1 ${textCol} drop-shadow-lg`}
      onClick={() => {
        if (isDisabled) {
          return
        }
        onClick()
      }}
    >
      {icon}
    </button>
  )
}
