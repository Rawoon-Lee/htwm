import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setModalMsg } from '../store/modules/util'

export default function NormalModal() {
  const dispatch = useDispatch()

  const modalMsg = useSelector((state) => state.util.modalMsg)

  useEffect(() => {
    return () => {
      dispatch(setModalMsg(''))
    }
  }, [])

  return (
    <div className="modal">
      <div className="modal-msg">{modalMsg}</div>
    </div>
  )
}
