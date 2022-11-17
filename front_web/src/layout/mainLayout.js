import { useState, useEffect, useRef } from 'react'
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
import { setModalMsg, setModalState, setIsVoice, setVoiceMsg } from '../store/modules/util'
import { UUID } from '../store/constants'

import './mainLayout.css'

export default function mainLayout() {
  const dispatch = useDispatch()
  const { ipcRenderer } = window.require('electron')

  const routineList = useSelector((state) => state.routine.routineList)
  const userStore = useSelector((state) => state.user)
  const modalState = useSelector((state) => state.util.modalState)
  const modalStateRef = useRef(null)
  const stateRef = useRef(0)

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
    modalStateRef.current = modalState
  }, [modalState])

  useEffect(() => {
    stateRef.current = state
  }, [state])

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

    let knockCount = 0
    let knockStart = false
    let voiceStarted = false
    stompClient.onConnect = () => {
      stompClient.subscribe(`/sub/${UUID}`, (action) => {
        const content = JSON.parse(action.body)
        console.log(content)
        if (content.type === 'ENTER') {
          // 통화 시작
          const peerInfo = { username: content.from, url: content.url, nickname: content.nickname }
          dispatch(setStreamingPeer(peerInfo))
          setState(2)
        } else if (content.type === 'knock' && stateRef.current === 0) {
          // 노크
          if (knockCount < 8) {
            knockCount++
            setTimeout(() => {
              console.log('노크 리셋')
              knockCount = 0
            }, 5000)
          } else if (!knockStart) {
            knockStart = true
            dispatch(setModalMsg('사진 화면으로 넘어갑니다'))
            dispatch(setModalState(true))
            setTimeout(() => {
              if (stateRef.current === 0) {
                setState(1)
                dispatch(setModalState(false))
              }
              knockStart = false
            }, 1000)
          }
        } else if (content.type === 'speech') {
          // 스피치 제어
          if (content.data === 'start' && !modalStateRef.current) {
            dispatch(setVoiceMsg('원하시는걸 말해주세요!'))
            voiceStarted = true
            dispatch(setModalState(true))
            dispatch(setIsVoice(true))
          } else if (content.data === 'again' && modalStateRef.current) {
            dispatch(setVoiceMsg('다시 말해주세요!'))
          } else if (content.data === 'end') {
            dispatch(setVoiceMsg('음성인식이 종료됩니다.'))
            setTimeout(() => {
              if (modalStateRef.current) {
                dispatch(setModalState(false))
              }
            }, 1000)
          } else if (modalStateRef.current) {
            if (voiceStarted) {
              voiceStarted = false
            } else {
              dispatch(setModalMsg(content.data))
            }
          }
        } else if (content.type === 'order' && modalStateRef.current) {
          // 스피치 결과
          if (stateRef.current === 0 && content.data === '리스트') {
            dispatch(setVoiceMsg('운동 화면으로 넘어갑니다'))
            dispatch(setModalMsg(''))
            setTimeout(() => {
              dispatch(setVoiceMsg('$리스트'))
              setState(3)
            }, 1000)
          } else if (stateRef.current === 3 && content.data === '루틴 종료') {
            dispatch(setVoiceMsg('운동을 종료합니다.'))
            dispatch(setModalMsg(''))
            setTimeout(() => {
              dispatch(setRoutineDetail({}))
              dispatch(setModalState(false))
            }, 1000)
          } else if (stateRef.current === 0 && content.data === '사진') {
            dispatch(setVoiceMsg('사진 화면으로 넘어갑니다'))
            dispatch(setModalMsg(''))
            setTimeout(() => {
              setState(1)
              dispatch(setModalState(false))
            }, 1000)
          } else if (stateRef.current === 2 && content.data === '종료') {
            dispatch(setVoiceMsg('통화를 종료합니다.'))
            dispatch(setModalMsg(''))
            setTimeout(() => {
              client.publish({
                destination: `/pub/streaming`,
                body: JSON.stringify({
                  from: userStore.username,
                  to: userStore.username,
                  type: 'END',
                  url: userStore.userInfo.url,
                }),
              })
              dispatch(setModalState(false))
            }, 1000)
          } else if (stateRef.current === 3) {
            const idx = Number(content.data)
            dispatch(setVoiceMsg(`${idx}번 운동을 시작합니다.`))
            dispatch(setModalMsg(''))
            setTimeout(() => {
              dispatch(setRoutineDetail(idx - 1))
              dispatch(setModalState(false))
            }, 1000)
          } else {
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
