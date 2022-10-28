import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as Stomp from '@stomp/stompjs'
import Sockjs from 'sockjs-client'

import user from './../actions/api/user'
import { setStreamingPeer, setUsername } from '../store/modules/user'
import { UUID } from '../store/constants'

import RealTime from '../pages/RealTime/RealTime'

export default function Layout(props) {
  const dispatch = useDispatch()
  const [client, setClient] = useState(undefined)
  const [showRealTime, setShowRealTime] = useState(false)

  useEffect(() => {
    user
      .uuid()
      .then((result) => {
        console.log(result.data)
        dispatch(setUsername(result.data))
      })
      .catch((error) => console.log(error))

    const stompClient = new Stomp.Client({
      logRawCommunication: false,
    })
    stompClient.webSocketFactory = () => new Sockjs(`https://k7a306.p.ssafy.io/api/socket`)
    stompClient.onConnect = () => {
      stompClient.subscribe(`/sub/${UUID}`, (action) => {
        const content = JSON.parse(action.body)
        console.log('받음', content)
        if (content.type === 'ENTER') {
          // 통화 시작해야함을 알림
          dispatch(setStreamingPeer(content.from))
        }
      })
    }
    stompClient.activate()
    setClient(stompClient)

    return () => {
      if (stompClient) {
        stompClient.deactivate()
      }
    }
  }, [])

  // STT

  // 전화 오면 알림 띄우기

  return (
    <div>
      This is Layout
      {/* <Link to="RealTime">RealTime</Link> */}
      {/* <button onClick={() => (window.location.hash = '#/')}>home으로 이동</button>
      <button onClick={() => (window.location.hash = '#/RealTime')}>realTime으로 이동</button>
      <button onClick={() => (window.location.hash = '#/Picture')}>picture로 이동</button>
      <button onClick={() => (window.location.hash = '#/Routine')}>routine으로 이동</button> */}
      {/* {props.children} */}
      <button onClick={() => setShowRealTime(!showRealTime)}>showToggle</button>
      {showRealTime && <RealTime client={client} />}
    </div>
  )
}
