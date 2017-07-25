import { assoc } from 'ramda'
import * as A from './actionTypes'
// import { selectAll, effectiveBalance } from '../../../coinSelection'
import { descentDraw } from '../../../coinSelection'

const INITIAL_STATE = { coins: [], selection: {fee: undefined, inputs: [], outputs: []} }

export default (state = INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case A.PAYMENT_GET_UNSPENTS_SUCCESS: {
      const coins = action.payload
      return assoc('coins', coins, state)
    }
    case A.REFRESH_SELECTION: {
      const { coins, target, feePerByte, change } = action.payload
      console.log('reducer')
      console.log(action.payload)
      const selection = descentDraw([target], feePerByte, coins, change)
      return assoc('selection', selection)(state)
    }
    default:
      return state
  }
}
