import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setModalMsg, setModalState } from '../store/modules/util'

import './modal.css'

export default function Modal(props) {
  const dispatch = useDispatch()

  const modalMsg = useSelector((state) => state.util.modalMsg)
  const modalState = useSelector((state) => state.util.modalState)

  useEffect(() => {
    // if (modalState) {
    //   setTimeout(() => {
    //     dispatch(setModalState(false))
    //     dispatch(setModalMsg(''))
    //   }, 3000)
    // }
  }, [modalState])

  return (
    <div className="modal">
      {modalState && <div className="modal-msg">{modalMsg}</div>}
      {props.children}
    </div>
  )
}
