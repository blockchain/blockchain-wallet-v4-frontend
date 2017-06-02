import { Map, List, fromJS } from 'immutable-ext'
import { set, over, map, assoc } from 'ramda'
import { iLensPath } from '../../lens'
import { WALLET_CLEAR, WALLET_DATA_LOAD, CONTEXT_TXS_LOAD, CONTEXT_TXS_CLEAR } from '../actions'

const INITIAL_OBJECT = {
  info: {latest_block: {}},
  walletInfo: {},
  addressesInfo: {}
}
const INITIAL_STATE = fromJS(INITIAL_OBJECT)

let makeTxsLens = (context) => iLensPath(['addressesInfo', context, 'transactions'])

const blockchainDataReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case WALLET_DATA_LOAD: {
      let { payload } = action
      const object = {
        info: { latest_block: payload.info.latest_block },
        walletInfo: payload.wallet
      }
      const io = fromJS(object)
      const am = Map(map(a => [a.address, fromJS(assoc('transactions', [], a))], payload.addresses))
      return io.set('addressesInfo', am)
    }
    case CONTEXT_TXS_LOAD: {
      // NOTE: how to handle txs for groups (all legacy addresses)? selector?
      let { payload } = action
      let txs = fromJS(payload.txs)
      let txsLens = makeTxsLens(payload.addresses[0].address)
      return over(txsLens, t => t.concat(txs), state)
    }
    case CONTEXT_TXS_CLEAR: {
      let { payload: context } = action
      return set(makeTxsLens(context), List(), state)
    }
    case WALLET_CLEAR: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}

export default blockchainDataReducer
