import * as AT from './actionTypes'
import { assoc } from 'ramda'

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
