import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Profile from '../../components/profile'

import { weather } from '../../actions/api/api'
import { setWeatherData } from '../../store/modules/util'

import cloudy from './../../assets/cloudy.webp'
import midCloudy from './../../assets/midCloudy.webp'
import sunny from './../../assets/sunny.webp'

import heavyRain from './../../assets/heavyRain.webp'
import lightRain from './../../assets/lightRain.webp'
import snow from './../../assets/ice.webp'

import './Home.css'

export default function Home() {
  const dispatch = useDispatch()

  const weatherData = useSelector((state) => state.util.weatherData)
  const userInfo = useSelector((state) => state.user.userInfo)
  const [date, setDate] = useState('')

  useEffect(() => {
    getTime()
    const interval = setInterval(getTime, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    getWeather()
    const getWeatherInterval = setInterval(getWeather, 600000)
    return () => {
      clearInterval(getWeatherInterval)
    }
  }, [])

  useEffect(() => {
    if (!weatherData.near) {
      setTimeout(getWeather, 10000)
    }
  }, [weatherData])

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

  const getWeather = () => {
    let newDate = new Date()
    let time = newDate.getHours() - 2 >= 0 ? newDate.getHours() - 2 : newDate.getHours() + 22
    time = String(Math.floor(time / 3) * 3 + 2)
      .padStart(2, '0')
      .padEnd(4, '0')

    if (newDate.getHours() - 2 < 0) {
      newDate = new Date(newDate.setDate(newDate.getDate() - 1))
    }
    const date =
      String(newDate.getFullYear()) +
      String(newDate.getMonth() + 1).padStart(2, '0') +
      String(newDate.getHours() - 2 >= 0 ? newDate.getDate() : newDate.getDate() - 1).padStart(2, '0')
    weather(date, time)
      .then((res) => {
        const data = getWeatherDetail(res.data.response.body.items.item)
        dispatch(setWeatherData(data))
      })
      .catch((err) => {
        setTimeout(getWeather, 3000)
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
      // 가까운 정보는 상세내용
      const time = String(data.fcstTime).slice(0, 2)
      if (!now.near.length || (now.near.length < 6 && now.near[now.near.length - 1]['시간'] != time)) {
        // 온도
        if (data.category === 'TMP') {
          now.near.push({ 시간: time, 온도: String(data.fcstValue) + '°C' })
        }
      } else {
        // 강수확률 %
        if (data.category === 'POP') {
          now.near[now.near.length - 1]['강수확률'] = data.fcstValue
        }
        // 하늘
        if (data.category === 'SKY') {
          now.near[now.near.length - 1]['하늘'] = ['맑음', '', '구름많음', '흐림'][data.fcstValue - 1]
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

  return (
    <div>
      <div className="home-profile">
        <Profile nickname={userInfo.nickname} url={userInfo.url} />
      </div>
      <div className="home-date">
        <div className="home-date-day">
          {date.slice(0, 4)} - {date.slice(4, 6)} - {date.slice(6, 8)}
        </div>
        <div className="home-date-time">{date.slice(8, 16)}</div>
      </div>

      <div className="home-weather">
        {weatherData.near && (
          <div className="home-weather-image">
            <p>
              {weatherData.near[0]['강수형태'] === '없음'
                ? weatherData.near[0]['하늘']
                : weatherData.near[0]['강수형태']}
            </p>
            {weatherData.near[0]['강수형태'] === '없음' ? (
              weatherData.near[0]['하늘'] === '맑음' ? (
                <img src={sunny} />
              ) : weatherData.near[0]['하늘'] === '구름많음' ? (
                <img src={midCloudy} />
              ) : (
                <img src={cloudy} />
              )
            ) : weatherData.near[0]['강수형태'] === '소나기' ? (
              <img src={heavyRain} />
            ) : weatherData.near[0]['강수형태'] === '비' ? (
              <img src={lightRain} />
            ) : (
              <img src={snow} />
            )}
          </div>
        )}

        <div>
          <table className="home-weather-near">
            <thead>
              <tr>
                {weatherData.near && weatherData.near.map((data) => <th key={data['시간']}>{data['시간']}시</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>{weatherData.near && weatherData.near.map((data) => <td key={data['시간']}>{data['온도']}</td>)}</tr>
            </tbody>
            <tbody>
              <tr>
                {weatherData.near &&
                  weatherData.near.map((data) => {
                    if (data['강수확률'] !== 0) {
                      return <td key={data['시간']}>{data['강수확률']}%</td>
                    } else {
                      return <td key={data['시간']}></td>
                    }
                  })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="home-weather-far">
          {weatherData.far?.slice(1, 3).map((data, idx) => {
            return (
              <div key={data['날짜']}>
                {idx === 0 ? '내일' : '모레'} {data['최저기온']}~{data['최고기온']}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
