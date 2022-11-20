import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Stompjs from '@stomp/stompjs'
import Sockjs from 'sockjs-client'
import { createServer } from 'net'

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

  const userStore = useSelector((state) => state.user)
  const modalState = useSelector((state) => state.util.modalState)
  const modalMsg = useSelector((state) => state.util.modalMsg)
  const userStoreRef = useRef({})
  const modalStateRef = useRef(null)
  const modalMsgRef = useRef('')

  const [client, setClient] = useState(undefined)
  const [state, setState] = useState(0)
  const stateRef = useRef(0)
  const routineStateRef = useRef(0)
  const isSleepMode = useRef(false)

  const components = [
    <Home />,
    <Picture setState={setState} />,
    <RealTime client={client} setState={setState} />,
    <Routine setState={setState} routineStateRef={routineStateRef} />,
  ]

  useEffect(() => {
    getUserInfos()
    const getInfoInterval = setInterval(getUserInfos, 600000)
    return () => {
      clearInterval(getInfoInterval)
    }
  }, [])

  useEffect(() => {
    userStoreRef.current = userStore
  }, [userStore])

  useEffect(() => {
    modalStateRef.current = modalState
  }, [modalState])

  useEffect(() => {
    modalMsgRef.current = modalMsg
  }, [modalMsg])

  useEffect(() => {
    stateRef.current = state
  }, [state])

  // 개발용
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
    return () => {
      window.removeEventListener(eventListener)
    }
  }, [])

  ////////////////////////////////////////////////////webSocket(stomp) 통신//////////////////////////////////////////////////////////////

  useEffect(() => {
    const stompClient = new Stompjs.Client({})
    stompClient.webSocketFactory = () => new Sockjs('https://k7a306.p.ssafy.io/api/socket')

    let knockCount = 0 // 연속 노크 수
    let knockStart = false // 노크 명령 작동됨
    let voiceStarted = false // 첫번째 단어 거르기

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
          if (isSleepMode.current) {
            sendMain('WAKE', 'wake')
            setTimeout(() => {
              isSleepMode.current = false
            }, 3000)
          } else if (knockCount < 3) {
            knockCount++
            setTimeout(() => {
              if (knockCount > 0) {
                knockCount--
              }
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
            }, 1500)
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
          } else if (content.data === 'end' && modalStateRef.current) {
            if (stateRef.current !== 3 || routineStateRef.current !== 0) {
              dispatch(setVoiceMsg('음성인식이 종료됩니다.'))
              setTimeout(() => {
                dispatch(setModalState(false))
              }, 1000)
            }
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
              dispatch(setRoutineDetail(-1))
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
              stompClient.publish({
                destination: `/pub/streaming`,
                body: JSON.stringify({
                  from: userStoreRef.current.username,
                  to: userStoreRef.current.username,
                  type: 'END',
                  url: userStoreRef.current.userInfo.url,
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

  const sendMain = (event, data) => {
    ipcRenderer.send(event, data)
  }

  useEffect(() => {
    ipcRenderer.on('WALK', () => {
      isSleepMode.current = false
    })
    ipcRenderer.on('SLEEP', () => {
      isSleepMode.current = true
    })
  }, [])

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // const ip = '70.12.246.21' //ssafy1102
    // const ip = '70.12.229.98' //guest
    // const ip = '192.168.159.137' //phone
    const ip = '192.168.159.45'
    const port = 2121
    let sockets = []

    const broadcast = (message, socketSent) => {
      if (message === 'quit') {
        const index = sockets.indexOf(socketSent)
        console.log('delete : ' + index)
        sockets.splice(index, 1)
      } else {
        sockets.forEach((socket) => {
          if (socket !== socketSent) socket.write(message)
        })
      }
    }

    let server = createServer((socket) => {
      socket.setEncoding('utf8')
      sockets.push(socket)
      console.log(socket.address().address + '연결되었습니다.')

      socket.on('data', (data) => {
        broadcast(data, socket)
      })
      socket.on('close', function () {
        broadcast('quit', socket)
        console.log('client disconnted.')
      })
    })
    server.on('error', function (err) {
      console.log('err: ', err.code)
    })
    server.listen(port, ip, function () {
      console.log(`listening on ${port}..`)
    })

    return () => {
      server.close()
    }
  }, [])

  ///////////////////////////////////////////////////////////////////////////////

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

  return <div className="layout">{components[state]}</div>
}
