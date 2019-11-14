import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = {
  address: null
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.SET_ADDRESS: {
      return assoc('address', payload.address, state)
    }
  }
}
