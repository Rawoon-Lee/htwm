import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { picture } from '../../actions/api/api'

export default function Picture() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const username = useSelector((state) => state.user.username)

  let myStream

  // useEffect 콜백함수를 getMedia로 직접쓰면 const의 TDZ로 불러와지지 않는다.(표현식이 useEffect보다 먼저 와야한다)
  // 하지만 이상하게 () => {} 안에 정의 할 경우 에러가 뜨지 않는다.
  // 콜백함수가 비동기로 작동하면서 그 순간 getMedia가 초기화 되어 문제가 없나?
  useEffect(() => {
    getMedia()
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
    let imageBlob
    const urlMine = imageUrl.split(',')[0].split(':')[1].split(';')[0]
    if (imageUrl.split(',')[0].indexOf('base64') >= 0) {
      imageBlob = atob(imageUrl.split(',')[1])
    } else {
      imageBlob = unescape(imageUrl.split(',')[1])
    }
    console.log('urlMine', urlMine)

    const blobArray = []
    for (let idx = 0; idx < imageBlob.length; idx++) {
      blobArray.push(imageBlob.charCodeAt(idx))
    }

    const imageFile = await new Blob([blobArray], {
      type: urlMine,
    })
    console.log('imageFile', imageFile)
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('username', username)

    picture.postPicture(formData).then((result) => console.log(result))
  }

  return (
    <div>
      Picture
      <video ref={videoRef} height="400" width="400" autoPlay={true} playsInline={true} />
      <canvas ref={canvasRef} height="400" width="400" />
      <button onClick={capture}>캡처</button>
    </div>
  )
}
