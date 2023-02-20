/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'

import { getStep } from '../selectors'
import { actions } from '../slice'
import { base, counter } from '../test-utils/makeAccountStub'
import { proceedToSwapConfirmation } from './proceedToSwapConfirmation'

const sampleAmount = '100'
const sampleAmountAfterProcess = '10000000000'
const stepAfterProcess = 'PREVIEW_SWAP'

describe('proceedToSwapConfirmation', () => {
  describe('when there are amount and base and counter', () => {
    it('should navigate to preview step', () => {
      return expectSaga(
        proceedToSwapConfirmation,
        actions.proceedToSwapConfirmation({
          amount: sampleAmount,
          base,
          counter
        })
      )
        .provide([[matchers.select(getStep), stepAfterProcess]])
        .put.like({
          action: {
            payload: {
              step: stepAfterProcess
            },
            type: actions.setStep.type
          }
        })
        .silentRun()
    })

    it('should start quote refresh', () => {
      return expectSaga(
        proceedToSwapConfirmation,
        actions.proceedToSwapConfirmation({
          amount: sampleAmount,
          base,
          counter
        })
      )
        .provide([[matchers.select(getStep), stepAfterProcess]])
        .put(
          actions.startPollQuote({
            amount: sampleAmountAfterProcess,
            base,
            counter
          })
        )
        .silentRun()
    })
  })
})
