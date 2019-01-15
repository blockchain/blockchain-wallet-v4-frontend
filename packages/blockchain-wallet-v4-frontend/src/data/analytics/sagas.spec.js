import { testSaga } from 'redux-saga-test-plan'
import * as actions from '../actions'
import analyticsSagas, { logLocation } from './sagas'
import { getAllBalances } from 'data/balance/sagas'

const api = {
  incrementCurrencyUsageStats: jest.fn()
}

describe('analyticsSagas', () => {
  describe('reportBalanceStats', () => {
    let { reportBalanceStats } = analyticsSagas({ api })
    const btc = {}
    const bch = {}
    const eth = {}
    const xlm = {}

    let saga = testSaga(reportBalanceStats)

    it('should call getAllBalances', () => {
      saga.next().call(getAllBalances)
    })

    it('should call api.incrementCurrencyUsageStats', () => {
      saga
        .next({
          btc,
          eth,
          bch,
          xlm
        })
        .call(api.incrementCurrencyUsageStats, btc, eth, bch, xlm)
    })

    describe('error handling', () => {
      let { reportBalanceStats } = analyticsSagas({ api })

      let saga = testSaga(reportBalanceStats)
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'reportBalanceStats',
              error
            )
          )
      })
    })
  })
})
