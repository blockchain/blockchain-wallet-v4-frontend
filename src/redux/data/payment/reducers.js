import { assoc } from 'ramda'
import * as A from './actionTypes'

const INITIAL_STATE = { coins: [] }

export default (state = INITIAL_STATE, action) => {
  let { type } = action
  console.log(type)
  switch (type) {
    case A.PAYMENT_GET_UNSPENTS_SUCCESS: {
      const coins = action.payload
      console.log('reducer: ')
      console.log(coins)
      return Object.assign({}, state, { coins })

      // return assoc('coins', action.payload, state)
    }
    default:
      return state
  }
}
