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
      // ????????? ????????? ????????????
      const time = String(data.fcstTime).slice(0, 2)
      if (!now.near.length || (now.near.length < 6 && now.near[now.near.length - 1]['??????'] != time)) {
        // ??????
        if (data.category === 'TMP') {
          now.near.push({ ??????: time, ??????: String(data.fcstValue) + '??C' })
        }
      } else {
        // ???????????? %
        if (data.category === 'POP') {
          now.near[now.near.length - 1]['????????????'] = data.fcstValue
        }
        // ??????
        if (data.category === 'SKY') {
          now.near[now.near.length - 1]['??????'] = ['??????', '', '????????????', '??????'][data.fcstValue - 1]
        }
        // ???????????? 0?????? 1??? 2???/??? 3??? 4?????????
        if (data.category === 'PTY') {
          let type
          switch (data.fcstValue) {
            case '0':
              type = '??????'
              break
            case '1':
              type = '???'
              break
            case '2':
              type = '???/???'
              break
            case '3':
              type = '???'
              break
            case '4':
              type = '?????????'
              break
          }
          now.near[now.near.length - 1]['????????????'] = type
        }
      }

      // ?????????????????? ??????
      const date = String(data.fcstDate).slice(-2)
      const day = ['???', '???', '???', '???', '???', '???', '???'][
        new Date(data.fcstDate.slice(0, 4), data.fcstDate.slice(4, 6) - 1, data.fcstDate.slice(6, 8)).getDay()
      ]
      if (!now.far.length || now.far[now.far.length - 1]['??????'] !== date) {
        now.far.push({ ??????: date, ??????: day })
      }
      // ???????????? C
      if (data.category === 'TMX') {
        now.far[now.far.length - 1]['????????????'] = String(data.fcstValue) + '??C'
      }
      // ???????????? C
      if (data.category === 'TMN') {
        now.far[now.far.length - 1]['????????????'] = String(data.fcstValue) + '??C'
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
              {weatherData.near[0]['????????????'] === '??????'
                ? weatherData.near[0]['??????']
                : weatherData.near[0]['????????????']}
            </p>
            {weatherData.near[0]['????????????'] === '??????' ? (
              weatherData.near[0]['??????'] === '??????' ? (
                <img src={sunny} />
              ) : weatherData.near[0]['??????'] === '????????????' ? (
                <img src={midCloudy} />
              ) : (
                <img src={cloudy} />
              )
            ) : weatherData.near[0]['????????????'] === '?????????' ? (
              <img src={heavyRain} />
            ) : weatherData.near[0]['????????????'] === '???' ? (
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
                {weatherData.near && weatherData.near.map((data) => <th key={data['??????']}>{data['??????']}???</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>{weatherData.near && weatherData.near.map((data) => <td key={data['??????']}>{data['??????']}</td>)}</tr>
            </tbody>
            <tbody>
              <tr>
                {weatherData.near &&
                  weatherData.near.map((data) => {
                    if (data['????????????'] !== 0) {
                      return <td key={data['??????']}>{data['????????????']}%</td>
                    } else {
                      return <td key={data['??????']}></td>
                    }
                  })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="home-weather-far">
          {weatherData.far?.slice(1, 3).map((data, idx) => {
            return (
              <div key={data['??????']}>
                {idx === 0 ? '??????' : '??????'} {data['????????????']}~{data['????????????']}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
