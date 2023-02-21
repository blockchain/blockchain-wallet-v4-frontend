import { put, select } from 'typed-redux-saga'

import { getFiatCurrency } from '../selectors'
import { actions } from '../slice'

export const returnToCryptoSelection = function* () {
  const fiatCurrency = yield* select(getFiatCurrency)

  yield* put(
    actions.setStep({
      // Always reset back to walletCurrency, otherwise FUNDS currency and Pairs currency can mismatch.
      fiatCurrency: fiatCurrency || 'USD',
      step: 'CRYPTO_SELECTION'
    })
  )
}
