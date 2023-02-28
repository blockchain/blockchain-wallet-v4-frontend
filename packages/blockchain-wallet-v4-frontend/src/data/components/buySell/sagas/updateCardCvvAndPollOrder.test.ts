import { expectSaga } from 'redux-saga-test-plan'

import { updateCardCvvAndPollOrder } from 'data/components/buySell/sagas/updateCardCvvAndPollOrder'
import { actions as A } from 'data/components/buySell/slice'

const PAYLOAD = {
  cvv: '123',
  paymentId: '123-456-789'
}

describe('updateCardCvvAndPollOrder', () => {
  // eslint-disable-next-line jest/expect-expect
  it('should update the card cvv with provided payload', () => {
    return expectSaga(updateCardCvvAndPollOrder, A.updateCardCvvAndPollOrder(PAYLOAD))
      .put(A.updateCardCvv(PAYLOAD))
      .silentRun()
  })

  describe('then', () => {
    describe('when cvv update failed', () => {
      // eslint-disable-next-line jest/expect-expect
      it('should return undefined', () => {
        return expectSaga(updateCardCvvAndPollOrder, A.updateCardCvvAndPollOrder(PAYLOAD))
          .provide({
            race: () => ({ failure: true })
          })
          .returns(undefined)
          .silentRun()
      })
    })

    describe('when cvv update succeeded', () => {
      // eslint-disable-next-line jest/expect-expect
      it('should poll the order id', () => {
        return expectSaga(updateCardCvvAndPollOrder, A.updateCardCvvAndPollOrder(PAYLOAD))
          .provide({
            put({ action }, next) {
              if (action.type === A.updateCardCvv.type) {
                return
              }

              return next()
            },
            race: () => ({ success: true })
          })
          .put(A.pollOrder({ orderId: PAYLOAD.paymentId }))
          .silentRun()
      })
    })
  })
})
