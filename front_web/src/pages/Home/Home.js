import { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'
import { SEND_TEST } from '../../store/constants'

export default function Home() {
  const { ipcRenderer } = window.require('electron')

  useEffect(() => {
    ipcRenderer.on(SEND_TEST, (event, arg) => {
      console.log(event, arg, '받음')
      setTest(arg)
    })
  }, [])

  const sendMain = () => {
    ipcRenderer.send(SEND_TEST, 'hello')
  }

  return (
    <div>
      home
      <Link to="RealTime">asdf</Link>
      <button onClick={() => (window.location.hash = '#/Picture')}>picture로 이동</button>
      <button onClick={sendMain}>ipc 테스트</button>
    </div>
  )
}
