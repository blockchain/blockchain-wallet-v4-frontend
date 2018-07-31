import { assoc } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  connecting: false,
  deviceInfo: {},
  xpubs: {
    bch: '1111',
    btc: '22222',
    eth: '333333'
  }
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_CARBON_XPUBS: {
      return assoc('xpubs', payload.xpubs, state)
    }
    default:
      return state
  }
}
