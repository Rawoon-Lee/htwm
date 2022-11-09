import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import Calling from './calling'

import { UUID } from '../../store/constants'

export default function RealTime(props) {
  const username = useSelector((state) => state.user.username)
  const streamingPeer = useSelector((state) => state.user.streamingPeer)

  const [isMuted, setIsMuted] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  const peerVideoRef = useRef(null)

  let myStream
  let myPeerConnection
  let client = props.client

  useEffect(() => {
    // RTCPeerConnection 만들어두기
    makePeerConnection()
    // RTC 초기 연결을 위한 socket 설정
    if (client) {
      client.subscribe(
        `/sub/${UUID}`,
        function (action) {
          const content = JSON.parse(action.body)
          console.log('받음', content)
          if (!content.data) return
          if (content.type === 1) {
            getOfferMakeAnswer(content.data)
          }
          if (content.type === 2) {
            getAnswer(content.data)
          }
          if (content.type === 3) {
            getIce(content.data)
          }
        },
        {},
      )
      getMedia()
    }
    return () => {
      if (myStream) {
        myStream.getTracks().map((stream) => stream.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (!myStream) return
    if (isMuted) {
      myStream.getAudioTraks().forEach((track) => {
        track.enabled = false
      })
    } else {
      myStream.getAudioTraks().forEach((track) => {
        track.enabled = true
      })
    }
  }, [isMuted])

  const makePeerConnection = () => {
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
      if (!data.candidate) return
      client.send(
        `/pub/streaming`,
        {},
        JSON.stringify({
          from: username,
          to: streamingPeer,
          type: 3,
          data: data.candidate,
        }),
      )
    })
    myPeerConnection.addEventListener('addstream', (data) => {
      if (peerVideoRef && peerVideoRef.current) {
        setIsStarted(true)
        peerVideoRef.current.srcObject = data.stream
      }
    })
  }

  const getMedia = async () => {
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      makeOffer()
    } catch (error) {
      console.log(error)
    }
  }

  const makeOffer = async () => {
    myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream))
    const offer = await myPeerConnection.createOffer()
    myPeerConnection.setLocalDescription(offer)

    client.send(
      `/pub/streaming`,
      {},
      JSON.stringify({
        from: username,
        to: streamingPeer,
        type: 1,
        data: offer,
      }),
    )
  }

  const getOfferMakeAnswer = async (offer) => {
    myPeerConnection.setRemoteDescription(offer)
    const answer = await myPeerConnection.createAnswer()
    myPeerConnection.setLocalDescription(answer)
    client.send(
      `/pub/streaming`,
      {},
      JSON.stringify({
        from: username,
        to: streamingPeer,
        type: 2,
        data: answer,
      }),
    )
  }

  const getAnswer = async (answer) => {
    await myPeerConnection.setRemoteDescription(answer)
  }

  const getIce = async (ice) => {
    await myPeerConnection.addIceCandidate(ice)
  }

  return (
    <div>
      <video ref={peerVideoRef} height="300" width="400" autoPlay={true} playsInline={true} />
      <div style={{ visibility: isStarted ? 'hidden' : 'visible' }}>
        <Calling />
      </div>
    </div>
  )
}
