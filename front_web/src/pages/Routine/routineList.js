import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { routine } from '../../actions/api/api'
import { setRoutineDetail, setRoutineList } from '../../store/modules/routine'

import './routineList.css'

export default function RoutineList(props) {
  const setRoutineState = props.setRoutineState
  const dispatch = useDispatch()
  const username = useSelector((state) => state.user.username)
  const routineList = useSelector((state) => state.routine.routineList)

  useEffect(() => {
    routine.getRoutine({ username }).then((result) => {
      dispatch(setRoutineList(result.data))
    })
  }, [])

  const selectRoutine = (idx) => {
    let routineDetail = {}
    routineDetail.name = routineList[idx].name
    routineDetail.username = routineList[idx].username
    routineDetail.sets = []

    routineList[idx].sets.map((set) => {
      if (set.set_cnt !== 0) {
        for (let i = 0; i < set.set_cnt; i++) {
          routineDetail.sets.push(set)
        }
      } else {
        routineDetail.sets.push(set)
      }
    })
    dispatch(setRoutineDetail(routineDetail))
    setRoutineState(1)
  }

  return (
    <div className="routine-list">
      {routineList?.length &&
        routineList.map((routine, idx) => (
          <div className="routine-list-box" key={routine.name} onClick={() => selectRoutine(idx)}>
            <div className="routine-list-title">
              {idx + 1}번: {routine.name}
            </div>
            <div className="routine-list-content">
              {routine.sets?.length &&
                routine.sets.map((set, idx) => (
                  <span key={idx}>
                    {set.exercise_name}
                    {set.set_cnt > 1 ? `(${set.set_cnt})` : ''} {idx !== routine.sets.length - 1 ? '- ' : ''}
                  </span>
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}
