import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { combineReducers } from 'redux'
import { concat, init, last, repeat } from 'ramda'

import { model } from 'data'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import exchangeHistoryReducer from 'data/components/exchangeHistory/reducers'
import { pollTimeout } from 'data/components/exchangeHistory/sagas'
import { canUseExchange } from 'data/components/exchange/selectors'
import exchangeHistorySagas from 'data/components/exchangeHistory/sagaRegister'
import { getTrades } from 'blockchain-wallet-v4/src/redux/kvStore/shapeShift/selectors'
import settingsReducer from 'blockchain-wallet-v4/src/redux/settings/reducers'
import {
  userFlowSupported,
  isUserActive,
  isUserVerified
} from 'data/modules/profile/selectors'

import LazyLoadContainer from 'components/LazyLoadContainer'
import ExchangeHistory from './index'
import Loader from './template.loading'
import Empty from './Empty'
import TradeItem from './List/TradeItem'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

jest.mock('data/components/exchange/selectors')
jest.mock('blockchain-wallet-v4/src/redux/sagas')
jest.mock('data/modules/profile/selectors')
jest.mock('blockchain-wallet-v4/src/redux/kvStore/shapeShift/selectors')
isUserActive.mockReturnValue(Remote.of(true))
isUserVerified.mockReturnValue(Remote.of(true))
userFlowSupported.mockReturnValue(Remote.of(true))
getTrades.mockReturnValue(Remote.of([]))
canUseExchange.mockReturnValue(true)

const { RESULTS_MODAL } = model.components.exchangeHistory
const fetchTimeout = 100
const coreSagas = coreSagasFactory({ api: {} })
const FINISHED_TRADE = {
  id: '039267ab-de16-4093-8cdf-a7ea1c732dbd',
  state: 'FINISHED',
  createdAt: '2018-09-19T12:20:42.894Z',
  updatedAt: '2018-09-19T12:24:18.943Z',
  pair: 'ETH-BTC',
  refundAddress: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
  rate: '0.1',
  depositAddress: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
  deposit: {
    symbol: 'ETH',
    value: '100.0'
  },
  withdrawalAddress: '3H4w1Sqk8UNNEfZoa9Z8FZJ6RYHrxLmzGU',
  withdrawal: {
    symbol: 'BTC',
    value: '10.0'
  },
  withdrawalFee: {
    symbol: 'BTC',
    value: '0.0000001'
  },
  fiatValue: {
    symbol: 'GBP',
    value: '10.0'
  },
  depositTxHash:
    'e6a5cfee8063330577babb6fb92eabccf5c3c1aeea120c550b6779a6c657dfce',
  withdrawalTxHash:
    '0xf902adc8862c6c6ad2cd06f12d952e95c50ad783bae50ef952e1f54b7762a50e'
}
const UNFINISHED_TRADE = {
  id: '039267ab-de16-4093-8cdf-a7ea1c732dbd',
  state: 'PENDING_DEPOSIT',
  createdAt: '2018-09-19T12:20:42.894Z',
  updatedAt: '2018-09-19T12:20:42.894Z',
  pair: 'ETH-BTC',
  refundAddress: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
  rate: '0.1',
  depositAddress: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
  deposit: {
    symbol: 'ETH',
    value: '100.0'
  },
  withdrawalAddress: '3H4w1Sqk8UNNEfZoa9Z8FZJ6RYHrxLmzGU',
  withdrawal: {
    symbol: 'BTC',
    value: '10.0'
  },
  withdrawalFee: {
    symbol: 'BTC',
    value: '0.0000001'
  },
  fiatValue: {
    symbol: 'GBP',
    value: '10.0'
  },
  depositTxHash: null,
  withdrawalTxHash: null
}
const UPDATED_TRADE = {
  id: '039267ab-de16-4093-8cdf-a7ea1c732dbd',
  state: 'PENDING_WITHDRAWAL',
  createdAt: '2018-09-19T12:20:42.894Z',
  updatedAt: '2018-09-19T12:21:32.683Z',
  pair: 'ETH-BTC',
  refundAddress: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
  rate: '0.1',
  depositAddress: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
  deposit: {
    symbol: 'ETH',
    value: '100.0'
  },
  withdrawalAddress: '3H4w1Sqk8UNNEfZoa9Z8FZJ6RYHrxLmzGU',
  withdrawal: {
    symbol: 'BTC',
    value: '10.0'
  },
  withdrawalFee: {
    symbol: 'BTC',
    value: '0.0000001'
  },
  fiatValue: {
    symbol: 'GBP',
    value: '10.0'
  },
  depositTxHash:
    'e6a5cfee8063330577babb6fb92eabccf5c3c1aeea120c550b6779a6c657dfce',
  withdrawalTxHash: null
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
    }),
    settingsPath: settingsReducer
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
