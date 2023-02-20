/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'

import { CoinType } from '@core/types'

import { getStep } from '../selectors'
import { actions } from '../slice'
import { makeAccount } from '../test-utils/makeAccount'
import { proceedToSwapConfirmation } from './proceedToSwapConfirmation'

const amountStub = '100'
const expectedAmount = '10000000000'
const nextStep = 'PREVIEW_SWAP'

const baseDummy = {
  ...makeAccount(),
  baseCoin: 'BTC',
  coin: 'BTC' as CoinType
}

const counterDummy = {
  ...makeAccount(),
  baseCoin: 'ETH',
  coin: 'ETH' as CoinType
}

describe('proceedToSwapConfirmation', () => {
  describe('when there are amount and base and counter', () => {
    it('should stop quote price refresh', () => {
      return expectSaga(
        proceedToSwapConfirmation,
        actions.proceedToSwapConfirmation({
          amount: amountStub,
          base: baseDummy,
          counter: counterDummy
        })
      )
        .put(actions.stopPollQuotePrice({}))
        .silentRun()
    })

    it('should navigate to preview step', () => {
      return expectSaga(
        proceedToSwapConfirmation,
        actions.proceedToSwapConfirmation({
          amount: amountStub,
          base: baseDummy,
          counter: counterDummy
        })
      )
        .provide([[matchers.select(getStep), nextStep]])
        .put.like({
          action: {
            payload: {
              step: nextStep
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
          amount: amountStub,
          base: baseDummy,
          counter: counterDummy
        })
      )
        .provide([[matchers.select(getStep), nextStep]])
        .put(
          actions.startPollQuote({
            amount: expectedAmount,
            base: baseDummy,
            counter: counterDummy
          })
        )
        .silentRun()
    })
  })
})
