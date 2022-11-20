import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Profile from '../../components/profile'

import { UUID } from '../../store/constants'

import './RealTime.css'
import loading from './../../assets/loading.gif'
import { setModalMsg, setModalState } from '../../store/modules/util'

export default function RealTime(props) {
  const dispatch = useDispatch()

  const username = useSelector((state) => state.user.username)
  const userInfo = useSelector((state) => state.user.userInfo)
  const streamingPeer = useSelector((state) => state.user.streamingPeer)

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
    let isEnded = false
    if (client) {
      client.publish({
        destination: '/pub/streaming',
        body: JSON.stringify({
          from: username,
          to: streamingPeer.username,
          type: 'ENTER',
          url: userInfo.url,
        }),
      })
      client.subscribe(`/sub/${UUID}`, (action) => {
        const content = JSON.parse(action.body)
        if (content.type === 1 && content.data) {
          getOfferMakeAnswer(content.data)
        }
        if (content.type === 2 && content.data) {
          getAnswer(content.data)
        }
        if (content.type === 3 && content.data) {
          getIce(content.data)
        }
        if (content.type === 'END') {
          if (isEnded) return
          isEnded = true
          client.publish({
            destination: '/pub/streaming',
            body: JSON.stringify({
              from: username,
              to: streamingPeer.username,
              type: 'END',
              url: userInfo.url,
            }),
          })
          setIsStarted(false)
          setIsEnded(true)
          setTimeout(() => {
            setState(0)
          }, 3000)
        }
      })
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
    let interval
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
    let interval
    let cnt = 0
    if (!isStarted && !isEnded && client) {
      interval = setInterval(() => {
        if (cnt < 5) {
          cnt++
          client.publish({
            destination: '/pub/streaming',
            body: JSON.stringify({
              from: username,
              to: streamingPeer.username,
              type: 'ENTER',
              url: userInfo.url,
            }),
          })
        } else {
          dispatch(setModalMsg('연결에 실패하여 메인페이지로 돌아갑니다.'))
          dispatch(setModalState(true))
          setTimeout(() => {
            dispatch(setModalState(false))
            setState(0)
          }, 1000)
        }
      }, 5000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isStarted, isEnded, username, streamingPeer, userInfo])

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
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
    })
    myPeerConnection.addEventListener('icecandidate', (data) => {
      if (!data.candidate) return
      client.publish({
        destination: `/pub/streaming`,
        body: JSON.stringify({
          from: username,
          to: streamingPeer.username,
          type: 3,
          data: data.candidate,
        }),
      })
    })
    myPeerConnection.addEventListener('addstream', (data) => {
      if (peerVideoRef && peerVideoRef.current) {
        peerVideoRef.current.srcObject = data.stream
        setIsStarted(true)
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
    client.publish({
      destination: '/pub/streaming',
      body: JSON.stringify({
        from: username,
        to: streamingPeer.username,
        type: 1,
        data: offer,
      }),
    })
    myPeerConnection.setLocalDescription(offer)
  }

  const getOfferMakeAnswer = async (offer) => {
    myPeerConnection.setRemoteDescription(offer)
    const answer = await myPeerConnection.createAnswer()
    client.publish({
      destination: `/pub/streaming`,
      body: JSON.stringify({
        from: username,
        to: streamingPeer.username,
        type: 2,
        data: answer,
      }),
    })
    myPeerConnection.setLocalDescription(answer)
  }

  const getAnswer = (answer) => {
    myPeerConnection.setRemoteDescription(answer)
  }

  const getIce = (ice) => {
    myPeerConnection.addIceCandidate(ice)
  }

  return (
    <div className="realtime">
      <div className="realtime-video">
        <video ref={peerVideoRef} autoPlay={true} playsInline={true} />
        <div className="realtime-video-profile" style={{ opacity: isStarted ? 1 : 0 }}>
          <Profile nickname={streamingPeer.nickname} url={streamingPeer.url} />
        </div>
      </div>
      <div className="realtime-calling">
        {!isStarted && !isEnded ? (
          <div>
            통화를 연결하는 중입니다.
            <br />
            <img src={loading}></img>
          </div>
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
