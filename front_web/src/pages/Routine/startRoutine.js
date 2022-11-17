import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { routine } from '../../actions/api/api'
import { setRoutineDetail, setRoutineResult } from '../../store/modules/routine'

import './startRoutine.css'
import countDown from './../../assets/count_down.mp3'

export default function StartRoutine(props) {
  const dispatch = useDispatch()

  const setRoutineState = props.setRoutineState
  const username = useSelector((state) => state.user.username)
  const routineDetail = useSelector((state) => state.routine.routineDetail)

  const [isSetInterval, setIsSetInterval] = useState(false)
  const isSetIntervalRef = useRef(false)
  const [intervalMsg, setIntervalMsg] = useState('')

  const setNo = useRef(0) // 진행중인 세트번호
  const totSet = routineDetail.sets.length // 전체 세트 수
  const count = useRef(0) // 운동 카운트
  const [viewCount, setViewCount] = useState(0) // 보여지는 카운트
  const progressRate = useRef(0) // 진행률

  const [viewTime, setViewTime] = useState(0)
  const time = useRef(0)

  useEffect(() => {
    const date = new Date()
    const offset = date.getTimezoneOffset() * 60000
    const startDateTime = new Date(date.getTime() - offset).toISOString()
    return () => {
      // 루틴 끝낸 결과 보내기
      const doneSetNum = parseInt(Math.round(progressRate.current * 100))
      const routineJson = String(JSON.stringify(routineDetail))
      const date = new Date()
      const endDateTime = new Date(date.getTime() - offset).toISOString()
      dispatch(setRoutineResult({ startDateTime, endDateTime, routineJson, doneSetNum, username }))
      if (doneSetNum >= 5) {
        routine
          .recordRoutine({ startDateTime, endDateTime, routineJson, doneSetNum, username })
          .then((result) => {
            console.log('기록 api 결과', result)
          })
          .catch((error) => console.log(error))
      }
      dispatch(setRoutineDetail(-1))
    }
  }, [])

  useEffect(() => {
    if (!routineDetail.name) {
      setRoutineState(3)
    }
  }, [routineDetail])

  useEffect(() => {
    time.current = routineDetail.sets[0].sec
    setViewTime(routineDetail.sets[0].sec)
    const interval = setInterval(() => {
      if (time.current > 0) {
        time.current = time.current - 1
        if (time.current === 3) {
          const sound = new Audio(countDown)
          sound.play()
        }
        setViewTime(time.current)
      } else {
        if (!isSetIntervalRef.current) {
          nextSet()
        }
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const imageTag = document.createElement('img')
    const imageDiv = document.querySelector('#imageDiv')
    const imageSrc = routineDetail.sets[setNo.current].url
    imageTag.src = imageSrc
    imageDiv.replaceChildren(imageTag)
  }, [setNo.current])

  const nextSet = async () => {
    const addRate =
      (1 / totSet) *
      Math.min(
        routineDetail.sets[setNo.current].number ? count.current / routineDetail.sets[setNo.current].number : 1,
        1,
      )
    progressRate.current += addRate

    count.current = 0
    setViewCount(0)
    if (setNo.current === totSet - 1) return setRoutineState(3)

    await handlingInterval()
    time.current = routineDetail.sets[setNo.current + 1].sec
    setViewTime(time.current)
    setNo.current++
  }

  const handlingInterval = async () => {
    const imageTag = document.querySelector('img')
    imageTag.src = ''

    setIsSetInterval(true)
    isSetIntervalRef.current = true
    if (routineDetail.sets[setNo.current].exercise_name !== '휴식') {
      setIntervalMsg(
        ['잘 하셨어요!', '좀 더 힘내봐요!', '거의 다 왔습니다', '다음 세트도 열정있게!'][Math.floor(Math.random() * 4)],
      )
    } else {
      setIntervalMsg(['푹 쉬셨나요?', '숨 좀 고르셨나요?', '다시 힘내봅시다!'][Math.floor(Math.random() * 3)])
    }

    await new Promise((resolve) => {
      if (routineDetail.sets[setNo.current].exercise_name === routineDetail.sets[setNo.current + 1].exercise_name) {
        setTimeout(resolve, 2000)
      } else {
        setTimeout(resolve, 2000)
      }
    })
    setIsSetInterval(false)
    isSetIntervalRef.current = false
  }

  const addCount = () => {
    count.current += 1
    setViewCount(viewCount + 1)
  }

  return (
    <div className="start">
      {!isSetInterval ? (
        <div className="start-header">
          <div className="start-time">
            <div className="start-time-title">남은시간</div>
            <div className="start-time-time">
              {String(Math.floor(viewTime / 60)).padStart(2, '0')}:{String(viewTime % 60).padStart(2, '0')}
            </div>
          </div>
          <div className="start-exercise">
            <div className="start-exercise-name">{routineDetail.sets[setNo.current]?.exercise_name}</div>
            {routineDetail.sets[setNo.current]?.exercise_name !== '휴식' ? (
              <div className="start-exercise-count">
                {viewCount} / {routineDetail.sets[setNo.current]?.number}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="start-header">
          <div className="start-header-interval">{intervalMsg}</div>
        </div>
      )}
      <div className="start-left">
        {setNo.current !== totSet - 1 ? (
          <div>next: {routineDetail.sets[setNo.current + 1].exercise_name}</div>
        ) : (
          <div>마지막 세트입니다.</div>
        )}
      </div>
      <div id="imageDiv" className="start-image"></div>
    </div>
  )
}
