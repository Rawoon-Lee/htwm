import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { routine } from '../../actions/api/api'
import { setRoutineDetail } from '../../store/modules/util'

export default function StartRoutine(props) {
  const dispatch = useDispatch()
  const username = useSelector((state) => state.user.username)
  const routineDetail = useSelector((state) => state.util.routineDetail)
  const [viewTime, setViewTime] = useState(0)
  const time = useRef(0)

  useEffect(() => {
    return () => {
      // 루틴 끝낸 결과 보내기
      dispatch(setRoutineDetail({}))
    }
  }, [])

  useEffect(() => {
    setViewTime(0)
    const interval = setInterval(() => {
      time.current = time.current + 1
      setViewTime(time.current)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return <div>routine{viewTime}</div>
}
