import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { routine } from '../../actions/api/api'
import { setRoutineDetail, setRoutineResult } from '../../store/modules/routine'

export default function StartRoutine(props) {
  const dispatch = useDispatch()

  const setRoutineState = props.setRoutineState
  const username = useSelector((state) => state.user.username)
  const routineDetail = useSelector((state) => state.routine.routineDetail)

  const setNo = useRef(0) // 진행중인 세트번호
  const totSet = routineDetail.sets.length // 전체 세트 수
  const count = useRef(0) // 운동 카운트
  const [viewCount, setViewCount] = useState(0)
  const progressRate = useRef(0) // 진행률

  const [viewTime, setViewTime] = useState(0)
  const time = useRef(0)

  useEffect(() => {
    let startDateTime = new Date()
    startDateTime = startDateTime.toISOString()
    return () => {
      // 루틴 끝낸 결과 보내기
      const doneSetNum = parseInt(Math.round(progressRate.current * 100))
      const routineJson = String(JSON.stringify(routineDetail))
      const date = new Date()
      const endDateTime = date.toISOString()

      console.log({ startDateTime, endDateTime, routineJson, doneSetNum, username })
      dispatch(setRoutineResult({ startDateTime, endDateTime, routineJson, doneSetNum, username }))
      if (doneSetNum > 3) {
        routine
          .recordRoutine({ startDateTime, endDateTime, routineJson, doneSetNum, username })
          .then((result) => {
            console.log('기록 api 결과', result)
          })
          .catch((error) => console.log(error))
      }
      dispatch(setRoutineDetail({}))
    }
  }, [])

  useEffect(() => {
    time.current = routineDetail.sets[0].sec
    setViewTime(routineDetail.sets[0].sec)
    const interval = setInterval(() => {
      if (time.current > 0) {
        time.current = time.current - 1
      } else {
        nextSet()
      }
      setViewTime(time.current)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const imageDiv = document.querySelector('.imageDiv')

    let imageSrc = routineDetail.sets[setNo.current].url
    let imageTag = document.createElement('img')
    if (imageSrc) {
      imageTag.src = imageSrc
      imageDiv.replaceChildren(imageTag)
      console.log(imageDiv, routineDetail.sets[setNo.current].url, imageTag)
    }
  }, [setNo.current])

  // 다음 세트로 넘어가는 함수
  const nextSet = () => {
    // 휴식시간 처리
    const addRate =
      (1 / totSet) *
      Math.min(
        routineDetail.sets[setNo.current].number ? count.current / routineDetail.sets[setNo.current].number : 1,
        1,
      )
    progressRate.current += addRate
    count.current = 0
    setViewCount(0)
    if (setNo.current === totSet - 1) {
      setRoutineState(3)
      console.log('운동 끝')
    } else {
      setNo.current++
      time.current = routineDetail.sets[setNo.current].sec
    }
  }

  const addCount = () => {
    count.current += 1
    setViewCount(viewCount + 1)
  }

  return (
    <div>
      <p>
        남은시간 - {String(Math.floor(viewTime / 60)).padStart(2, '0')}:{String(viewTime % 60).padStart(2, '0')}
      </p>
      <p>
        남은 세트 - {setNo.current + 1}/{totSet}
      </p>
      <p>카운트 - {viewCount}</p>
      <p>진행중인 운동 - {routineDetail.sets[setNo.current].exercise_name}</p>
      <button onClick={addCount}>카운트 증가</button>
      <hr />
      <p>참고 영상</p>
      <div className="imageDiv" style={{ borderStyle: 'dotted' }}></div>
    </div>
  )
}
