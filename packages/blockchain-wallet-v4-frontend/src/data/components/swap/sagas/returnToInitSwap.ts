import { put } from 'typed-redux-saga'

import { actions } from '../slice'

export const returnToInitSwap = function* () {
  yield* put(actions.stopPollQuotePrice({}))
  yield* put(
    actions.setStep({
      step: 'INIT_SWAP'
    })
  )
}
