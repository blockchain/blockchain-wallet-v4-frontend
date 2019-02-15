import { createMockTask } from 'redux-saga/utils'
import { testSaga } from 'redux-saga-test-plan'
import { Remote } from 'blockchain-wallet-v4/src'
import * as actions from '../actions'
import * as actionTypes from '../actionTypes'
import * as selectors from '../selectors.js'
import {
  getAllBalances,
  getEthBalance,
  getBtcBalance,
  getBchBalance,
  getXlmBalance,
  logLocation
} from './sagas'

jest.mock('blockchain-wallet-v4/src/redux/sagas')

describe('analyticsSagas', () => {
  describe('reportBalanceStats', () => {
    let saga = testSaga(getAllBalances)

    const btcTask = createMockTask()
    const ethTask = createMockTask()
    const bchTask = createMockTask()
    const xlmTask = createMockTask()
    const btc = {}
    const bch = {}
    const eth = {}
    const xlm = {}

    it('should fork getEthBalance', () => {
      saga.next().fork(getEthBalance)
    })

    it('should fork getBtcBalance', () => {
      saga.next(ethTask).fork(getBtcBalance)
    })

    it('should fork getBchBalance', () => {
      saga.next(btcTask).fork(getBchBalance)
    })

    it('should fork getXlmBalance', () => {
      saga.next(bchTask).fork(getXlmBalance)
    })

    it('should join the btc Task', () => {
      saga.next(xlmTask).join(btcTask)
    })

    it('should join the eth Task', () => {
      saga.next(btc).join(ethTask)
    })

    it('should join the bch Task', () => {
      saga.next(eth).join(bchTask)
    })

    it('should join the xlm Task', () => {
      saga.next(bch).join(xlmTask)
    })

    it('should return all balances', () => {
      saga
        .next(xlm)
        .returns({ btc, bch, eth, xlm })
        .next()
        .isDone()
    })
  })

  describe('getEthBalance', () => {
    describe('balance is Loading', () => {
      let saga = testSaga(getEthBalance)
      it('should select the eth balance', () => {
        saga.next().select(selectors.core.data.ethereum.getBalance)
      })

      it('should take the next success action if Remote is not success', () => {
        let balance = Remote.Loading
        saga
          .next(balance)
          .take([
            actionTypes.core.data.ethereum.FETCH_ETHEREUM_DATA_SUCCESS,
            actionTypes.core.data.ethereum.FETCH_ETHEREUM_DATA_FAILURE
          ])
      })

      it('should return the data', () => {
        let action = { payload: { info: { final_balance: 1000 } } }
        saga.next(action).returns(1000)
      })
    })

    describe('balance is not loading', () => {
      let saga = testSaga(getEthBalance)
      it('should select the eth balance', () => {
        saga.next().select(selectors.core.data.ethereum.getBalance)
      })
      it('should return the balance', () => {
        saga.next(Remote.Success(1000)).returns(1000)
      })
    })
    describe('error handling', () => {
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
      let saga = testSaga(getBtcBalance)
      it('should select the btc balance', () => {
        saga.next().select(selectors.core.data.bitcoin.getBalance)
      })

      it('should take the next success action if Remote is not success', () => {
        let balance = Remote.Loading
        saga
          .next(balance)
          .take([
            actionTypes.core.data.bitcoin.FETCH_BITCOIN_DATA_SUCCESS,
            actionTypes.core.data.bitcoin.FETCH_BITCOIN_DATA_FAILURE
          ])
      })

      it('should return the data', () => {
        let action = { payload: { info: { final_balance: 100 } } }
        saga.next(action).returns(100)
      })
    })

    describe('balance is not loading', () => {
      let saga = testSaga(getBtcBalance)
      it('should select the btc balance', () => {
        saga.next().select(selectors.core.data.bitcoin.getBalance)
      })
      it('should return the balance', () => {
        saga.next(Remote.Success(100)).returns(100)
      })
    })
    describe('error handling', () => {
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
      let saga = testSaga(getBchBalance)
      it('should select the bch balance', () => {
        saga.next().select(selectors.core.data.bch.getBalance)
      })

      it('should take the next success action if Remote is not success', () => {
        let balance = Remote.Loading
        saga
          .next(balance)
          .take([
            actionTypes.core.data.bch.FETCH_BCH_DATA_SUCCESS,
            actionTypes.core.data.bch.FETCH_BCH_DATA_FAILURE
          ])
      })

      it('should return the data', () => {
        let action = { payload: { info: { final_balance: 100 } } }
        saga.next(action).returns(100)
      })
    })
    describe('balance is not loading', () => {
      let saga = testSaga(getBchBalance)
      it('should select the Bch balance', () => {
        saga.next().select(selectors.core.data.bch.getBalance)
      })
      it('should return the balance', () => {
        saga.next(Remote.Success(100)).returns(100)
      })
    })
    describe('error handling', () => {
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

  describe('getXlmBalance', () => {
    describe('balance is Loading', () => {
      let saga = testSaga(getXlmBalance)
      it('should select the bch balance', () => {
        saga.next().select(selectors.core.data.xlm.getTotalBalance)
      })

      it('should take the next success action if Remote is not success', () => {
        let balance = Remote.Loading
        saga.next(balance).take(actionTypes.core.data.xlm.FETCH_DATA_SUCCESS)
      })

      it('should return the data', () => {
        let action = { payload: { info: { final_balance: 100 } } }
        saga.next(action).returns(100)
      })
    })
    describe('balance is not loading', () => {
      let saga = testSaga(getXlmBalance)
      it('should select the Bch balance', () => {
        saga.next().select(selectors.core.data.xlm.getTotalBalance)
      })
      it('should return the balance', () => {
        saga.next(Remote.Success(100)).returns(100)
      })
    })
    describe('error handling', () => {
      let saga = testSaga(getXlmBalance)
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'getXlmBalance', error)
          )
      })
    })
  })
})
