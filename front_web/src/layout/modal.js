import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setModalMsg, setModalState } from '../store/modules/util'

import NormalModal from './normalModal'
import VoiceModal from './voiceModal'

import './modal.css'

export default function Modal(props) {
  const dispatch = useDispatch()

  const modalState = useSelector((state) => state.util.modalState)
  const isVoice = useSelector((state) => state.util.isVoice)

  // useEffect(() => {
  // if (modalState) {
  // setTimeout(() => {
  //   dispatch(setModalState(false))
  // }, 3000)
  // }
  // }, [modalState])

  return (
    <div className="modal-layer">
      {modalState ? isVoice ? <VoiceModal /> : <NormalModal /> : null}
      {props.children}
    </div>
  )
}
