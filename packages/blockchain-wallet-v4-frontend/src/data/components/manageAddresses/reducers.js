import { assocPath } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'

import * as AT from './actionTypes'

export default (state = {}, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.TOGGLE_USED_ADDRESSES: {
      const { derivation, walletIndex } = payload
      return assocPath(
        [walletIndex, derivation, 'usedAddressesVisible'],
        payload.visible,
        state
      )
    }
    case AT.FETCH_UNUSED_ADDRESSES_ERROR: {
      const { derivation, walletIndex } = payload
      return assocPath(
        [walletIndex, derivation, 'unusedAddresses'],
        Remote.Failure(payload.message),
        state
      )
    }
    case AT.FETCH_UNUSED_ADDRESSES_LOADING: {
      const { derivation, walletIndex } = payload
      return assocPath(
        [walletIndex, derivation, 'unusedAddresses'],
        Remote.Loading,
        state
      )
    }
    case AT.FETCH_UNUSED_ADDRESSES_SUCCESS: {
      const { derivation, unusedAddresses, walletIndex } = payload
      return assocPath(
        [walletIndex, derivation, 'unusedAddresses'],
        Remote.Success(unusedAddresses),
        state
      )
    }
    case AT.FETCH_USED_ADDRESSES_ERROR: {
      const { derivation, message, walletIndex } = payload
      return assocPath(
        [walletIndex, derivation, 'usedAddresses'],
        Remote.Failure(message),
        state
      )
    }
    case AT.FETCH_USED_ADDRESSES_LOADING: {
      const { derivation, walletIndex } = payload
      return assocPath(
        [walletIndex, derivation, 'usedAddresses'],
        Remote.Loading,
        state
      )
    }
    case AT.FETCH_USED_ADDRESSES_SUCCESS: {
      const { derivation, usedAddresses, walletIndex } = payload
      return assocPath(
        [walletIndex, derivation, 'usedAddresses'],
        Remote.Success(usedAddresses),
        state
      )
    }
    default:
      return state
  }
}
