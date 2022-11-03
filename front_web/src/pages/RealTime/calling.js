import { useSelector } from 'react-redux'

export default function Calling() {
  const streamingPeer = useSelector((state) => state.user.streamingPeer)

  return <div>{streamingPeer}에게 전화를 거는 중입니다.</div>
}
