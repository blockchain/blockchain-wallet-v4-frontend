import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { combineReducers } from 'redux'
import { concat, init, last, repeat } from 'ramda'

import { model } from 'data'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import exchangeHistoryReducer from 'data/components/exchangeHistory/reducers'
import { pollTimeout } from 'data/components/exchangeHistory/sagas'
import exchangeHistorySagas from 'data/components/exchangeHistory/sagaRegister'
import { getTrades } from 'blockchain-wallet-v4/src/redux/kvStore/shapeShift/selectors'
import { userFlowSupported, isUserActive } from 'data/modules/profile/selectors'

import LazyLoadContainer from 'components/LazyLoadContainer'
import ExchangeHistory from './index'
import Loader from './template.loading'
import Empty from './Empty'
import TradeItem from './List/TradeItem'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

jest.mock('blockchain-wallet-v4/src/redux/sagas')
jest.mock('data/modules/profile/selectors')
jest.mock('blockchain-wallet-v4/src/redux/kvStore/shapeShift/selectors')
isUserActive.mockReturnValue(true)
userFlowSupported.mockReturnValue(Remote.of(true))
getTrades.mockReturnValue(Remote.of([]))

const { RESULTS_MODAL } = model.components.exchangeHistory
const fetchTimeout = 100
const coreSagas = coreSagasFactory({ api: {} })
const FINISHED_TRADE = {
  id: 'ede39566-1f0d-4e48-96fa-b558b70e46b8',
  createdAt: '2018-07-30T13:45:57.890Z',
  updatedAt: '2018-07-30T13:45:57.890Z',
  pair: 'BTC-ETH',
  quantity: '0.1337',
  currency: 'ETH',
  refundAddress: '1Refund6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
  price: '0.06',
  depositAddress: '1Deposit6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
  depositQuantity: '0.008022',
  withdrawalAddress: '0xwithdrawa7d398351b8be11c439e05c5b3259aec9b',
  withdrawalQuantity: '0.1337',
  depositTxHash:
    'e6a5cfee8063330577babb6fb92eabccf5c3c1aeea120c550b6779a6c657dfce',
  withdrawalTxHash:
    '0xcc34f317a2fc8fb318777ea2529dfaf2ad9338907637137c3ec7d614abe7557f',
  state: 'FINISHED'
}
const UNFINISHED_TRADE = {
  id: 'ede39566-1f0d-4e48-96fa-b558b70e46b7',
  createdAt: '2018-07-30T13:45:57.890Z',
  updatedAt: '2018-07-30T13:45:57.890Z',
  pair: 'BTC-ETH',
  quantity: '0.1337',
  currency: 'ETH',
  refundAddress: '1Refund6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
  price: '0.06',
  depositAddress: '1Deposit6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
  depositQuantity: '0.008022',
  withdrawalAddress: '0xwithdrawa7d398351b8be11c439e05c5b3259aec9b',
  withdrawalQuantity: '0.1337',
  depositTxHash:
    'e6a5cfee8063330577babb6fb92eabccf5c3c1aeea120c550b6779a6c657dfce',
  state: 'PENDING_DEPOSIT'
}
const UPDATED_TRADE = {
  id: 'ede39566-1f0d-4e48-96fa-b558b70e46b7',
  createdAt: '2018-07-30T13:45:57.890Z',
  updatedAt: '2018-07-30T13:45:57.890Z',
  pair: 'BTC-ETH',
  quantity: '0.1337',
  currency: 'ETH',
  refundAddress: '1Refund6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
  price: '0.06',
  depositAddress: '1Deposit6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
  depositQuantity: '0.008022',
  withdrawalAddress: '0xwithdrawa7d398351b8be11c439e05c5b3259aec9b',
  withdrawalQuantity: '0.1337',
  depositTxHash:
    'e6a5cfee8063330577babb6fb92eabccf5c3c1aeea120c550b6779a6c657dfce',
  state: 'PENDING_WITHDRAWAL'
}
const STUB_TRADES = concat(
  repeat(FINISHED_TRADE, 10),
  repeat(UNFINISHED_TRADE, 10)
)

const api = {
  fetchTrades: jest.fn(() => STUB_TRADES),
  fetchTrade: jest.fn(() => ({
    id: ''
  }))
}

