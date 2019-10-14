import * as AT from './actionTypes'
import { assocPath } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

import { AB_TESTS } from './model'

const INITIAL_STATE = {
  ab_tests: {
    [AB_TESTS.PIT_SIDE_NAV_TEST3]: Remote.NotAsked,
    [AB_TESTS.WALLET_PIT_SIGNUP]: Remote.NotAsked
  }
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.CREATE_AB_TEST: {
      return assocPath(['ab_tests', payload.test], Remote.Loading, state)
    }
    case AT.CREATE_AB_TEST_SUCCESS: {
      return assocPath(
        ['ab_tests', payload.test],
        Remote.Success(payload.result),
        state
      )
    }
    default: {
      return state
    }
  }
}
