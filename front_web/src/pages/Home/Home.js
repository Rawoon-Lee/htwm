import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { SEND_TEST } from '../../store/constants'
import weatherApi from '../../actions/api/weatherApi'

import CameraTest from './cameraTest'

export default function Home() {
  const { ipcRenderer } = window.require('electron')
  const [near, setNear] = useState([])
  const [far, setFar] = useState([])
  const [date, setDate] = useState('')

  const getTime = () => {
    const t = new Date()
    setDate(
      String(t.getFullYear()) +
        String(t.getMonth() + 1).padStart(2, '0') +
        String(t.getDate()).padStart(2, '0') +
        '' +
        String(t).slice(16, 24),
    )
  }

  useEffect(() => {
    getTime()
    const interval = setInterval(getTime, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const getWeather = () => {
    const newDate = new Date()
    let time = newDate.getHours() - 2 >= 0 ? newDate.getHours() - 2 : newDate.getHours() + 22
    time = String(Math.floor(time / 3) * 3 + 2)
      .padStart(2, '0')
      .padEnd(4, '0')
    const date =
      String(newDate.getFullYear()) +
      String(newDate.getMonth() + 1).padStart(2, '0') +
      String(newDate.getDate()).padStart(2, '0')
    weatherApi(date, time).then((res) => {
      const data = getWeatherDetail(res.data.response.body.items.item)
      console.log(data)
      setNear(data.near)
      setFar(data.far)
    })
  }

  const getWeatherDetail = (w) => {
    let now = {}
    for (let data of w) {
      if (!now.fcstDate) {
        now.fcstDate = data.fcstDate
        now.fcstTime = data.fcstTime
        now.near = []
        now.far = []
      }
      // 가까운 정보는 상세내용으로 담기
      const time = String(data.fcstTime).slice(0, 2)
      if (!now.near.length || (now.near.length < 12 && now.near[now.near.length - 1]['시간'] != time)) {
        // 온도
        if (data.category === 'TMP') {
          now.near.push({ 시간: time, 온도: String(data.fcstValue) + '°C' })
        }
      } else {
        // 강수확률 %
        if (data.category === 'POP') {
          now.near[now.near.length - 1]['강수확률'] = String(data.fcstValue) + '%'
        }
        // 강수형태 0없음 1비 2비/눈 3눈 4소나기
        if (data.category === 'PTY') {
          let type
          switch (data.fcstValue) {
            case '0':
              type = '없음'
              break
            case '1':
              type = '비'
              break
            case '2':
              type = '비/눈'
              break
            case '3':
              type = '눈'
              break
            case '4':
              type = '소나기'
              break
          }
          now.near[now.near.length - 1]['강수형태'] = type
        }
        // 풍속 m/s
        if (data.category === 'WSD') {
          now.near[now.near.length - 1]['풍속'] = String(data.fcstValue) + 'm/s'
        }
      }
      // 간단내용으로 담기
      const date = String(data.fcstDate).slice(-2)
      const day = ['일', '월', '화', '수', '목', '금', '토'][
        new Date(data.fcstDate.slice(0, 4), data.fcstDate.slice(4, 6) - 1, data.fcstDate.slice(6, 8)).getDay()
      ]
      if (!now.far.length || now.far[now.far.length - 1]['날짜'] !== date) {
        now.far.push({ 날짜: date, 요일: day })
      }
      // 최고온도 C
      if (data.category === 'TMX') {
        now.far[now.far.length - 1]['최고기온'] = String(data.fcstValue) + '°C'
      }
      // 최저온도 C
      if (data.category === 'TMN') {
        now.far[now.far.length - 1]['최저기온'] = String(data.fcstValue) + '°C'
      }
    }
    return now
  }

  useEffect(() => {
    ipcRenderer.on(SEND_TEST, getMsg)
    getWeather()
    const getWeatherInterval = setInterval(getWeather, 600000)
    return () => {
      ipcRenderer.removeListener(SEND_TEST, getMsg)
      clearInterval(getWeatherInterval)
    }
  }, [])

  const getMsg = (event, arg) => {
    console.log(event, arg, '받음')
  }

  const sendMain = () => {
    ipcRenderer.send(SEND_TEST, 'hello')
  }

  return (
    <div>
      home
      <button onClick={sendMain}>ipc 테스트</button>
      <button onClick={getWeather}>날씨 테스트</button>
      <div>
        <div>{date.slice(4, 6)}월</div>
        <div>{date.slice(6, 8)}일</div>
        <div>{date.slice(8, 16)}</div>
      </div>
      <div>
        {near.map((data) => (
          <div key={data['시간']}>
            시간: {data['시간']}
            온도: {data['온도']}
            풍속: {data['풍속']}
            강수확률: {data['강수확률']}
            {data['강수형태'] !== '없음' ? data['강수형태'] : null}
          </div>
        ))}
      </div>
      <div>
        {far.slice(1, 3).map((data, idx) => {
          return (
            <div key={data['날짜']}>
              {idx === 0 ? '내일' : '모레'} {data['날짜'] + '일 ' + data['요일'] + '요일'}: 최고 {data['최고기온']},
              최저 {data['최저기온']}
            </div>
          )
        })}
      </div>
    </div>
  )
}