const STUB_SHAPESHIFT_TRADES = repeat(
  {
    hashIn: '547cdc62121b22ae25dbb3de41f93e6793e1820e8793bcf3f550d8a19922e960',
    timestamp: 1536702645291,
    status: 'complete',
    quote: {
      orderId: 'ea40c355-4fec-41a0-8f3f-ffa630b647ab',
      quotedRate: '34.03679468',
      deposit: '33MVJBrMhs7zdcU2mUZNqRqaJZGrJQcV2X',
      minerFee: '0.00176',
      pair: 'btc_eth',
      depositAmount: 0.00015884,
      withdrawal: '0x9291eaebf8f644ba9bfea254636c7bfa58433051',
      withdrawalAmount: '0.0036464'
    }
  },
  5
)

describe('ExchangeHistory', () => {
  const reducers = {
    spy: spyReducer,
    components: combineReducers({
      exchangeHistory: exchangeHistoryReducer
    })
  }
  const sagas = [exchangeHistorySagas({ coreSagas, api })]
  let store
  let wrapper
  beforeEach(() => {
    dispatchSpy.mockClear()
    api.fetchTrades.mockClear()
    api.fetchTrade.mockClear()
    store = createTestStore(reducers, sagas)
    wrapper = mount(
      <TestBed withRouter={true} store={store}>
        <ExchangeHistory />
      </TestBed>
    )
  })

  describe('Initialization', () => {
    it('should show a loader while trades are loading', async () => {
      api.fetchTrades.mockImplementationOnce(
        () =>
          new Promise(resolve => setTimeout(() => resolve([]), fetchTimeout))
      )
      wrapper.unmount().mount()
      expect(wrapper.find(Loader)).toHaveLength(1)
      await jest.advanceTimersByTime(fetchTimeout)
      wrapper.update()
      expect(wrapper.find(Loader)).toHaveLength(0)
    })

    it('should trigger trades fetch', () => {
      expect(api.fetchTrades).toHaveBeenCalledTimes(1)
    })

    it('should show empty page when no trades are loaded', async () => {
      api.fetchTrades.mockReturnValueOnce([])
      wrapper.unmount().mount()
      expect(wrapper.find(Empty)).toHaveLength(1)
    })

    it('should show trades after they are loaded', async () => {
      expect(wrapper.find(TradeItem)).toHaveLength(STUB_TRADES.length)
    })
  })

  describe('Pagination', () => {
    it('should load trades on scroll to bottom', () => {
      wrapper.find(LazyLoadContainer).prop('onLazyLoad')()
      expect(api.fetchTrades).toHaveBeenCalledTimes(2)
      wrapper.update()
      expect(wrapper.find(TradeItem)).toHaveLength(STUB_TRADES.length * 2)
    })

    it('should attach shapeshift trades when exchange trades are finished', () => {
      const lastTrades = init(STUB_TRADES)
      api.fetchTrades.mockReturnValueOnce(lastTrades)
      getTrades.mockReturnValue(Remote.of(STUB_SHAPESHIFT_TRADES))
      wrapper.find(LazyLoadContainer).prop('onLazyLoad')()
      expect(api.fetchTrades).toHaveBeenCalledTimes(2)
      wrapper.update()
      expect(wrapper.find(TradeItem)).toHaveLength(
        STUB_TRADES.length + lastTrades.length + STUB_SHAPESHIFT_TRADES.length
      )
    })
  })

  describe('Polling', () => {
    it('should poll for incomplete trades', async () => {
      const incompleteTradesLength = STUB_TRADES.length / 2
      expect(api.fetchTrade).toHaveBeenCalledTimes(incompleteTradesLength)
      expect(api.fetchTrade).toHaveBeenCalledWith(last(STUB_TRADES).id)
      await jest.advanceTimersByTime(pollTimeout)
      expect(api.fetchTrade).toHaveBeenCalledTimes(incompleteTradesLength * 2)
      await jest.advanceTimersByTime(pollTimeout)
      expect(api.fetchTrade).toHaveBeenCalledTimes(incompleteTradesLength * 3)
    })

    it('should update trade during polling', async () => {
      api.fetchTrade.mockReturnValue(UPDATED_TRADE)
      await jest.advanceTimersByTime(pollTimeout)
      wrapper.update()
      expect(
        wrapper
          .find(TradeItem)
          .first()
          .prop('trade')
      ).toEqual(UPDATED_TRADE)
    })
  })

  describe('Details', () => {
    it('should show details modal upon view details click', () => {
      wrapper
        .find(TradeItem)
        .first()
        .find('Link')
        .prop('onClick')()
      expect(last(dispatchSpy.mock.calls)[0]).toMatchObject({
        type: 'SHOW_MODAL',
        payload: { type: RESULTS_MODAL }
      })
    })
  })
})
