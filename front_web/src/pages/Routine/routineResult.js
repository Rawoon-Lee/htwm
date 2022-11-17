import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setRoutineResult } from '../../store/modules/routine'

import './routineResult.css'

export default function RoutineResult(props) {
  const dispatch = useDispatch()

  const setState = props.setState
  const routineResult = useSelector((state) => state.routine.routineResult)

  useEffect(() => {
    if (typeof setState === 'function') {
      setTimeout(() => {
        dispatch(setRoutineResult({}))
        setState(0)
      }, 5000)
    }
  }, [setState])

  return (
    <div className="result">
      <div className="result-alert">
        고생하셨습니다.
        <br />
        잠시 후<br />
        메인화면으로 복귀합니다.
      </div>
      <div className="result-time">
        시작시간: {routineResult.startDateTime?.slice(11, 19)}
        <br />
        종료시간: {routineResult.endDateTime?.slice(11, 19)}
      </div>
      <div className="result-progress">진행률: {routineResult.doneSetNum}%</div>
    </div>
  )
}
