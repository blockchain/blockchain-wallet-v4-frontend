import { testSaga } from 'redux-saga-test-plan'
import * as actions from '../actions'
import * as actionTypes from '../actionTypes'
import analyticsSagas, { logLocation } from './sagas'
import {
  LAYOUT_WALLET_HEADER_FAQ_CLICKED,
  LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED
} from '../components/layoutWallet/actionTypes'
import { getAllBalances } from 'data/balance/sagas'

const api = {
  incrementCurrencyUsageStats: jest.fn(),
  logClick: jest.fn(),
  logSfoxDropoff: jest.fn()
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

  describe('logClick', () => {
    describe('walletLayout actions FAQ', () => {
      let { logClick } = analyticsSagas({ api })
      let payload = { type: LAYOUT_WALLET_HEADER_FAQ_CLICKED }
      let saga = testSaga(logClick, payload)

      it('should call api.logClick with faq', () => {
        saga.next().call(api.logClick, 'faq')
      })
    })
    describe('walletLayout actions WHATSNEW', () => {
      let { logClick } = analyticsSagas({ api })
      let payload = { type: LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED }
      let saga = testSaga(logClick, payload)

      it('should call api.logClick with whatsnew', () => {
        saga.next().call(api.logClick, 'whatsnew')
      })
    })
    describe('called with a name', () => {
      let { logClick } = analyticsSagas({ api })
      let payload = { name: 'send' }
      let saga = testSaga(logClick, {
        type: actionTypes.analytics.LOG_CLICK,
        payload: { name: 'send' }
      })

      it('should call api.logClick with the name', () => {
        const { name } = payload
        saga.next().call(api.logClick, name)
      })
    })

    describe('error handling', () => {
      let { logClick } = analyticsSagas({ api })
      let payload = { type: LAYOUT_WALLET_HEADER_FAQ_CLICKED }
      let saga = testSaga(logClick, payload)
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'logClick', error))
      })
    })
  })

  describe('logSfoxDropoff', () => {
    let { logSfoxDropoff } = analyticsSagas({ api })
    let payload = { step: 'funding' }
    let saga = testSaga(logSfoxDropoff, { payload })

    it('should call api.logSfoxDropoff with the step', () => {
      saga.next().call(api.logSfoxDropoff, 'funding')
    })

    describe('error handling', () => {
      let { logSfoxDropoff } = analyticsSagas({ api })
      let payload = { step: 'funding' }
      let saga = testSaga(logSfoxDropoff, { payload })
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'logSfoxDropoff', error)
          )
      })
    })
  })
})
