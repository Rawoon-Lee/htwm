import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import RoutineList from './routineList'
import ShowRoutine from './ShowRoutine'
import StartRoutine from './startRoutine'
import RoutineResult from './routineResult'

export default function Routine() {
  const [state, setState] = useState(0)

  const components = [
    <RoutineList setState={setState} />,
    <ShowRoutine setState={setState} />,
    <StartRoutine setState={setState} />,
    <RoutineResult setState={setState} />,
  ]

  return (
    <div>
      routine
      {components[state]}
    </div>
  )
}
