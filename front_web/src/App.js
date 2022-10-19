import { Routes, Route, HashRouter } from 'react-router-dom'

import Home from './pages/home/Home'
import Picture from './pages/Picture/Picture'
import RealTime from './pages/RealTime/RealTime'
import Routine from './pages/Routine/Routine'
import Layout from './layout/voiceLayer'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" basename="Home" element={<Home />} />
          <Route path="/picture" basename="Picture" element={<Picture />} />
          <Route path="/realtime" basename="RealTime" element={<RealTime />} />
          <Route path="/routine" basename="Routine" element={<Routine />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
