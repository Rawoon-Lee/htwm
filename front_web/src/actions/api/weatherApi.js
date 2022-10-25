import axios from 'axios'

export default (date, time) => {
  const params = {
    ServiceKey: 'xGoH6IZFe/fHAadDBveYEIjjt0a0bqCfSRoQ4SR0OEWp1jaLwoPpNbJNogawJK9dGA2SjTJw0GWr5t1kztyB6w==',
    pageNo: 1,
    numOfRows: 1000,
    dataType: 'json',
    base_date: date,
    base_time: time,
    nx: 61,
    ny: 125, // 역삼2동. 제대로 하려면 앱에서 지역 설정하면 nx ny 찾아서 넣는 과정 추가해야함
  }
  return axios.get('http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst', { params })
}
