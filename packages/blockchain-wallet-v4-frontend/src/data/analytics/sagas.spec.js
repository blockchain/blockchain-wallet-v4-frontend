import { createMockTask } from 'redux-saga/utils'
import { testSaga } from 'redux-saga-test-plan'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as actions from '../actions'
import * as actionTypes from '../actionTypes'
import * as selectors from '../selectors.js'
import analyticsSagas, { logLocation } from './sagas'
import {
  LAYOUT_WALLET_HEADER_FAQ_CLICKED,
  LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED
} from '../components/layoutWallet/actionTypes'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()

const api = {
  incrementCurrencyUsageStats: jest.fn(),
  logClick: jest.fn()
}

describe('analyticsSagas', () => {
  describe('reportBalanceStats', () => {
    let {
      reportBalanceStats,
      getEthBalance,
      getBtcBalance,
      getBchBalance
    } = analyticsSagas({ coreSagas, api })

    let saga = testSaga(reportBalanceStats)

    const btcTask = createMockTask()
    const ethTask = createMockTask()
    const bchTask = createMockTask()

    it('should fork getEthBalance', () => {
      saga.next().fork(getEthBalance)
    })

    it('should fork getBtcBalance', () => {
      saga.next(ethTask).fork(getBtcBalance)
    })

    it('should fork getBchBalance', () => {
      saga.next(btcTask).fork(getBchBalance)
    })

    it('should join the btc Task', () => {
      saga.next(bchTask).join(btcTask)
    })

    it('should join the eth Task', () => {
      saga.next().join(ethTask)
    })

    it('should join the bch Task', () => {
      saga.next().join(bchTask)
    })

    it('should call api.incrementCurrencyUsageStats', () => {
      saga
        .next()
        .call(
          api.incrementCurrencyUsageStats,
          btcTask.value,
          ethTask.value,
          bchTask.value
        )
    })

    describe('error handling', () => {
      let { reportBalanceStats } = analyticsSagas({ coreSagas, api })

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

  describe('getEthBalance', () => {
    describe('balance is Loading', () => {
      let { getEthBalance } = analyticsSagas({ coreSagas, api })

      let saga = testSaga(getEthBalance)
      it('should select the eth balance', () => {
        saga.next().select(selectors.core.data.ethereum.getBalance)
      })

      it('should take the next success action if Remote is not success', () => {
        let balance = Remote.Loading
        saga
          .next(balance)
          .take(actionTypes.core.data.ethereum.FETCH_ETHEREUM_DATA_SUCCESS)
      })

      it('should return the data', () => {
        let action = { payload: { info: { final_balance: 1000 } } }
        saga.next(action).returns(1000)
      })
    })

    describe('balance is not loading', () => {
      let { getEthBalance } = analyticsSagas({ coreSagas, api })

      let saga = testSaga(getEthBalance)
      it('should select the eth balance', () => {
        saga.next().select(selectors.core.data.ethereum.getBalance)
      })
      it('should return the balance', () => {
        saga.next(Remote.Success(1000)).returns(1000)
      })
    })
    describe('error handling', () => {
      let { getEthBalance } = analyticsSagas({ coreSagas, api })

      let saga = testSaga(getEthBalance)
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'getEthBalance', error)
          )
      })
    })
  })

  describe('getBtcBalance', () => {
    describe('balance is Loading', () => {
      let { getBtcBalance } = analyticsSagas({ coreSagas, api })

      let saga = testSaga(getBtcBalance)
      it('should select the btc balance', () => {
        saga.next().select(selectors.core.data.bitcoin.getBalance)
      })

      it('should take the next success action if Remote is not success', () => {
        let balance = Remote.Loading
        saga
          .next(balance)
          .take(actionTypes.core.data.bitcoin.FETCH_BITCOIN_DATA_SUCCESS)
      })

      it('should return the data', () => {
        let action = { payload: { info: { final_balance: 100 } } }
        saga.next(action).returns(100)
      })
    })

    describe('balance is not loading', () => {
      let { getBtcBalance } = analyticsSagas({ coreSagas, api })

      let saga = testSaga(getBtcBalance)
      it('should select the btc balance', () => {
        saga.next().select(selectors.core.data.bitcoin.getBalance)
      })
      it('should return the balance', () => {
        saga.next(Remote.Success(100)).returns(100)
      })
    })
    describe('error handling', () => {
      let { getBtcBalance } = analyticsSagas({ coreSagas, api })

      let saga = testSaga(getBtcBalance)
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'getBtcBalance', error)
          )
      })
    })
  })

  describe('getBchBalance', () => {
    describe('balance is Loading', () => {
      let { getBchBalance } = analyticsSagas({ coreSagas, api })

      let saga = testSaga(getBchBalance)
      it('should select the bch balance', () => {
        saga.next().select(selectors.core.data.bch.getBalance)
      })

      it('should take the next success action if Remote is not success', () => {
        let balance = Remote.Loading
        saga
          .next(balance)
          .take(actionTypes.core.data.bch.FETCH_BCH_DATA_SUCCESS)
      })

      it('should return the data', () => {
        let action = { payload: { info: { final_balance: 100 } } }
        saga.next(action).returns(100)
      })
    })

    describe('balance is not loading', () => {
      let { getBchBalance } = analyticsSagas({ coreSagas, api })

      let saga = testSaga(getBchBalance)
      it('should select the Bch balance', () => {
        saga.next().select(selectors.core.data.bch.getBalance)
      })
      it('should return the balance', () => {
        saga.next(Remote.Success(100)).returns(100)
      })
    })
    describe('error handling', () => {
      let { getBchBalance } = analyticsSagas({ coreSagas, api })

      let saga = testSaga(getBchBalance)
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'getBchBalance', error)
          )
      })
    })
  })

  describe('logLeftNavClick', () => {
    let makePayload = name => {
      return { event: { persist: jest.fn(), target: { textContent: name } } }
    }
    describe('Dashboard clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Dashboard')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with dashboard', () => {
        saga.next().call(api.logClick, 'dashboard')
      })
    })
    describe('Bitcoin clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Bitcoin')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with btc', () => {
        saga.next().call(api.logClick, 'btc')
      })
    })
    describe('Ether clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Ether')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with eth', () => {
        saga.next().call(api.logClick, 'eth')
      })
    })
    describe('Bitcoin Cash clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Bitcoin Cash')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with bch', () => {
        saga.next().call(api.logClick, 'bch')
      })
    })
    describe('Buy Sell clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Buy & Sell')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with buysell', () => {
        saga.next().call(api.logClick, 'buysell')
      })
    })
    describe('Exchange clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Exchange')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with exchange', () => {
        saga.next().call(api.logClick, 'exchange')
      })
    })
    describe('Security Center clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Security Center')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with security', () => {
        saga.next().call(api.logClick, 'security')
      })
    })
    describe('Settings clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Settings')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with settings', () => {
        saga.next().call(api.logClick, 'settings')
      })
    })
    describe('Settings/General clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('General')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with settings_general', () => {
        saga.next().call(api.logClick, 'settings_general')
      })
    })
    describe('Settings/Profile clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Profile')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with settings_profile', () => {
        saga.next().call(api.logClick, 'settings_profile')
      })
    })
    describe('Settings/Preferences clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Preferences')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with settings_preferences', () => {
        saga.next().call(api.logClick, 'settings_preferences')
      })
    })
    describe('Settings/Wallets clicked', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Wallets & Addresses')
      let saga = testSaga(logLeftNavClick, payload)

      it('should call api.logClick with settings_wallets', () => {
        saga.next().call(api.logClick, 'settings_wallets')
      })
    })
    describe('error handling', () => {
      let { logLeftNavClick } = analyticsSagas({ coreSagas, api })
      let payload = makePayload('Dashboard')
      let saga = testSaga(logLeftNavClick, payload)
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'logLeftNavClick', error)
          )
      })
    })
  })

  describe('logClick', () => {
    describe('walletLayout actions FAQ', () => {
      let { logClick } = analyticsSagas({ coreSagas, api })
      let payload = { type: LAYOUT_WALLET_HEADER_FAQ_CLICKED }
      let saga = testSaga(logClick, payload)

      it('should call api.logClick with faq', () => {
        saga.next().call(api.logClick, 'faq')
      })
    })
    describe('walletLayout actions WHATSNEW', () => {
      let { logClick } = analyticsSagas({ coreSagas, api })
      let payload = { type: LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED }
      let saga = testSaga(logClick, payload)

      it('should call api.logClick with whatsnew', () => {
        saga.next().call(api.logClick, 'whatsnew')
      })
    })
    describe('called with a name', () => {
      let { logClick } = analyticsSagas({ coreSagas, api })
      let payload = { name: 'send' }
      let saga = testSaga(logClick, payload)

      it('should call api.logClick with the name', () => {
        const { name } = payload
        saga.next().call(api.logClick, name)
      })
    })

    describe('error handling', () => {
      let { logClick } = analyticsSagas({ coreSagas, api })
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
})
