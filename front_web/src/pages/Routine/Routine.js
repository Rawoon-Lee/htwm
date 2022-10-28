import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import RoutineList from './routineList'
import ShowRoutine from './ShowRoutine'
import StartRoutine from './startRoutine'

export default function Routine() {
  const [state, setState] = useState(0)

  const components = [<RoutineList />, <ShowRoutine setState={setState} />, <StartRoutine />]

  // 루틴 디테일 골라지면 startRoutine 띄우기

  return (
    <div>
      routine
      {components[state]}
    </div>
  )
}
