import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

export default function ShowRoutine(props) {
  const setState = props.setState
  const routineDetail = useSelector((state) => state.util.routineDetail)

  useEffect(() => {
    setTimeout(() => {
      setState(2)
    }, 5000)
  }, [])

  return (
    <div>
      {routineDetail.set.map((set) => (
        <div>{set.exercise_name}</div>
      ))}
    </div>
  )
}
