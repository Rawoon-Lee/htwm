import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { routine } from '../../actions/api/api'
import { setRoutineList } from '../../store/modules/util'

export default function RoutineList() {
  const dispatch = useDispatch()
  const username = useSelector((state) => state.user.username)
  const routineList = useSelector((state) => state.util.routineList)

  useEffect(() => {
    routine.getRoutine({ username }).then((result) => {
      dispatch(setRoutineList(result.data))
      console.log(result.data)
    })
  }, [])

  return (
    <div>
      {routineList.map((routine, idx) => (
        <div key={routine.name}>
          {idx + 1}번: {routine.name}
          <div>
            {routine.set.map((set) => (
              <div>{set.exercise_name}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
