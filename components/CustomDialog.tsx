import { useState } from 'react'

const CustomDialog = ({ open, onDismiss, children }: any) => {
  if (!open) {
    return <></>
  }

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-50 backdrop-blur-lg"
      onClick={onDismiss}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className=" w-4/5 rounded-xl bg-zinc-800 p-6 font-openSans">
          {children}
        </div>
      </div>
    </div>
  )
}

export default CustomDialog
