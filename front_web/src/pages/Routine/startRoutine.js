import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { routine } from '../../actions/api/api'
import { setRoutineDetail, setRoutineResult } from '../../store/modules/routine'
import { connect } from 'net'

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
  const totSet = routineDetail.sets?.length // 전체 세트 수
  const trueTotSet = routineDetail.sets?.filter((set) => {
    if (set.exercise_id !== 1) return true
  }).length // 휴식 제외 전체 세트 수
  const count = useRef(0) // 운동 카운트
  const [viewCount, setViewCount] = useState(0) // 보여지는 카운트
  const progressRate = useRef(0) // 진행률

  const [viewTime, setViewTime] = useState(0)
  const time = useRef(0)

  const [poseState, setPoseState] = useState(0) // 포즈 상태

  ///////////////////////// socket //////////////////////////

  let socket
  useEffect(() => {
    const sockets = connect({
      port: 2121,
      // host: '70.12.246.21', //ssafy1102
      // host: '70.12.229.98', //guest
      // host: '192.168.159.137', //phone
      host: '192.168.159.45',
    })
    sockets.setEncoding('utf8') // setting encoding
    sockets.on('data', function (data) {
      const obj = JSON.parse(data)
      if (obj['count'] == 1) {
        addCount()
        setPoseState(1)
      }
      if (obj['check'] == false) {
        console.log('카메라에 보이지 않습니다.')
        setPoseState(2)
      }
    })
    sockets.on('error', function (err) {
      console.log('on error: ', err.code)
    })

    socket = sockets

    return () => {
      sockets.destroy()
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    const set = setNo.current
    let next = 1
    if (setNo.current !== totSet - 1) next = routineDetail.sets[setNo.current + 1]?.exercise_id
    console.log('start', routineDetail.sets[set].exercise_id, next)
    socket.write(
      JSON.stringify({
        current_id: `${routineDetail.sets[setNo.current].exercise_id}`,
        flag: 'start',
        next_id: `${next}`,
      }),
    )
    return () => {
      if (!socket) return

      let next = 1
      // 마지막 세트가 아니면 다음 세트
      if (set !== totSet - 1) next = routineDetail.sets[set + 1].exercise_id
      // 마지막 운동이 아니면 휴식 건너뛰고 다음 운동
      if (set + 2 < totSet && routineDetail.sets[set + 1]?.exercise_id === 1)
        next = routineDetail.sets[set + 2].exercise_id
      // 현재가 휴식이 아니라면 보내기
      if (routineDetail.sets[set]?.exercise_id !== 1) {
        console.log('end', routineDetail.sets[set].exercise_id, next)
        socket.write(
          JSON.stringify({
            current_id: `${routineDetail.sets[set].exercise_id}`,
            flag: 'end',
            next_id: `${next}`,
          }),
        )
      }
    }
  }, [socket, setNo.current]) // ref 변화를 감지하는 것이 아닌 매 초 rerendering 될 때 dependency가 확인된다.

  ///////////////////////////////////////////////////////////////

  // 세트 시간관리
  useEffect(() => {
    time.current = routineDetail.sets[0].sec
    setViewTime(routineDetail.sets[0].sec)

    const interval = setInterval(() => {
      if (time.current > 0) {
        time.current--
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

  // 운동 종료 여부 확인
  useEffect(() => {
    if (!routineDetail.name) {
      setRoutineState(3)
    }
  }, [routineDetail])

  // 포즈 상태 관리(GOOD, BAD)
  useEffect(() => {
    let isUnmounted = false
    if (poseState) {
      setTimeout(() => {
        if (!isUnmounted) {
          setPoseState(0)
        }
      }, 1000)
    }
    return () => {
      isUnmounted = true
    }
  }, [poseState])

  // 종료되면 결과 보내기
  useEffect(() => {
    const date = new Date()
    const offset = date.getTimezoneOffset() * 60000
    const startDateTime = new Date(date.getTime() - offset).toISOString()
    return () => {
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

  // 다음 세트
  const nextSet = async () => {
    if (routineDetail.sets[setNo.current]?.exercise_id !== 1) {
      const addRate =
        (1 / trueTotSet) *
        Math.min(
          routineDetail.sets[setNo.current].number ? count.current / routineDetail.sets[setNo.current].number : 1,
          1,
        )
      progressRate.current += addRate
    }

    count.current = 0
    setViewCount(0)

    if (setNo.current === totSet - 1) return setRoutineState(3)

    await handlingInterval()
    setNo.current++
    time.current = routineDetail.sets[setNo.current].sec
    setViewTime(time.current)
  }

  // 세트 사이 텀
  const handlingInterval = async () => {
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
      setTimeout(resolve, 2000)
    })
    setIsSetInterval(false)
    isSetIntervalRef.current = false
  }

  // 세트가 변하면 운동 이미지 변환
  useEffect(() => {
    const imageTagBefore = document.querySelector('.start-image img')
    if (isSetInterval) imageTagBefore.src = ''
    else {
      let imageSrc = routineDetail.sets[setNo.current].url
      if (routineDetail.sets[setNo.current].exercise_name === '휴식' && setNo.current !== totSet - 1) {
        imageSrc = routineDetail.sets[setNo.current + 1].url
      }

      const imageTag = document.createElement('img')
      const imageDiv = document.querySelector('#imageDiv')
      imageTag.src = imageSrc
      imageDiv.replaceChildren(imageTag)
    }
  }, [isSetInterval, setNo.current])

  const addCount = () => {
    count.current++
    setViewCount(count.current)
  }

  return (
    <div className="start">
      <button onClick={addCount}>test</button>
      {!isSetInterval ? (
        <div className="start-header">
          <div className="start-time">
            <div className="start-time-title">남은시간</div>
            <div className="start-time-time">
              {String(Math.floor(viewTime / 60)).padStart(2, '0')}:{String(viewTime % 60).padStart(2, '0')}
            </div>
          </div>
          <div className="start-exercise">
            <div className="start-exercise-name">
              {routineDetail.sets && routineDetail.sets[setNo.current].exercise_name}
            </div>
            {routineDetail.sets && routineDetail.sets[setNo.current].exercise_name !== '휴식' ? (
              <div className="start-exercise-count">
                {viewCount} / {routineDetail.sets[setNo.current]?.number}{' '}
                <span style={{ color: `${poseState === 1 ? 'green' : 'red'}` }}>
                  {poseState === 1 ? 'GOOD' : poseState === 2 ? 'BAD' : ' '}
                </span>
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
          <div>next: {routineDetail.sets && routineDetail.sets[setNo.current + 1].exercise_name}</div>
        ) : (
          <div>마지막 세트입니다.</div>
        )}
      </div>
      <div id="imageDiv" className="start-image"></div>
    </div>
  )
}
