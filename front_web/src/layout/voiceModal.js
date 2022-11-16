import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'

export default function VoiceModal() {
  const modalMsg = useSelector((state) => state.util.modalMsg)

  const [isSpeaking, setIsSpeaking] = useState(false)
  const isSpeakingRef = useRef(0)

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
    isSpeakingRef.current = 1
  }, [modalMsg])

  useEffect(() => {
    const box = document.querySelector('.modal-image')
    if (isSpeaking) {
      box.classList.add('speaking')
    } else {
      box.classList.remove('speaking')
    }
  }, [isSpeaking])

  return (
    <div className="modal">
      <div className="modal-image">a</div>
      <div className="modal-msg">{modalMsg}</div>
    </div>
  )
}
