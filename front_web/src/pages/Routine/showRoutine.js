import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function ShowRoutine(props) {
  const setRoutineState = props.setRoutineState
  const routineDetail = useSelector((state) => state.routine.routineDetail)

  useEffect(() => {
    setTimeout(() => {
      setRoutineState(2)
    }, 5000)
  }, [])

  return (
    <div>
      <p>잠시 후 운동이 시작됩니다.</p>
      {routineDetail?.sets.length &&
        routineDetail.sets.map((set, idx) => {
          if (set.exercise_name === '휴식 시간') {
            return <div key={idx}>휴식시간 {set.sec}초</div>
          } else {
            return (
              <div key={idx}>
                {set.exercise_name} {set.number}회 {set.sec}초
              </div>
            )
          }
        })}
    </div>
  )
}
