import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'

import Profile from '../../components/profile'

import { UUID } from '../../store/constants'

import './RealTime.css'

export default function RealTime(props) {
  const username = useSelector((state) => state.user.username)
  const userInfo = useSelector((state) => state.user.userInfo)
  const streamingPeer = useSelector((state) => state.user.streamingPeer)

  const [isMuted, setIsMuted] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [endOpacity, setEndopacity] = useState(true)
  const [timeView, setTimeView] = useState('')

  const peerVideoRef = useRef(null)
  const timeRef = useRef(0)

  let myStream
  let myPeerConnection
  const client = props.client
  const setState = props.setState

  useEffect(() => {
    if (client) {
      client.send(
        `/pub/streaming`,
        {},
        JSON.stringify({
          from: username,
          to: streamingPeer.username,
          type: 'ENTER',
          url: userInfo.url,
        }),
      )
      client.subscribe(
        `/sub/${UUID}`,
        (action) => {
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
          if (content.type === 'END') {
            peerVideoRef.current.srcObject = data.stream
            setIsStarted(false)
            setIsEnded(true)
            setTimeout(() => {
              setState(0)
            }, 3000)
          }
        },
        {},
      )
    }
  }, [])

  useEffect(() => {
    makePeerConnection()
    getMedia()
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

  let interval
  useEffect(() => {
    if (isStarted) {
      interval = setInterval(() => {
        timeRef.current++
        const min = String(Math.floor(timeRef.current / 60)).padStart(2, '0')
        const sec = String(Math.floor(timeRef.current % 60)).padStart(2, '0')
        setTimeView(min + ':' + sec)
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isStarted])

  useEffect(() => {
    if (isEnded) {
      clearInterval(isEnded)
      setTimeout(() => {
        setEndopacity(!endOpacity)
      }, 700)
    }
  }, [isEnded, endOpacity])

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
          to: streamingPeer.username,
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
        to: streamingPeer.username,
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
        to: streamingPeer.username,
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
    <div className="realtime">
      <div className="realtime-video">
        <video ref={peerVideoRef} height="300" width="400" autoPlay={true} playsInline={true} />
        <div className="realtime-video-profile" style={{ opacity: isStarted ? 1 : 0 }}>
          <Profile nickname={streamingPeer.nickname} url={streamingPeer.url} />
        </div>
      </div>
      <div className="realtime-calling">
        {!isStarted && !isEnded ? (
          <div>{streamingPeer.nickname}에게 전화를 거는 중입니다.</div>
        ) : (
          <div style={{ opacity: endOpacity ? 1 : 0 }}>
            {timeView}
            {isEnded && (
              <>
                <br />
                통화가 종료되었습니다.
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
