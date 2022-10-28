import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import * as Stomp from '@stomp/stompjs'
import Sockjs from 'sockjs-client'

import { UUID } from '../../store/constants'

export default function RealTime(props) {
  const username = useSelector((state) => state.user.username)
  const streamingPeer = useSelector((state) => state.user.streamingPeer)

  // const [client, setClient] = useState(undefined)
  const [isMuted, setIsMuted] = useState(false)

  const myVideoRef = useRef(null)
  const peerVideoRef = useRef(null)

  let myStream
  let myPeerConnection
  let client = props.client

  useEffect(() => {
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
    myPeerConnection.addEventListener('icecandidate', (data) => {
      client.publish({
        destination: `/pub/streaming`,
        body: JSON.stringify({
          from: username,
          to: streamingPeer,
          type: 3,
          data: data.candidate,
        }),
      })
    })
    myPeerConnection.addEventListener('addstream', (data) => {
      console.log('add stream', data)
      if (peerVideoRef && peerVideoRef.current) {
        peerVideoRef.current.srcObject = data.stream
        // const test = document.createElement('video')
        // test.setAttribute('autoPlay', true)
        // test.setAttribute('playsInLine', true)
        // test.setAttribute('srcObject', data.stream)
        // const div1 = document.querySelector('div')
        // div1.appendChild(test)
      }
    })

    if (client) {
      client.subscribe(`/sub/${UUID}`, (action) => {
        const content = JSON.parse(action.body)
        console.log('받음', content)
        if (content.type === 1) {
          getOfferMakeAnswer(content.data)
        }
        if (content.type === 2) {
          getAnswer(content.data)
        }
        if (content.type === 3) {
          getIce(content.data)
        }
      })
    }
  }, [])

  useEffect(() => {
    if (client) {
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
        // audio: true,
        video: true,
      })
      if (myVideoRef && myVideoRef.current && !myVideoRef.current.srcObject) {
        myVideoRef.current.srcObject = myStream
        await makeOffer()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const makeOffer = async () => {
    myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream))
    const offer = await myPeerConnection.createOffer()
    myPeerConnection.setLocalDescription(offer)

    client.publish({
      destination: `/pub/streaming`,
      body: JSON.stringify({
        from: username,
        to: streamingPeer,
        type: 1,
        data: offer,
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
        type: 2,
        data: answer,
      }),
    })
  }

  const getAnswer = async (answer) => {
    await myPeerConnection.setRemoteDescription(answer)
  }

  const getIce = async (ice) => {
    myPeerConnection.addIceCandidate(ice)
  }

  return (
    <div>
      RealTime
      <video ref={myVideoRef} height="400" width="400" autoPlay={true} playsInline={true} />
      <video ref={peerVideoRef} height="400" width="400" autoPlay={true} playsInline={true} />
    </div>
  )
}
