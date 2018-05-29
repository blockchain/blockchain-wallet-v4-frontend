import { assocPath } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.TOGGLE_USED_ADDRESSES: {
      return assocPath([payload.walletIndex, 'visible'], payload.visible, state)
    }
    case AT.FETCH_USED_ADDRESSES_LOADING: {
      return assocPath([payload.walletIndex, 'addresses'], Remote.Loading, state)
    }
    case AT.FETCH_USED_ADDRESSES_SUCCESS: {
      return assocPath([payload.walletIndex, 'addresses'], Remote.Success(payload.addresses), state)
    }
    default:
      return state
  }
}
