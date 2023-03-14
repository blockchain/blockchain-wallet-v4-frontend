import { call, put, select } from 'typed-redux-saga'

import { errorHandler } from '@core/utils'
import { actions as cacheActions } from 'data/cache/slice'
import { convertStandardToBase } from 'data/components/exchange/services'
import { isNabuError } from 'services/errors'

import { getCoinFromPair } from '../model'
import * as S from '../selectors'
import { actions } from '../slice'
import { returnToCryptoSelection } from './returnToCryptoSelection'
import { returnToSellEnterAmount } from './returnToSellEnterAmount'

const reportFailure = function* (e: unknown) {
  const errorPayload = isNabuError(e) ? e : errorHandler(e)
  yield* put(actions.fetchBuyQuoteFailure(errorPayload))
}

export const proceedToSellConfirmation = function* ({
  payload
}: ReturnType<typeof actions.proceedToSellConfirmation>) {
  const { account } = payload
  const pairObject = yield* select(S.getBSPair)
  const values = yield* select(S.getBsCheckoutFormValues)

  if (!pairObject) {
    return yield* call(returnToCryptoSelection)
  }

  if (!values?.amount) {
    return yield* call(
      returnToSellEnterAmount,
      actions.returnToSellEnterAmount({ pair: pairObject })
    )
  }

  yield* put(actions.setStep({ step: 'PREVIEW_SELL' }))

  yield* put(
    cacheActions.setLastUnusedAmount({
      amount: values.amount,
      pair: pairObject.pair
    })
  )

  const coin = getCoinFromPair(pairObject.pair)

  try {
    const sellQuoteInputPayload = {
      account,
      amount: convertStandardToBase(coin, values.cryptoAmount),
      pair: pairObject.pair
    }

    yield* put(actions.stopPollSellQuotePrice({}))
    yield* put(actions.startPollSellQuote(sellQuoteInputPayload))
  } catch (e) {
    yield* reportFailure(e)
  }
}
