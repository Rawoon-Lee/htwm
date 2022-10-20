import { useState, useEffect, useRef } from 'react'

export default function RealTime() {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)
  let myStream

  const getMedia = async () => {
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })
      if (videoRef && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = myStream
      }
    } catch (error) {
      console.error(error)
    }
  }
  getMedia()

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
      <video ref={videoRef} id="videoTag" height="400" width="400" autoPlay={true} playsInline={true} />
    </div>
  )
}
