import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setModalMsg, setModalState } from '../store/modules/util'

export default function Modal(props) {
  const dispatch = useDispatch()

  const modalMsg = useSelector((state) => state.util.modalMsg)
  const modalState = useSelector((state) => state.util.modalState)

  useEffect(() => {
    if (modalState) {
      setTimeout(() => {
        dispatch(setModalState(false))
        dispatch(setModalMsg(''))
      }, 3000)
    }
  }, [modalState])

  return (
    <div>
      <p>{modalState && modalMsg}</p>
      {props.children}
    </div>
  )
}
