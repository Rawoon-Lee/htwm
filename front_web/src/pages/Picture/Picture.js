import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { picture } from '../../actions/api/api'
import axios from 'axios'

export default function Picture(props) {
  const username = useSelector((state) => state.user.username)

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

  const capture = () => {
    canvasRef.current
      .getContext('2d')
      .drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

    let imageUrl = canvasRef.current.toDataURL('image/jpeg')
    console.log(imageUrl)
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
        // 사진찍혔다는 모달 띄우고 메인페이지로
        setTimeout(() => {
          setState(0)
        }, 3000)
        console.log(result)
      })
      .catch((error) => console.log(error))
  }

  return (
    <div>
      <video ref={videoRef} height="300" width="400" autoPlay={true} playsInline={true} />
      <canvas ref={canvasRef} height="300" width="400" />
      <button onClick={capture}>캡처</button>
    </div>
  )
}
