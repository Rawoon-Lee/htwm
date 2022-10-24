import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { SEND_TEST } from '../../store/constants'
import weatherApi from '../../actions/api/weatherApi'

export default function Home() {
  const { ipcRenderer } = window.require('electron')
  const [weather, setWeather] = useState([])

  const getWeather = () => {
    weatherApi('20221024', '0000').then((res) => {
      console.log(res.data)
      const data = getWeatherDetail(res.data.response.body.items.item)
      setWeather(data)
      console.log(data)
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
      const time = String(data.fcstTime).slice(-4, -2)
      if (!now.near.length || (now.near.length < 12 && now.near[now.near.length - 1]['시간'] != time)) {
        // 온도
        if ((data.category = 'TMP')) {
          now.near.push({ 시간: time, 온도: String(data.fcstValue) + '°C' })
        }
        // 강수확률 %
        if ((data.category = 'POP')) {
          now.near[now.near.length - 1]['강수확률'] = String(data.fcstValue) + '%'
        }
        // 강수형태 0없음 1비 2비/눈 3눈 4소나기
        if ((data.category = 'PTY')) {
          let type
          switch (data.fcstValue) {
            case 0:
              type = '없음'
              break
            case 1:
              type = '비'
              break
            case 2:
              type = '비/눈'
            case 3:
              type = '눈'
            case 4:
              type = '소나기'
          }
          now.near[now.near.length - 1]['강수형태'] = type
        }
        // 풍속 m/s
        if ((data.category = 'WSD')) {
          now.near[now.near.length - 1]['풍속'] = String(data.fcstValue) + 'm/s'
        }
      }
      // 간단내용으로 담기
      const date = String(data.fcstDate).slice(-2)
      const day = ['일', '월', '화', '수', '목', '금', '토'][new Date(data.fcstDate).getDay()]
      if (!now.far.length || now.far[now.far.length - 1]['날짜'] !== date) {
        now.far.push({ 날짜: date, 요일: day })
      }
      // 최고온도 C
      if ((data.category = 'TMX')) {
        if (!now.far.length) continue
        now.far[now.far.length - 1]['최고기온'] = String(data.fcstValue) + '°C'
      }
      // 최저온도 C
      if ((data.category = 'TMN')) {
        if (!now.far.length) continue
        now.far[now.far.length - 1]['최저기온'] = String(data.fcstValue) + '°C'
      }
    }
    return now
  }

  const getMsg = (event, arg) => {
    console.log(event, arg, '받음')
    setTest(arg)
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

  const sendMain = () => {
    ipcRenderer.send(SEND_TEST, 'hello')
  }

  return (
    <div>
      home
      {/* <Link to="RealTime">RealTime</Link> */}
      <button onClick={() => (window.location.hash = '#/RealTime')}>realTime으로 이동</button>
      <button onClick={() => (window.location.hash = '#/Picture')}>picture로 이동</button>
      <button onClick={sendMain}>ipc 테스트</button>
      <button onClick={getWeather}>날씨 테스트</button>
      {/* {weather} */}
    </div>
  )
}
