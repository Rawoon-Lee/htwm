import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import * as Stomp from '@stomp/stompjs'
import Sockjs from 'sockjs-client'

import { UUID } from '../../store/constants'

export default function RealTime() {
  const username = useSelector((state) => state.user.username)
  const streamingPeer = useSelector((state) => state.user.streamingPeer)

  const [client, setClient] = useState(undefined)
  const [isMuted, setIsMuted] = useState(false)

  const myVideoRef = useRef(null)
  const peerVideoRef = useRef(null)

  let myStream
  let myPeerConnection

  useEffect(() => {
    const stompClient = new Stomp.Client()
    stompClient.webSocketFactory = () => new Sockjs(`wss://k7a306.p.ssafy.io/api/socket`)
    stompClient.onConnect = () => {
      stompClient.publish({
        destination: `/pub/streaming`,
        body: JSON.stringify({
          from: username,
          to: streamingPeer,
          data: { type: 1, data: 'test' },
        }),
      })
      stompClient.subscribe(`/sub/${UUID}`, (action) => {
        const content = JSON.parse(action.body)
        console.log('받음', content)
        if (content.type === 'STREAMING') {
          if (content.data.type === 1) {
            getOfferMakeAnswer(content.data.data)
          }
          if (content.data.type === 2) {
            getAnswerMakeIce(content.data.data)
          }
          if (content.data.type === 3) {
            getIceMakeStream(content.data.data)
          }
        }
      })
    }
    stompClient.activate()
    setClient(stompClient)

    return () => {
      stompClient.deactivate()
    }
  }, [])

  useEffect(() => {
    if (client) {
      console.log(client)
      getMedia()
    }
  }, [client])

  useEffect(() => {
    if (isMuted) {
      if (!myStream) return
      myStream.getAudioTraks().forEach((track) => {
        track.enabled = false
      })
    } else {
      if (!myStream) return
      myStream.getAudioTraks().forEach((track) => {
        track.enabled = true
      })
    }
  }, [isMuted])

  /*
    0. 서버로부터 type1 받으면 해당 페이지로 이동하며 상대방에게 알려준다. 알림 받으면 상대도 해당 페이지로 이동한다.
    1. stream 내용 잡기
    2. RTCPeerConnection만들고 거기에 stream 내용 넣기.
    3. 만든 RTCPeerConnection으로 createOffer하고 offer를 다시 LocalDescription으로 넣는다.
    4. 소켓으로 상대방 offer 받으면 RemoteDescription으로 넣는다.
    5. offer 받은 쪽에선 LocalDescription으로 createAnswer 내용을 넣고 answer를 보낸다.
    6. answer를 받은 쪽에선 RemoteDescription으로 answer를 넣는다.
    7. icecandidate 이벤트가 발생하면 candidate를 보낸다. candidate 받으면 addIceCandidate한다
  */

  const getMedia = async () => {
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })
      if (myVideoRef && myVideoRef.current && !myVideoRef.current.srcObject) {
        myVideoRef.current.srcObject = myStream
        makeOffer()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const makeOffer = async () => {
    myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.con:19302',
            'stun:stun1.l.google.con:19302',
            'stun:stun2.l.google.con:19302',
            'stun:stun3.l.google.con:19302',
            'stun:stun4.l.google.con:19302',
          ],
        },
      ],
    })
    myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream))
    const offer = await myPeerConnection.createOffer()
    myPeerConnection.setLocalDescription(offer)
    client.publish({
      destination: `/pub/streaming`,
      body: JSON.stringify({
        from: username,
        to: streamingPeer,
        data: { type: 1, data: offer },
      }),
    })
  }

  const getOfferMakeAnswer = async (offer) => {
    myPeerConnection.setRemoteDescription(offer)
    const answer = await myPeerConnection.createAnswer()
    client.publish({
      destination: `/pub/streaming`,
      body: JSON.stringify({
        from: username,
        to: streamingPeer,
        data: { type: 2, data: answer },
      }),
    })
  }

  const getAnswerMakeIce = async (answer) => {
    myPeerConnection.setRemoteDescription(answer)
    myPeerConnection.addEventListener('icecandidate', (data) => {
      client.publish({
        destination: `/pub/streaming`,
        body: JSON.stringify({
          from: username,
          to: streamingPeer,
          data: { type: 3, data: data.candidate },
        }),
      })
    })
  }

  const getIceMakeStream = (ice) => {
    myPeerConnection.addIceCandidate(ice)
    myPeerConnection.addEventListener('addStream', (data) => {
      peerVideoRef.current.srcObject = data.stream
    })
  }

  return (
    <div>
      RealTime
      <video ref={myVideoRef} height="400" width="400" autoPlay={true} playsInline={true} />
      <video ref={peerVideoRef} height="400" width="400" autoPlay={true} playsInline={true} />
    </div>
  )
}
