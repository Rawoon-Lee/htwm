import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      home
      <Link to="RealTime">asdf</Link>
      <button onClick={() => (window.location.hash = '#/Picture')}>asdfasdf</button>
    </div>
  )
}
