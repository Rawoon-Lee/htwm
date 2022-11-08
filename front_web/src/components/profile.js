import { useSelector } from 'react-redux'
import './profile.css'

export default function Profile() {
  const userInfo = useSelector((state) => state.user.userInfo)
  const defaultUrl =
    'https://w.namu.la/s/45507892b4f48b2b3d4a6386f6dae20c28376a8ef5dfb68c7cc95249ec358e3e68df77594766021173b2e6acf374b79ce02e9eeef61fcdf316659e30289e123f7816190b0aa708ad3d70f1a8e708e690ae940f98b6d9e4838e2b98aa1ecbcd18993fb3dc1d0d69ce31ba409d6f073a8a'
  return (
    <div className="profile-div">
      <img className="profile-image" src={userInfo.url ? userInfo.url : defaultUrl} />
      <div className="profile-nickname">{userInfo.nickname}님 안녕하세요</div>
    </div>
  )
}
