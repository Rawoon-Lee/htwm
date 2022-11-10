import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import './showRoutine.css'

export default function ShowRoutine(props) {
  const setRoutineState = props.setRoutineState
  const routineDetail = useSelector((state) => state.routine.routineDetail)

  useEffect(() => {
    setTimeout(() => {
      setRoutineState(2)
    }, 5000)
  }, [])

  return (
    <div className="show-routine">
      <p className="show-routine-alert">잠시 후 운동이 시작됩니다.</p>
      {routineDetail?.sets.length &&
        routineDetail.sets.map((set, idx) => {
          if (set.exercise_name === '휴식') {
            return (
              <div className="show-routine-break" key={idx}>
                <div className="show-routine-name">휴식</div>
                <div className="show-routine-time">{set.sec} 초</div>
              </div>
            )
          } else {
            return (
              <div className="show-routine-exercise" key={idx}>
                <div className="show-routine-name">
                  {set.exercise_name} {set.number}회
                </div>
                <div className="show-routine-time">{set.sec} 초</div>
              </div>
            )
          }
        })}
    </div>
  )
}
