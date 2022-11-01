import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function RoutineResult(props) {
  const setState = props.setState
  const routineResult = useSelector((state) => state.routine.routineResult)

  useEffect(() => {
    if (typeof setState === 'function') {
      setTimeout(() => {
        setState(0)
      }, 5000)
    }
  }, [setState])

  return (
    <div>
      고생하셨습니다. 잠시 후 메인화면으로 복귀합니다.
      <div>
        시작시간: {routineResult.startDateTime} | 종료시간: {routineResult.endDateTime}
      </div>
      <div>진행률: {routineResult.doneSetNum}</div>
    </div>
  )
}
