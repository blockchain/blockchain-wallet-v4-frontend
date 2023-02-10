import { expectSaga } from 'redux-saga-test-plan'

import { BSPaymentTypes } from '@core/network/api/buySell/types'
import { createBuyQuoteLoopAndWaitForFirstResult } from 'data/components/buySell/sagas/createBuyQuoteLoopAndWaitForFirstResult'
import { actions as A } from 'data/components/buySell/slice'

const PAYLOAD = {
  amount: '5',
  pair: 'GBP-BTC',
  paymentMethod: BSPaymentTypes.FUNDS,
  paymentMethodId: undefined
}

const EXPECTED_RETURN = undefined

describe('createBuyQuoteLoopAndWaitForFirstResult', () => {
  it('should start buy quote poll with provided payload', () => {
    return expectSaga(createBuyQuoteLoopAndWaitForFirstResult, PAYLOAD)
      .put(A.startPollBuyQuote(PAYLOAD))
      .silentRun()
  })

  it('should wait for quote success or failure', () => {
    return expectSaga(createBuyQuoteLoopAndWaitForFirstResult, PAYLOAD)
      .not.returns(EXPECTED_RETURN)
      .silentRun()
  })

  describe('then', () => {
    describe('when quote fetch failed', () => {
      it('should complete', () => {
        return expectSaga(createBuyQuoteLoopAndWaitForFirstResult, PAYLOAD)
          .provide({
            race: () => ({ type: A.fetchBuyQuoteFailure.type })
          })
          .returns(EXPECTED_RETURN)
          .silentRun()
      })
    })

    describe('when quote fetch succeeded', () => {
      it('should complete', () => {
        return expectSaga(createBuyQuoteLoopAndWaitForFirstResult, PAYLOAD)
          .provide({
            race: () => ({
              type: A.fetchBuyQuoteSuccess.type
            })
          })
          .returns(EXPECTED_RETURN)
          .silentRun()
      })
    })
  })
})
