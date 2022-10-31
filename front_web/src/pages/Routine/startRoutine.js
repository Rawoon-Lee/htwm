import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { routine } from '../../actions/api/api'
import { setRoutineDetail } from '../../store/modules/util'

export default function StartRoutine(props) {
  const setState = props.setState
  const dispatch = useDispatch()
  const username = useSelector((state) => state.user.username)
  const routineDetail = useSelector((state) => state.util.routineDetail)
  const [startDateTime, setStartDateTime] = useState('')

  const setNo = useRef(0) // 진행중인 세트번호
  const count = useRef(0) // 운동 카운트
  const [viewCount, setViewCount] = useState(0)
  const progressRate = useRef(0) // 진행률

  const [viewTime, setViewTime] = useState(10)
  const time = useRef(5)
  const totSet = routineDetail.sets.length

  useEffect(() => {
    return () => {
      // 루틴 끝낸 결과 보내기
      const doneSetNum = Math.round(progressRate.current * 100).toFixed()
      const routineJson = String(JSON.stringify(routineDetail))
      const date = new Date()
      const endDateTime = date.toISOString()

      console.log(startDateTime, endDateTime, routineJson, doneSetNum, username)
      if (doneSetNum > 3) {
        routine.recordRoutine({ startDateTime, endDateTime, routineJson, doneSetNum, username }).then((result) => {
          console.log('기록 api 결과', result.data)
        })
      }
      dispatch(setRoutineDetail({}))
    }
  }, [])

  useEffect(() => {
    const date = new Date()
    setStartDateTime(date.toISOString())
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

  //     exercise_id: 0,  // row id
  //     exercise_name: 'string', // 운동이름
  //     number: 0,  // 목표 횟수
  //     sec: 0,  // 세트당 시간
  //     set_cnt: 0,  // 세트 개수

  // 다음 세트로 넘어가는 함수
  const nextSet = () => {
    // 휴식시간 처리
    const addRate = (1 / totSet) * Math.min(count.current / (routineDetail.sets[setNo.current].number || 1), 1)
    progressRate.current += addRate
    count.current = 0
    setViewCount(0)
    if (setNo.current === totSet - 1) {
      setState(3)
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
      <button onClick={addCount}>카운트 증가</button>
    </div>
  )
}
