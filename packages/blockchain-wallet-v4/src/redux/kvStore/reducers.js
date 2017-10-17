import { over, set } from 'ramda-lens'
import { compose, assoc } from 'ramda'

import * as T from './actionTypes.js'
// import { Wrapper, Wallet, Options, HDWallet, HDWalletList } from '../../types'

const INITIAL_STATE = {}

export const kvStoreReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.SET_KV_STORE: {
      const { key, data } = payload
      return assoc(key, data, state)
    }
    default:
      return state
  }
}

export default kvStoreReducer
