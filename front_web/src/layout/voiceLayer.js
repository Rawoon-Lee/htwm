import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as Stomp from '@stomp/stompjs'
import Sockjs from 'sockjs-client'

import { setClient } from '../store/modules/util'

export default function Layout(props) {
  const client = useSelector((state) => state.util.client)

  useEffect(() => {
    const stompClient = new Stomp.Client()
    stompClient.webSocketFactory = () => new Sockjs('https://')
    setClient(stompClient)
  }, [])

  useEffect(() => {
    if (!client) return
    // type1, type2 듣기

    return () => {
      if (client) {
        client.deactivate()
      }
    }
  }, [client])

  // STT

  // 전화 오면 알림 띄우기

  return <div>This is Layout{props.children}</div>
}
