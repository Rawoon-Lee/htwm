import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { routine } from '../../actions/api/api'
import { setRoutineDetail, setRoutineList } from '../../store/modules/routine'
import { setModalState } from '../../store/modules/util'

import './routineList.css'

export default function RoutineList(props) {
  const setRoutineState = props.setRoutineState

  const dispatch = useDispatch()
  const username = useSelector((state) => state.user.username)
  const routineList = useSelector((state) => state.routine.routineList)
  const routineDetail = useSelector((state) => state.routine.routineDetail)

  useEffect(() => {
    routine.getRoutine({ username }).then((result) => {
      console.log(result.data)
      dispatch(setRoutineList(result.data))
    })
  }, [])

  useEffect(() => {
    return () => {
      dispatch(setModalState(false))
    }
  }, [])

  useEffect(() => {
    if (routineDetail.name) {
      setRoutineState(1)
    }
  }, [routineDetail])

  const selectRoutine = (idx) => {
    dispatch(setRoutineDetail(idx))
  }

  return (
    <div className="routine-list">
      {routineList?.length &&
        routineList.map((routine, idx) => (
          <div
            className="routine-list-box"
            key={routine.name}
            onClick={() => selectRoutine(idx)}
            style={{
              maxHeight: `${80 / routineList.length}vh`,
              borderLeft: `2vw solid ${routine.color[0] === '#' ? routine.color : 'white'}`,
            }}
          >
            <div className="routine-list-title" style={{ fontSize: `min(8vw, ${40 / routineList.length}vw)` }}>
              {idx + 1}번: {routine.name}
            </div>
            <div className="routine-list-content" style={{ fontSize: `min(${15 / routine.sets.length}vw, 5vw)` }}>
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
