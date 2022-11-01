import { useState } from 'react'

import RoutineList from './routineList'
import ShowRoutine from './showRoutine'
import StartRoutine from './startRoutine'
import RoutineResult from './routineResult'

export default function Routine(props) {
  const setState = props.setState
  const [routineState, setRoutineState] = useState(0)

  const components = [
    <RoutineList setRoutineState={setRoutineState} />,
    <ShowRoutine setRoutineState={setRoutineState} />,
    <StartRoutine setRoutineState={setRoutineState} />,
    <RoutineResult setState={setState} />,
  ]

  // 운동 중단 요청오면 setState 변경

  return (
    <div>
      routine
      {components[routineState]}
    </div>
  )
}
