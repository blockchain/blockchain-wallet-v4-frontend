
import * as T from './actionTypes'

const INITIAL_STATE = []

const paymentRequestReducer = (state = INITIAL_STATE, action) => {
  const { type, paymentRequest } = action

  switch (type) {
    case T.STORE_PAYMENT_REQUEST: {
      let copy = Object.assign([], state)
      copy.push(paymentRequest)
      return copy
    }
    default: return state
  }
}

export default paymentRequestReducer
