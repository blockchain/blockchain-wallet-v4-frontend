import * as AT from './actionTypes'
import { assign } from 'services/RamdaCookingBook'

const INITIAL_STATE = {
  show: false,
  type: '',
  data: {}
}

const modals = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.CLOSE_MODAL:
      return assign(INITIAL_STATE, { show: false })
    case AT.SHOW_MODAL_REQUEST_BITCOIN:
      return assign(INITIAL_STATE, { show: true, type: 'RequestBitcoin' })
    case AT.SHOW_MODAL_QR_CODE:
      return assign(INITIAL_STATE, { show: true, type: 'QRCode', payload })
    default:
      return state
  }
}

export default modals
