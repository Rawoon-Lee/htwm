import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { connect } from 'net'

import './showRoutine.css'

export default function ShowRoutine(props) {
  const setRoutineState = props.setRoutineState
  const routineDetail = useSelector((state) => state.routine.routineDetail)

  useEffect(() => {
    setTimeout(() => {
      setRoutineState(2)
    }, 16000)
  }, [])

  useEffect(() => {
    const socket = connect({
      port: 2121,
      // host: '70.12.246.21', //ssafy1102
      // host: '70.12.229.98', //guest
      // host: '192.168.159.137', //phone
      host: '192.168.159.45',
    })

    socket.setEncoding('utf8')

    socket.on('connect', function () {
      socket.write(
        JSON.stringify({
          current_id: '1',
          flag: 'end',
          next_id: `${routineDetail.sets[1].exercise_id}`,
        }),
      )
    })
    socket.on('close', function () {
      console.log('close : show')
    })
    socket.on('error', function (err) {
      console.log('on error: ', err.code)
    })

    return () => {
      socket.destroy()
    }
  }, [])

  return (
    <div className="show-routine">
      <p className="show-routine-alert">잠시 후 운동이 시작됩니다.</p>
      {routineDetail?.sets.length &&
        routineDetail.sets.map((set, idx) => {
          if (set.exercise_name === '휴식') {
            return (
              <div
                className="show-routine-break"
                key={idx}
                style={{
                  padding: `${10 / routineDetail.sets?.length}vh`,
                  fontSize: `${Math.min(50 / routineDetail.sets?.length, 5)}vw`,
                }}
              >
                <div className="show-routine-name">휴식</div>
                <div className="show-routine-time">{set.sec} 초</div>
              </div>
            )
          } else {
            return (
              <div
                className="show-routine-exercise"
                key={idx}
                style={{
                  padding: `${10 / routineDetail.sets?.length}vh`,
                  fontSize: `${Math.min(50 / set.exercise_name.length, 5)}vw`,
                }}
              >
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
