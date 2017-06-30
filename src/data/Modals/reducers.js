import * as AT from './actionTypes'

let assign = (state, next) => Object.assign({}, state, next)

const INITIAL_STATE = {
  displayed: false,
  modalType: '',
  sendBitcoin: {}
}

const modals = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AT.TOGGLE_MODAL: {
      if (state.displayed) {
        return assign(INITIAL_STATE, {
          displayed: !state.displayed
        })
      } else {
        return assign(INITIAL_STATE, {
          displayed: !state.displayed,
          modalType: action.payload.modalType
        })
      }
    }
    default:
      return state
  }
}

export default modals
