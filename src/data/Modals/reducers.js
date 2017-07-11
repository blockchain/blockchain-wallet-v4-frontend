import * as AT from './actionTypes'

let assign = (state, next) => Object.assign({}, state, next)

const INITIAL_STATE = {
  show: false,
  animation: true,
  type: '',
  sendBitcoin: {}
}

const modals = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AT.CLOSE_MODAL:
      return assign(INITIAL_STATE, { show: false })

    case AT.SHOW_MODAL_REQUEST_BITCOIN_STEP1:
      return assign(INITIAL_STATE, { show: true, animation: true, type: 'requestBitcoinStep1' })

    case AT.SHOW_MODAL_REQUEST_BITCOIN_STEP2:
      return assign(INITIAL_STATE, { show: true, animation: false, type: 'requestBitcoinStep2' })

    case AT.SHOW_MODAL_REQUEST_BITCOIN_QRCODE:
      return assign(INITIAL_STATE, { show: true, animation: false, type: 'requestBitcoinQRCode' })

    default:
      return state
  }
}

export default modals
