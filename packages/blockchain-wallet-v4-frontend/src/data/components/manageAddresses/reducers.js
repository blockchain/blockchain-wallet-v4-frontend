import { assocPath } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'

import * as AT from './actionTypes'

export default (state = {}, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.TOGGLE_USED_ADDRESSES: {
      return assocPath(
        [payload.walletIndex, 'usedAddressesVisible'],
        payload.visible,
        state
      )
    }
    case AT.FETCH_UNUSED_ADDRESSES_ERROR: {
      return assocPath(
        [payload.walletIndex, 'unusedAddresses'],
        Remote.Failure(payload.message),
        state
      )
    }
    case AT.FETCH_UNUSED_ADDRESSES_LOADING: {
      return assocPath(
        [payload.walletIndex, 'unusedAddresses'],
        Remote.Loading,
        state
      )
    }
    case AT.FETCH_UNUSED_ADDRESSES_SUCCESS: {
      return assocPath(
        [payload.walletIndex, 'unusedAddresses'],
        Remote.Success(payload.unusedAddresses),
        state
      )
    }
    case AT.FETCH_USED_ADDRESSES_ERROR: {
      return assocPath(
        [payload.walletIndex, 'usedAddresses'],
        Remote.Failure(payload.message),
        state
      )
    }
    case AT.FETCH_USED_ADDRESSES_LOADING: {
      return assocPath(
        [payload.walletIndex, 'usedAddresses'],
        Remote.Loading,
        state
      )
    }
    case AT.FETCH_USED_ADDRESSES_SUCCESS: {
      return assocPath(
        [payload.walletIndex, 'usedAddresses'],
        Remote.Success(payload.usedAddresses),
        state
      )
    }
    default:
      return state
  }
}
