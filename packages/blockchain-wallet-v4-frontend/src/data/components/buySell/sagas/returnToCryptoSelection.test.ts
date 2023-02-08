import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'

import { getFiatCurrency } from 'data/components/buySell/selectors'

import { actions } from '../slice'
import { returnToCryptoSelection } from './returnToCryptoSelection'

describe('returnToCryptoSelection', () => {
  describe('when fiatCurrent exists in state', () => {
    it('should dispatch setStep with it in payload', () => {
      const fiatCurrency = 'EUR'

      return expectSaga(returnToCryptoSelection)
        .provide([[matchers.select(getFiatCurrency), fiatCurrency]])
        .put(
          actions.setStep({
            fiatCurrency,
            step: 'CRYPTO_SELECTION'
          })
        )
        .silentRun()
    })
  })

  describe('when fiatCurrent does not exist in state', () => {
    it('should dispatch setStep with USD in payload', () => {
      return expectSaga(returnToCryptoSelection)
        .provide([[matchers.select(getFiatCurrency), undefined]])
        .put(
          actions.setStep({
            fiatCurrency: 'USD',
            step: 'CRYPTO_SELECTION'
          })
        )
        .silentRun()
    })
  })
})
