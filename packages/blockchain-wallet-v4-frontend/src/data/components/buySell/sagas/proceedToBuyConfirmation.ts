import { call, put, select } from 'typed-redux-saga'

import { BSPairType, MobilePaymentType } from '@core/network/api/buySell/types'
import { Coin, errorHandler } from '@core/utils'
import { actions as cacheActions } from 'data/cache/slice'
import { convertStandardToBase } from 'data/components/exchange/services'
import { getApi } from 'data/utils/sagas/getApi'
import { isNabuError } from 'services/errors'
import { notReachable } from 'utils/helpers'

import { getFiatFromPair } from '../model'
import * as S from '../selectors'
import { actions } from '../slice'
import { returnToBuyEnterAmount } from './returnToBuyEnterAmount'
import { returnToCryptoSelection } from './returnToCryptoSelection'

const isMobilePayment = (
  mobilePaymentMethod?: MobilePaymentType
): mobilePaymentMethod is MobilePaymentType => mobilePaymentMethod !== undefined

/**
 * @throws
 */
const initialiseMobilePayment = function* ({
  mobilePaymentMethod,
  pair
}: {
  mobilePaymentMethod: MobilePaymentType
  pair: BSPairType
}) {
  const api = yield* getApi()
  const fiat = getFiatFromPair(pair.pair)

  switch (mobilePaymentMethod) {
    case MobilePaymentType.APPLE_PAY:
      const applePayInfo = yield* call(api.getApplePayInfo, fiat)

      yield* put(actions.setApplePayInfo(applePayInfo))

      return applePayInfo
    case MobilePaymentType.GOOGLE_PAY:
      const googlePayInfo = yield* call(api.getGooglePayInfo, fiat)

      yield* put(actions.setGooglePayInfo(googlePayInfo))

      return googlePayInfo
    default:
      return notReachable(mobilePaymentMethod)
  }
}

const reportFailure = function* (e: unknown) {
  const errorPayload = isNabuError(e) ? e : errorHandler(e)
  yield* put(actions.fetchBuyQuoteFailure(errorPayload))
}

export const proceedToBuyConfirmation = function* ({
  payload
}: ReturnType<typeof actions.proceedToBuyConfirmation>) {
  const { mobilePaymentMethod, paymentMethodId, paymentType } = payload
  const pairObject = yield* select(S.getBSPair)
  const values = yield* select(S.getBsCheckoutFormValues)

  if (!pairObject) {
    return yield* call(returnToCryptoSelection)
  }

  if (!values?.amount) {
    return yield* call(returnToBuyEnterAmount, actions.returnToBuyEnterAmount({ pair: pairObject }))
  }

  yield* put(actions.setStep({ step: 'CHECKOUT_CONFIRM' }))

  yield* put(
    cacheActions.setLastUnusedAmount({
      amount: values.amount,
      pair: pairObject.pair
    })
  )

  try {
    const buyQuoteInputPayload = {
      amount: convertStandardToBase(Coin.FIAT, values.amount),
      pairObject,
      paymentMethod: paymentType,
      paymentMethodId
    }

    if (isMobilePayment(mobilePaymentMethod)) {
      const mobilePaymentInfo = yield* initialiseMobilePayment({
        mobilePaymentMethod,
        pair: pairObject
      })

      buyQuoteInputPayload.paymentMethodId = mobilePaymentInfo.beneficiaryID
    }

    yield* put(actions.startPollBuyQuote(buyQuoteInputPayload))
  } catch (e) {
    yield* reportFailure(e)
  }
}
