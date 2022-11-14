import { useState } from 'react'

import RoutineList from './routineList'
import ShowRoutine from './showRoutine'
import StartRoutine from './startRoutine'
import RoutineResult from './routineResult'

export default function Routine(props) {
  const setState = props.setState
  const [routineState, setRoutineState] = useState(0)

  const components = [
    <RoutineList setRoutineState={setRoutineState} />, // 루틴 리스트 확인 및 선택
    <ShowRoutine setRoutineState={setRoutineState} />, // 시작 전 루틴 잠시 보여주기
    <StartRoutine setRoutineState={setRoutineState} />, // 운동 시작
    <RoutineResult setState={setState} />, // 운동 결과 및 시작페이지로 돌아가기
  ]

  // 운동 중단 요청오면 setState 변경

  return <div>{components[routineState]}</div>
}
