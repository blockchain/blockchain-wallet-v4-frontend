/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'

import { actions as cacheActions } from 'data/cache/slice'

import {
  getBsCheckoutFormValues,
  getBSPair,
  getBSPaymentMethod,
  getFiatCurrency
} from '../selectors'
import { actions } from '../slice'
import { makeAccountStub } from '../test-utils/makeAccountStub'
import { makePairStub } from '../test-utils/makePairStub'
import { proceedToSellConfirmation } from './proceedToSellConfirmation'

const pairStub = makePairStub()
const accountStub = makeAccountStub()
const valuesStub = {
  amount: '100',
  cryptoAmount: '100'
}

describe('proceedToSellConfirmation', () => {
  describe('when there are no pair', () => {
    it('should navigate to crypto selection', () => {
      return expectSaga(
        proceedToSellConfirmation,
        actions.proceedToSellConfirmation({
          account: accountStub
        })
      )
        .provide([
          [matchers.select(getBSPair), undefined],
          [matchers.select(getBsCheckoutFormValues), undefined],
          [matchers.select(getFiatCurrency), undefined]
        ])
        .put.like({
          action: {
            payload: {
              step: 'CRYPTO_SELECTION'
            },
            type: actions.setStep.type
          }
        })
        .silentRun()
    })
  })

  describe('when there are no value', () => {
    it('should navigate to crypto selection', () => {
      return expectSaga(
        proceedToSellConfirmation,
        actions.proceedToSellConfirmation({
          account: accountStub
        })
      )
        .provide([
          [matchers.select(getBSPair), pairStub],
          [matchers.select(getBsCheckoutFormValues), undefined],
          [matchers.select(getBSPaymentMethod), undefined]
        ])
        .put.like({
          action: {
            payload: {
              pair: pairStub,
              step: 'SELL_ENTER_AMOUNT'
            },
            type: actions.setStep.type
          }
        })
        .silentRun()
    })
  })

  it('should navigate to confirmation step and cache amount', () => {
    return expectSaga(
      proceedToSellConfirmation,
      actions.proceedToSellConfirmation({
        account: accountStub
      })
    )
      .provide([
        [matchers.select(getBSPair), pairStub],
        [matchers.select(getBsCheckoutFormValues), valuesStub]
      ])
      .put(
        actions.setStep({
          step: 'PREVIEW_SELL'
        })
      )
      .put(
        cacheActions.setLastUnusedAmount({
          amount: valuesStub.amount,
          pair: pairStub.pair
        })
      )
      .silentRun()
  })

  describe('when it is not a mobile payment', () => {
    it('should start quote refresh', () => {
      return expectSaga(
        proceedToSellConfirmation,
        actions.proceedToSellConfirmation({
          account: accountStub
        })
      )
        .provide([
          [matchers.select(getBSPair), pairStub],
          [matchers.select(getBsCheckoutFormValues), valuesStub]
        ])
        .put(
          actions.startPollSellQuote({
            account: accountStub,
            amount: '10000000000',
            pair: pairStub.pair
          })
        )
        .silentRun()
    })
  })
})
