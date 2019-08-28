import { testSaga } from 'redux-saga-test-plan'
import { Remote } from 'blockchain-wallet-v4/src'
import * as actions from '../actions'
import * as actionTypes from '../actionTypes'
import * as selectors from '../selectors.js'
import {
  getEthBalance,
  getBtcBalance,
  getBchBalance,
  getXlmBalance,
  logLocation
} from './sagas'

jest.mock('blockchain-wallet-v4/src/redux/sagas')

describe('balanceSagas', () => {
  describe('getEthBalance', () => {
    describe('balance is Loading', () => {
      let saga = testSaga(getEthBalance)
      it('should select the eth balance', () => {
        saga.next().select(selectors.core.data.eth.getBalance)
      })

      it('should take the next success action if Remote is not success', () => {
        let balance = Remote.Loading
        saga
          .next(balance)
          .take([
            actionTypes.core.data.eth.FETCH_ETH_DATA_SUCCESS,
            actionTypes.core.data.eth.FETCH_ETH_DATA_FAILURE
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
        saga.next().select(selectors.core.data.eth.getBalance)
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
        saga.next().select(selectors.core.data.btc.getBalance)
      })

      it('should take the next success action if Remote is not success', () => {
        let balance = Remote.Loading
        saga
          .next(balance)
          .take([
            actionTypes.core.data.btc.FETCH_BTC_DATA_SUCCESS,
            actionTypes.core.data.btc.FETCH_BTC_DATA_FAILURE
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
        saga.next().select(selectors.core.data.btc.getBalance)
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
