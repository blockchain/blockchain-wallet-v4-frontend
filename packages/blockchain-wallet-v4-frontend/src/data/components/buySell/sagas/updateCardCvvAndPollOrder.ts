import { put, race, take } from 'typed-redux-saga'

import { actions as A } from '../slice'

export const updateCardCvvAndPollOrder = function* ({
  payload
}: ReturnType<typeof A.updateCardCvvAndPollOrder>) {
  yield* put(A.updateCardCvv(payload))

  const cvvUpdateResult = yield* race({
    failure: take(A.cvvStatusFailure.type),
    success: take(A.cvvStatusSuccess.type)
  })

  if (!cvvUpdateResult.success) return undefined

  yield* put(A.pollOrder({ orderId: payload.paymentId }))
}
