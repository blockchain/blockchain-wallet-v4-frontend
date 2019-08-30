import { assoc } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  showWalletTour: false
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_WALLET_TOUR_VISIBILITY: {
      return assoc('showWalletTour', payload, state)
    }

    default:
      return state
  }
}
