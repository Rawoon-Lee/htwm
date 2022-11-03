import { useEffect, useRef } from 'react'
import { picture } from '../../actions/api/api'

export default function Picture() {
  const myVideoRef = useRef(null)

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
      if (myVideoRef && myVideoRef.current && !myVideoRef.current.srcObject) {
        myVideoRef.current.srcObject = myStream
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      Picture
      <video ref={myVideoRef} height="400" width="400" autoPlay={true} playsInline={true} />
    </div>
  )
}
