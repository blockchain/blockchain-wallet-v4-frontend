import { put } from 'typed-redux-saga'

import { actions } from 'data'

import { actions as swapActions } from '../slice'

export const returnToInitSwap = function* () {
  yield* put(swapActions.stopPollQuotePrice({}))
  yield* put(actions.form.change('swapAmount', 'cryptoAmount', '0'))
  yield* put(
    swapActions.setStep({
      step: 'INIT_SWAP'
    })
  )
}
