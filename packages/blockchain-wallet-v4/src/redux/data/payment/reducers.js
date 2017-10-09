import { assoc } from 'ramda'
import * as A from './actionTypes'
// import { selectAll, effectiveBalance } from '../../../coinSelection'
import { descentDraw, ascentDraw, singleRandomDraw, branchAndBound } from '../../../coinSelection'

const EMPTY_SELECTION = {
  fee: undefined,
  inputs: [],
  outputs: []
}
const INITIAL_STATE = {
  coins: [],
  selection: EMPTY_SELECTION,
  effectiveBalance: 0
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case A.SET_UNSPENT: {
      const { coins } = payload
      return assoc('coins', coins, state)
    }
    case A.SET_EFFECTIVE_BALANCE: {
      const { effectiveBalance } = payload
      return assoc('effectiveBalance', effectiveBalance, state)
    }
    case A.SET_SELECTION: {
      const { coins, target, feePerByte, change, algorithm, seed } = action.payload

      let selection
      switch (algorithm) {
        case 'ascentDraw':
          selection = ascentDraw([target], feePerByte, coins, change)
          break
        case 'descentDraw':
          selection = descentDraw([target], feePerByte, coins, change)
          break
        case 'singleRandomDraw':
          selection = singleRandomDraw([target], feePerByte, coins, change, seed)
          break
        case 'branchAndBound':
          selection = branchAndBound([target], feePerByte, coins, change, seed)
          break
        default:
          selection = EMPTY_SELECTION
          break
      }

      return assoc('selection', selection, state)
    }
    default:
      return state
  }
}
