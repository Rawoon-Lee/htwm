import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import store from './store/store'
import Modal from './layout/modal'
import MainLayout from './layout/mainLayout'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <Modal>
      <MainLayout />
    </Modal>
  </Provider>,
)
