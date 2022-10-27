import api from './api'
import { UUID } from '../../store/constants'

const END_POINT = 'user'

const user = {
  uuid() {
    return api({
      method: 'post',
      url: `${END_POINT}/uuid`,
      data: { uuid: UUID },
    })
  },
}
export default user
