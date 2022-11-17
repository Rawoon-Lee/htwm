import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setIsVoice, setModalMsg, setVoiceMsg } from '../store/modules/util'

import './voiceModal.css'

export default function VoiceModal() {
  const dispatch = useDispatch()

  const modalMsg = useSelector((state) => state.util.modalMsg)
  const voiceMsg = useSelector((state) => state.util.voiceMsg)

  const [isSpeaking, setIsSpeaking] = useState(false)
  const isSpeakingRef = useRef(0)

  useEffect(() => {
    return () => {
      dispatch(setModalMsg(''))
      dispatch(setVoiceMsg(''))
      dispatch(setIsVoice(false))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSpeakingRef.current) {
        isSpeakingRef.current--
      } else {
        setIsSpeaking(false)
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setIsSpeaking(true)
    isSpeakingRef.current = 2
  }, [modalMsg])

  useEffect(() => {
    const box1 = document.querySelector('.circle1')
    const box2 = document.querySelector('.circle2')
    if (isSpeaking) {
      box1.classList.add('circle')
      box2.classList.add('circle')
    } else {
      box1.classList.remove('circle')
      box2.classList.remove('circle')
    }
  }, [isSpeaking])

  return (
    <div className="modal voice-modal" style={{ opacity: `${voiceMsg === '$리스트' ? 0 : 1}` }}>
      <div className="modal-msg">
        <div>
          {voiceMsg}
          <p>a</p>
        </div>
      </div>
      <div className="voice-modal-circle">
        <div className="circle-base"></div>
        <div
          className="circle1"
          style={{
            animationDelay: '0s',
          }}
        ></div>
        <div
          className="circle2"
          style={{
            animationDelay: '1s',
          }}
        ></div>
      </div>
      <div className="modal-msg">
        <div>
          {modalMsg}
          <p>a</p>
        </div>
      </div>
    </div>
  )
}
