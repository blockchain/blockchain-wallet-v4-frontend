import { put } from 'typed-redux-saga'

import { convertStandardToBase } from 'data/components/exchange/services'

import { actions } from '../slice'

export const proceedToSwapConfirmation = function* ({
  payload
}: ReturnType<typeof actions.proceedToSwapConfirmation>) {
  const { amount, base, counter } = payload

  yield* put(actions.stopPollQuotePrice({}))

  yield* put(
    actions.setStep({
      options: {
        baseAccountType: base.type,
        baseCoin: base.coin,
        counterAccountType: counter.type,
        counterCoin: counter.coin
      },
      step: 'PREVIEW_SWAP'
    })
  )

  yield* put(
    actions.startPollQuote({
      amount: convertStandardToBase(base.coin, amount),
      base,
      counter
    })
  )
}
