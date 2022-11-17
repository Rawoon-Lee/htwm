import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Stompjs from '@stomp/stompjs'
import Sockjs from 'sockjs-client'

import Home from '../pages/Home/Home'
import Picture from '../pages/Picture/Picture'
import RealTime from '../pages/RealTime/RealTime'
import Routine from '../pages/Routine/Routine'

import { user } from '../actions/api/api'
import { setStreamingPeer, setUserInfo, setUsername } from '../store/modules/user'
import { setRoutineDetail } from '../store/modules/routine'
import { setModalMsg, setModalState } from '../store/modules/util'
import { UUID } from '../store/constants'

import './mainLayout.css'

export default function mainLayout() {
  const dispatch = useDispatch()
  const { ipcRenderer } = window.require('electron')

  const routineList = useSelector((state) => state.routine.routineList)
  const userStore = useSelector((state) => state.user)
  const modalState = useSelector((state) => state.util.modalState)

  const [client, setClient] = useState(undefined)
  const [state, setState] = useState(0)

  const components = [
    <Home />,
    <Picture setState={setState} />,
    <RealTime client={client} setState={setState} />,
    <Routine setState={setState} />,
  ]

  useEffect(() => {
    getUserInfos()
    const getInfoInterval = setInterval(getUserInfos, 600000)
    return () => {
      clearInterval(getInfoInterval)
    }
  }, [])

  useEffect(() => {
    const eventListener = window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case '1':
          setState(0)
          break
        case '2':
          setState(1)
          break
        case '3':
          setState(2)
          break
        case '4':
          setState(3)
          break
      }
    })
  }, [])

  ////////////////////////////////////////////////////webSocket(stomp) 통신//////////////////////////////////////////////////////////////

  useEffect(() => {
    const stompClient = new Stompjs.Client({})
    stompClient.webSocketFactory = () => new Sockjs('https://k7a306.p.ssafy.io/api/socket')

    stompClient.onConnect = () => {
      stompClient.subscribe(`/sub/${UUID}`, (action) => {
        const content = JSON.parse(action.body)
        console.log(content)
        if (content.type === 'ENTER') {
          // 통화 시작
          const peerInfo = { username: content.from, url: content.url, nickname: content.nickname }
          dispatch(setStreamingPeer(peerInfo))
          setState(2)
        } else if (content.type === 'END') {
          // 통화를 종료
        } else if (content.type === 'knock' && state === 0) {
          dispatch(setModalMsg('사진 화면으로 넘어갑니다'))
          dispatch(setModalState(true))
          setTimeout(() => {
            setState(1)
            dispatch(setModalState(false))
          }, 2000)
        } else if (content.type === 'speech') {
          // start 면 모달 띄우기
          // end 면 모달 내리기
          // again 이면 다시 말해주세요
          if (content.data === 'end' && modalState) {
            dispatch(setModalState(false))
          }
        } else if (content.type === 'order') {
          // 운동 시작해줘
          // setState(3)
          //
          if (state === 0 && content.data === '운동') {
            dispatch(setModalMsg('운동 화면으로 넘어갑니다'))
            dispatch(setModalState(true))
            setTimeout(() => {
              setState(1)
              dispatch(setModalState(false))
            }, 2000)
          } else if (state === 3 && content.data.search('번 루틴')) {
            const idx = Number(content.data.split('번')[0])
            dispatch(setRoutineDetail(routineList[idx - 1]))
            // 운동 시작
          } else if (state === 3 && content.data === '루틴 종료') {
            // 루틴 종료
          } else if (state === 0 && content.data === '사진') {
            dispatch(setModalMsg('사진 화면으로 넘어갑니다'))
            dispatch(setModalState(true))
            setTimeout(() => {
              setState(1)
              dispatch(setModalState(false))
            }, 2000)
          } else if (state === 2 && content.data === '종료') {
            client.publish({
              destination: `/pub/streaming`,
              body: JSON.stringify({
                from: userStore.username,
                to: userStore.username,
                type: 'END',
                url: userStore.userInfo.url,
              }),
            })
          }
        }
      })
    }
    stompClient.activate()
    setClient(stompClient)

    return () => {
      if (stompClient) {
        stompClient.disconnect()
      }
    }
  }, [])

  ////////////////////////////////////////////////////IPC 통신//////////////////////////////////////////////////////////////

  useEffect(() => {
    ipcRenderer.on('send_test', getMsg)
    return () => {
      ipcRenderer.removeListener('send_test', getMsg)
    }
  }, [])

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

  const getMsg = (event, arg) => {
    console.log(event, arg)
  }

  const sendMain = () => {
    ipcRenderer.send('send_test', 'hello')
  }

  return <div className="layout">{components[state]}</div>
}
