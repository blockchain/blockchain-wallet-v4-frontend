import { call, put, select } from 'typed-redux-saga'

import { BSCardType, BSOrderType } from '@core/types'
import { BuyQuoteStateType } from 'data/components/buySell/types'
import { getApi } from 'data/utils/sagas/getApi'

import { getBsCheckoutFormValues } from '../selectors'
import { actions } from '../slice'
import { assembleBuyOrderInputDto } from '../utils/assembleBuyOrderInputDto'

type FundsOrMobilePaymentPayload = {
  quoteState: BuyQuoteStateType
}

type OtherPaymentTypePayload = {
  paymentMethodId: BSCardType['id']
  quoteState: BuyQuoteStateType
}

type Payload = FundsOrMobilePaymentPayload | OtherPaymentTypePayload

const stopQuoteRefresh = function* () {
  yield* put(actions.stopPollBuyQuote())
}

const isOtherPaymentPayload = (payload: Payload): payload is OtherPaymentTypePayload =>
  'paymentMethodId' in payload && payload.paymentMethodId !== undefined

export const createOrder = function* (payload: Payload) {
  const paymentMethodId = isOtherPaymentPayload(payload) ? payload.paymentMethodId : undefined
  const formValues = yield* select(getBsCheckoutFormValues)
  const orderInputDto = assembleBuyOrderInputDto({
    paymentMethodId,
    period: formValues?.period,
    quoteState: payload.quoteState
  })

  const api = yield* getApi()
  return yield* call(api.createOrder, orderInputDto)
}

const cacheCreatedOrderAsPending = function* ({ order }: { order: BSOrderType }) {
  return yield* put(actions.cachePendingOrder(order))
}

export const createBuyOrder = function* (payload: Payload) {
  yield* stopQuoteRefresh()

  const order = yield* createOrder(payload)

  yield* cacheCreatedOrderAsPending({ order })

  return order
}
