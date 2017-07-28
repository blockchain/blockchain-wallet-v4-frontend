import * as AT from './actionTypes'
import { insert, remove } from 'ramda'

const INITIAL_STATE = []

const modals = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  const nextIndex = state.length
  const lastIndex = state.length - 1

  switch (type) {
    case AT.CLOSE_MODAL:
      return remove(lastIndex, 1, state)
    case AT.SHOW_MODAL_AUTO_DISCONNECTION:
      return insert(nextIndex, { type: 'AutoDisconnection', payload }, state)
    case AT.SHOW_MODAL_QR_CODE:
      return insert(nextIndex, { type: 'QRCode', payload }, state)
    case AT.SHOW_MODAL_QR_CODE_CAPTURE:
      return insert(nextIndex, { type: 'QRCodeCapture', payload }, state)
    case AT.SHOW_MODAL_REQUEST_BITCOIN:
      return insert(nextIndex, { type: 'RequestBitcoin' }, state)
    case AT.SHOW_MODAL_SEND_BITCOIN:
      return insert(nextIndex, { type: 'SendBitcoin' }, state)
    case AT.SHOW_MODAL_SECOND_PASSWORD:
      return insert(nextIndex, { type: 'SecondPassword', payload }, state)
    default:
      return state
  }
}

export default modals
