import { useState, useEffect, useRef } from 'react'

export default function RealTime() {
  const myVideoRef = useRef(null)
  const peerVideoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)
  let myStream
  let myPeerConnection

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
        makeConnection()
      }
    } catch (error) {
      console.error(error)
    }
  }
  getMedia()

  const makeConnection = async () => {
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

    // 소켓으로 오퍼 보내기. 위의 offer와 다른거임
    let offer2
    myPeerConnection.setRemoteDescription(offer2)
    const answer = await myPeerConnection.createAnswer()
    // 소켓으로 answer 보내기

    let answer2
    myPeerConnection.setRemoteDescription(answer2)
    // ice candidate
    myPeerConnection.addEventListener('icecandidate', handleIce)

    // addstream
    myPeerConnection.addEventListener('addStream', handleAddStream)
  }

  const handleIce = (data) => {
    // 소켓으로 iceCandidate (data.candidate) 보내기. 받으면 addIceCandidate하기
    let ice
    myPeerConnection.addIceCandidate(ice)
  }

  const handleAddStream = (data) => {
    peerVideoRef.current.srcObject = data.stream
  }

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

  return (
    <div>
      RealTime
      <video ref={myVideoRef} height="400" width="400" autoPlay={true} playsInline={true} />
      <video ref={peerVideoRef} height="400" width="400" autoPlay={true} playsInline={true} />
    </div>
  )
}
