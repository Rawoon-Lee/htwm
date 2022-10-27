import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as Stomp from '@stomp/stompjs'
import Sockjs from 'sockjs-client'

import user from './../actions/api/user'
import { setStreamingPeer, setUsername } from '../store/modules/user'
import { UUID } from '../store/constants'

export default function Layout(props) {
  const dispatch = useDispatch()

  let client

  useEffect(() => {
    user
      .uuid()
      .then((result) => {
        console.log(result.data)
        dispatch(setUsername(result.data))
      })
      .catch((error) => console.log(error))

    client = new Stomp.Client({
      logRawCommunication: false,
    })
    client.webSocketFactory = () => new Sockjs(`https://k7a306.p.ssafy.io/api/socket`)
    client.onConnect = () => {
      client.subscribe(`/sub/${UUID}`, (action) => {
        const content = JSON.parse(action.body)
        console.log('받음', content)
        if (content.type === 'ENTER') {
          // 통화 시작해야함을 알림
          dispatch(setStreamingPeer(content.from))
        }
      })
    }
    client.activate()

    return () => {
      if (client) {
        client.deactivate()
      }
    }
  }, [])

  // STT

  // 전화 오면 알림 띄우기

  return (
    <div>
      This is Layout
      {/* <Link to="RealTime">RealTime</Link> */}
      <button onClick={() => (window.location.hash = '#/')}>home으로 이동</button>
      <button onClick={() => (window.location.hash = '#/RealTime')}>realTime으로 이동</button>
      <button onClick={() => (window.location.hash = '#/Picture')}>picture로 이동</button>
      <button onClick={() => (window.location.hash = '#/Routine')}>routine으로 이동</button>
      {props.children}
    </div>
  )
}
