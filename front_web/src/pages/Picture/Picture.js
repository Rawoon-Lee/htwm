import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { picture } from '../../actions/api/api'

import './Picture.css'

export default function Picture(props) {
  const username = useSelector((state) => state.user.username)

  const [pictureMsg, setPictureMsg] = useState('')

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const setState = props.setState
  let myStream

  useEffect(() => {
    getMedia()
    return () => {
      if (myStream) {
        myStream.getTracks().map((stream) => stream.stop())
      }
    }
  }, [])

  const getMedia = async () => {
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      if (videoRef && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = myStream
      }
    } catch (error) {
      console.log(error)
    }
  }

  const startCapture = async () => {
    let time = 5
    setPictureMsg(`${time}초 후 사진이 찍힙니다.`)
    const interval = setInterval(() => {
      if (time > 1) {
        time--
        setPictureMsg(`${time}초 후 사진이 찍힙니다.`)
      } else {
        capture()
        clearInterval(interval)
      }
    }, 1000)
  }

  const capture = () => {
    canvasRef.current
      .getContext('2d')
      .drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

    let imageUrl = canvasRef.current.toDataURL('image/jpeg')
    submitPicture(imageUrl)
  }

  const submitPicture = async (imageUrl) => {
    const response = await fetch(imageUrl)
    const blobData = await response.blob()
    const metadata = {
      type: 'image/jpeg',
    }
    const date = new Date()
    const file = await new File([blobData], username + '_' + String(date.getTime()) + '.jpeg', metadata)

    let data = new FormData()
    data.append('image', file)
    data.append('username', username)

    picture
      .postPicture(data)
      .then((result) => {
        setPictureMsg('사진이 촬영되었습니다.')
        setTimeout(() => {
          setState(0)
        }, 3000)
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className="picture">
      <button onClick={startCapture}>캡처</button>
      <div className="picture-message">{pictureMsg}</div>
      <video ref={videoRef} height="300" width="400" autoPlay={true} playsInline={true} />
      <canvas className="picture-canvas" ref={canvasRef} height="300" width="400" />
    </div>
  )
}
