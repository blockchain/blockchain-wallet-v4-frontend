import { assoc } from 'ramda'
import * as A from './actionTypes'

const INITIAL_STATE = {}

export default (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case A.PAYMENT_GET_UNSPENTS_SUCCESS: {
      let coins = action.payload
      return assoc('coins', coins, state)
    }
    default:
      return state
  }
}
