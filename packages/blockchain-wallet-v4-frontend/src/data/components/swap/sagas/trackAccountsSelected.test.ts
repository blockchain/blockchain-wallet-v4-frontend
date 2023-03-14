/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan'

import { trackEvent } from 'data/analytics/slice'
import { Analytics } from 'data/analytics/types'
import { SwapBaseCounterTypes } from 'data/components/swap/types'

import { actions } from '../slice'
import { trackAccountsSelected } from './trackAccountsSelected'

describe('trackAccountsSelected', () => {
  describe('when set step is not ENTER_AMOUNT', () => {
    it('should complete without tracking', () => {
      return expectSaga(
        trackAccountsSelected,
        actions.setStep({
          step: 'NO_HOLDINGS'
        })
      )
        .not.put.like({
          action: { type: trackEvent.type }
        })
        .returns(undefined)
        .silentRun()
    })
  })

  describe('when form state is not complete', () => {
    it('should complete without tracking', () => {
      return expectSaga(
        trackAccountsSelected,
        actions.setStep({
          step: 'ENTER_AMOUNT'
        })
      )
        .withState({
          form: {
            initSwap: {
              values: {}
            }
          }
        })
        .not.put.like({
          action: { type: trackEvent.type }
        })
        .returns(undefined)
        .silentRun()
    })
  })

  describe('when set step is ENTER_AMOUNT and form state is complete', () => {
    const completeState = {
      form: {
        initSwap: {
          values: {
            BASE: {
              coin: 'ETH',
              type: SwapBaseCounterTypes.ACCOUNT
            },
            COUNTER: {
              coin: 'USDC',
              type: SwapBaseCounterTypes.CUSTODIAL
            }
          }
        }
      }
    }

    const payloadProperties = {
      input_currency: 'ETH',
      input_type: 'USERKEY',
      output_currency: 'USDC',
      output_type: 'TRADING',
      was_suggested: false
    }

    it('should dispatch tracking action', () => {
      return expectSaga(
        trackAccountsSelected,
        actions.setStep({
          step: 'ENTER_AMOUNT'
        })
      )
        .withState(completeState)
        .put(
          trackEvent({
            key: Analytics.SWAP_ACCOUNTS_SELECTED,
            properties: payloadProperties
          })
        )
        .silentRun()
    })

    describe('and when it is suggested pair', () => {
      it('should dispatch tracking actions indicating that it is suggested pair', () => {
        return expectSaga(
          trackAccountsSelected,
          actions.setStep({
            isSuggestedPair: true,
            step: 'ENTER_AMOUNT'
          })
        )
          .withState(completeState)
          .put(
            trackEvent({
              key: Analytics.SWAP_ACCOUNTS_SELECTED,
              properties: {
                ...payloadProperties,
                was_suggested: true
              }
            })
          )
          .silentRun()
      })
    })
  })
})
