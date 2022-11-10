import { useSelector } from 'react-redux'

import './profile.css'

import defaultProfile from './../assets/defaultProfile.png'

export default function Profile(props) {
  const { nickname, url } = props

  return (
    <div className="profile-div">
      <img className="profile-image" src={url ? url : defaultProfile} />
      <div className="profile-nickname">{nickname}</div>
    </div>
  )
}
