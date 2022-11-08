import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Stompjs from 'stompjs'
import Sockjs from 'sockjs-client'

import Home from '../pages/Home/Home'
import Picture from '../pages/Picture/Picture'
import RealTime from '../pages/RealTime/RealTime'
import Routine from '../pages/Routine/Routine'

import { user } from '../actions/api/api'
import { setStreamingPeer, setUserInfo, setUsername } from '../store/modules/user'
import { UUID, SEND_TEST } from '../store/constants'
import { setModalMsg, setModalState } from '../store/modules/util'

import './mainLayout.css'

export default function mainLayout() {
  const dispatch = useDispatch()
  const { ipcRenderer } = window.require('electron')

  const [client, setClient] = useState(undefined)
  const [state, setState] = useState(0)

  const components = [
    <Home />,
    <Picture setState={setState} />,
    <RealTime client={client} />,
    <Routine setState={setState} />,
  ]

  useEffect(() => {
    getUserInfos()
    const getInfoInterval = setInterval(getUserInfos, 600000)
    return () => {
      clearInterval(getInfoInterval)
    }
  }, [])

  ////////////////////////////////////////////////////webSocket 통신//////////////////////////////////////////////////////////////

  useEffect(() => {
    const socket = new Sockjs('https://k7a306.p.ssafy.io/api/socket')
    const stompClient = Stompjs.over(socket)

    stompClient.connect({}, () => {
      stompClient.subscribe(
        `/sub/${UUID}`,
        (action) => {
          const content = JSON.parse(action.body)
          if (content.type === 'ENTER') {
            // 통화 시작
            dispatch(setStreamingPeer(content.from))
            setState(2)
          }
          if (content.type === 'DENY') {
            // 상대가 거절함을 알리고 통화 종료
            dispatch(setModalMsg('상대가 통화를 거절했습니다.'))
            dispatch(setModalState(true))
            setState(0)
          }
          if (content.type === 'END') {
            // 통화 종료됨을 알리고 통화 종료
            dispatch(setModalMsg('통화가 종료되었습니다.'))
            dispatch(setModalState(true))
            setState(0)
          }
        },
        {},
      )
    })

    // stompClient.debug = null
    setClient(stompClient)

    return () => {
      if (stompClient) {
        stompClient.disconnect()
      }
    }
  }, [])

  // SLL에 따라 state 변경
  // 무슨 루틴을 진행 할 지

  const getUserInfos = () => {
    user
      .uuid()
      .then((uuidResult) => {
        console.log(uuidResult.data)
        localStorage.setItem('username', uuidResult.data)
        dispatch(setUsername(uuidResult.data))
        user.info({ username: uuidResult.data }).then((userInfoResult) => {
          console.log(userInfoResult.data)
          dispatch(setUserInfo(userInfoResult.data))
        })
      })
      .catch((error) => console.log(error))
  }

  ////////////////////////////////////////////////////IPC 통신//////////////////////////////////////////////////////////////

  useEffect(() => {
    ipcRenderer.on(SEND_TEST, getMsg)
    return () => {
      ipcRenderer.removeListener(SEND_TEST, getMsg)
    }
  }, [])

  const getMsg = (event, arg) => {
    console.log(event, arg, '받음')
  }

  const sendMain = () => {
    ipcRenderer.send(SEND_TEST, 'hello')
  }

  return (
    <div className="layout">
      <button onClick={() => setState(0)}>home</button>
      <button onClick={() => setState(1)}>picture</button>
      <button onClick={() => setState(2)}>realTime</button>
      <button onClick={() => setState(3)}>Routine</button>
      <button onClick={sendMain}>ipc 테스트</button>
      {components[state]}
    </div>
  )
}
