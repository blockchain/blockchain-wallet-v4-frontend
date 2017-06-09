import { combineReducers } from 'redux'
import * as A from '../actions'

const INITIAL_STATE_WALLET = {}
const INITIAL_STATE_ADDRESSES = []
const INITIAL_STATE_LATEST_BLOCK = {}
const INITIAL_STATE_TXS = []

const walletReducer = (state = INITIAL_STATE_WALLET, action) => {
  let { type } = action
  switch (type) {
    case A.WALLET_DATA_LOAD: {
      let { payload } = action
      return payload
    }
    default:
      return state
  }
}

const latestBlockReducer = (state = INITIAL_STATE_LATEST_BLOCK, action) => {
  let { type } = action
  switch (type) {
    case A.LATEST_BLOCK_DATA_LOAD: {
      let { payload } = action
      return payload
    }
    default:
      return state
  }
}
const addressesReducer = (state = INITIAL_STATE_ADDRESSES, action) => {
  let { type } = action
  switch (type) {
    case A.ADDRESSES_DATA_LOAD: {
      let { payload } = action
      return payload
    }
    default:
      return state
  }
}

const txsReducer = (state = INITIAL_STATE_TXS, action) => {
  let { type } = action
  switch (type) {
    case A.CONTEXT_TXS_LOAD: {
      let { payload } = action
      return payload
    }
    case A.CONTEXT_TXS_CLEAR: {
      return INITIAL_STATE_TXS
    }
    default:
      return state
  }
}

export default combineReducers({
  latest_block: latestBlockReducer,
  wallet: walletReducer,
  addresses: addressesReducer,
  txs: txsReducer
})
