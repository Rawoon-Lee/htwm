import { useSelector } from 'react-redux'

export default function NormalModal() {
  const modalMsg = useSelector((state) => state.util.modalMsg)

  return (
    <div className="modal">
      <div className="modal-msg">{modalMsg}</div>
    </div>
  )
}
