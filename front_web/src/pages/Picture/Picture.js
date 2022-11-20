import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { picture } from '../../actions/api/api'
import html2canvas from 'html2canvas'

import './Picture.css'
import cameraSound from './../../assets/camera.mp3'

export default function Picture(props) {
  const setState = props.setState

  const username = useSelector((state) => state.user.username)

  const [pictureMsg, setPictureMsg] = useState('')
  const [isEnd, setIsEnd] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  let myStream

  useEffect(() => {
    getMedia()
    startCapture()
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
    const interval = setInterval(() => {
      if (time > 0) {
        time--
        setPictureMsg(`${time}초 후 사진이 찍힙니다.`)
      } else {
        capture()
        clearInterval(interval)
      }
    }, 1000)
  }

  const capture = async () => {
    const sound = new Audio(cameraSound)
    sound.play()
    await html2canvas(document.querySelector('.picture-video')).then((canvas) => {
      setIsEnd(true)
      const resultDiv = document.querySelector('.picture-result')
      resultDiv.appendChild(canvas)
      canvasRef.current = canvas
    })
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
      <div className="picture-message">{pictureMsg}</div>
      {!isEnd && <video className="picture-video" ref={videoRef} autoPlay={true} playsInline={true} />}
      <div className="picture-result"></div>
    </div>
  )
}
