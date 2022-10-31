import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { routine } from '../../actions/api/api'
import { setRoutineDetail, setRoutineList } from '../../store/modules/util'

export default function RoutineList(props) {
  const setRoutineState = props.setRoutineState
  const dispatch = useDispatch()
  const username = useSelector((state) => state.user.username)
  const routineList = useSelector((state) => state.util.routineList)

  useEffect(() => {
    routine.getRoutine({ username }).then((result) => {
      dispatch(setRoutineList(result.data))
      console.log(result.data)
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
    console.log(routineDetail)
    dispatch(setRoutineDetail(routineDetail))
    setRoutineState(1)
  }

  return (
    <div>
      {routineList?.length &&
        routineList.map((routine, idx) => (
          <div key={routine.name} onClick={() => selectRoutine(idx)}>
            <div>
              {idx + 1}번: {routine.name}
              <div>
                {routine.sets?.length && routine.sets.map((set, idx) => <span key={idx}>{set.exercise_name} </span>)}
              </div>
            </div>
            <br />
          </div>
        ))}
    </div>
  )
}
