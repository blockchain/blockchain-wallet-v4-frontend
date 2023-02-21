import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'

import {
  ApplePayInfoType,
  BSPaymentTypes,
  GooglePayInfoType,
  MobilePaymentType
} from '@core/network/api/buySell/types'
import { actions as cacheActions } from 'data/cache/slice'

import {
  getBsCheckoutFormValues,
  getBSPair,
  getBSPaymentMethod,
  getFiatCurrency
} from '../selectors'
import { actions } from '../slice'
import { makePairStub } from '../test-utils/makePairStub'
import { proceedToBuyConfirmation } from './proceedToBuyConfirmation'

const makeGooglePayInfoStub = (): GooglePayInfoType =>
  ({
    beneficiaryID: 'GOOGLE_PAY_BENEFICIARY_ID'
  } as any)
const makeApplePayInfoStub = (): ApplePayInfoType =>
  ({
    beneficiaryID: 'APPLE_PAY_BENEFICIARY_ID'
  } as any)

const pairStub = makePairStub()
const valuesStub = {
  amount: '100'
}

describe('proceedToBuyConfirmation', () => {
  describe('when there are no pair', () => {
    it('should navigate to crypto selection', () => {
      return expectSaga(
        proceedToBuyConfirmation,
        actions.proceedToBuyConfirmation({
          mobilePaymentMethod: undefined,
          paymentMethodId: undefined,
          paymentType: BSPaymentTypes.FUNDS
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
        proceedToBuyConfirmation,
        actions.proceedToBuyConfirmation({
          mobilePaymentMethod: undefined,
          paymentMethodId: undefined,
          paymentType: BSPaymentTypes.FUNDS
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
              step: 'ENTER_AMOUNT'
            },
            type: actions.setStep.type
          }
        })
        .silentRun()
    })
  })

  it('should navigate to confirmation step and cache amount', () => {
    return expectSaga(
      proceedToBuyConfirmation,
      actions.proceedToBuyConfirmation({
        mobilePaymentMethod: undefined,
        paymentMethodId: undefined,
        paymentType: BSPaymentTypes.FUNDS
      })
    )
      .provide([
        [matchers.select(getBSPair), pairStub],
        [matchers.select(getBsCheckoutFormValues), valuesStub]
      ])
      .put(
        actions.setStep({
          step: 'CHECKOUT_CONFIRM'
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
        proceedToBuyConfirmation,
        actions.proceedToBuyConfirmation({
          mobilePaymentMethod: undefined,
          paymentMethodId: undefined,
          paymentType: BSPaymentTypes.FUNDS
        })
      )
        .provide([
          [matchers.select(getBSPair), pairStub],
          [matchers.select(getBsCheckoutFormValues), valuesStub]
        ])
        .put(
          actions.startPollBuyQuote({
            amount: '10000',
            pairObject: pairStub,
            paymentMethod: BSPaymentTypes.FUNDS,
            paymentMethodId: undefined
          })
        )
        .silentRun()
    })
  })

  describe('when it is mobile payment', () => {
    describe('and it is Google Pay', () => {
      it('should set Google Pay info and start quote refresh using beneficiary id as payment method id', () => {
        const gPayStub = makeGooglePayInfoStub()

        return expectSaga(
          proceedToBuyConfirmation,
          actions.proceedToBuyConfirmation({
            mobilePaymentMethod: MobilePaymentType.GOOGLE_PAY,
            paymentMethodId: 'PAYMENT_ID',
            paymentType: BSPaymentTypes.PAYMENT_CARD
          })
        )
          .provide([
            [matchers.select(getBSPair), pairStub],
            [matchers.select(getBsCheckoutFormValues), valuesStub],
            [
              matchers.getContext('api'),
              {
                getGooglePayInfo: async () => gPayStub
              }
            ]
          ])
          .put(actions.setGooglePayInfo(gPayStub))
          .put(
            actions.startPollBuyQuote({
              amount: '10000',
              pairObject: pairStub,
              paymentMethod: BSPaymentTypes.PAYMENT_CARD,
              paymentMethodId: 'GOOGLE_PAY_BENEFICIARY_ID'
            })
          )
          .silentRun()
      })
    })

    describe('and it is Apple Pay', () => {
      it('should set Google Pay info and start quote refresh using beneficiary id as payment method id', () => {
        const applePayStub = makeApplePayInfoStub()

        return expectSaga(
          proceedToBuyConfirmation,
          actions.proceedToBuyConfirmation({
            mobilePaymentMethod: MobilePaymentType.APPLE_PAY,
            paymentMethodId: 'PAYMENT_ID',
            paymentType: BSPaymentTypes.PAYMENT_CARD
          })
        )
          .provide([
            [matchers.select(getBSPair), pairStub],
            [matchers.select(getBsCheckoutFormValues), valuesStub],
            [
              matchers.getContext('api'),
              {
                getApplePayInfo: async () => applePayStub
              }
            ]
          ])
          .put(actions.setApplePayInfo(applePayStub))
          .put(
            actions.startPollBuyQuote({
              amount: '10000',
              pairObject: pairStub,
              paymentMethod: BSPaymentTypes.PAYMENT_CARD,
              paymentMethodId: 'APPLE_PAY_BENEFICIARY_ID'
            })
          )
          .silentRun()
      })
    })

    describe('and when mobile payment initialisation fails', () => {
      it('should dispatch quote as failed and not start quote refresh', () => {
        return expectSaga(
          proceedToBuyConfirmation,
          actions.proceedToBuyConfirmation({
            mobilePaymentMethod: MobilePaymentType.APPLE_PAY,
            paymentMethodId: 'PAYMENT_ID',
            paymentType: BSPaymentTypes.PAYMENT_CARD
          })
        )
          .provide([
            [matchers.select(getBSPair), pairStub],
            [matchers.select(getBsCheckoutFormValues), valuesStub],
            [
              matchers.getContext('api'),
              {
                getApplePayInfo: async () => {
                  throw new Error('Apple payment initialisation failed')
                }
              }
            ]
          ])
          .put(actions.fetchBuyQuoteFailure('Apple payment initialisation failed'))
          .not.put.like({
            action: { type: actions.startPollBuyQuote.type }
          })
          .silentRun()
      })
    })
  })
})
