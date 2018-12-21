import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { flushPromises } from 'utils/test.utils'
import { mount } from 'enzyme'
import { combineReducers } from 'redux'
import { actions, model } from 'data'

import {
  coreReducers,
  paths,
  coreSagasFactory,
  Remote
} from 'blockchain-wallet-v4/src'
import sendBtcReducer from 'data/components/sendBtc/reducers'

import modalsReducer from 'data/modals/reducers'
import sendBtcSaga from 'data/components/sendBtc/sagaRegister'
import settingsSagas from 'data/modules/settings/sagaRegister'
import SendBtc from './index'
import { last, values, pickAll, compose, head, curry } from 'ramda'

// SELECTORS
import { getCurrency, getSettings } from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { getRates as getBtcRates } from 'blockchain-wallet-v4/src/redux/data/btc/selectors'
import { getRates as getEthRates } from 'blockchain-wallet-v4/src/redux/data/eth/selectors'
import { getRates as getBchRates } from 'blockchain-wallet-v4/src/redux/data/bch/selectors'
import { getRates as getXlmRates } from 'blockchain-wallet-v4/src/redux/data/xlm/selectors'
import {
  getToToggled,
  getFeePerByteToggled,
  getPayment
} from 'data/components/sendBtc/selectors'
import {
  getActiveHDAccounts,
  getActiveAddresses,
  getActiveAccountsBalances,
  getAddressesBalances,
  getLockboxBtcBalances
} from 'blockchain-wallet-v4/src/redux/common/btc/selectors'
import {
  getDevices
} from 'blockchain-wallet-v4/src/redux/kvStore/lockbox/selectors'
import { getCoinAvailability, getBtcNetwork } from 'blockchain-wallet-v4/src/redux/walletOptions/selectors'

import { Form } from 'components/Form'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')
jest.mock('blockchain-wallet-v4/src/redux/walletOptions/selectors')
jest.mock('data/components/sendBtc/selectors')
jest.mock('blockchain-wallet-v4/src/redux/common/btc/selectors')
jest.mock('blockchain-wallet-v4/src/redux/kvStore/lockbox/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/btc/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/eth/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/bch/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/xlm/selectors')

const networks = {
  btc: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  }
}
const coreSagas = coreSagasFactory({ api: {}, networks })
const api = {}

const paymentMock = {
  change: '123changeaddress',
  coins: [{ value: 10000 }],
  effectiveBalance: 100000,
  fee: 5,
  fees: { regular: 5, priority: 25, limits: { max: 30, min: 2 } },
  from: [
    'xpub6Cw9c97kckjdTay1mZDRmcNAN5M3xnExCwpH7dS7nwcm5SN69E7AhoZnaaldsjffhnvCDRse234roasdfFZtVsUj4gxzJTG33N'
  ],
  fromAccountIdx: 0,
  fromType: 'ACCOUNT'
}

const btcAccountsMock = [
  {
    index: 0,
    label: 'My Bitcoin Wallet',
    xpub: 'xpub6Cw9c97kckjdTay1mZDRmcNAN5M3xnExCwpH7dS7nwcm5SN69E7AhoZnaaldsjffhnvCDRse234roasdfFZtVsUj4gxzJTG33N',
    info: {
      account_index: 1,
      change_index: 1,
      final_balance: 100000
    }
  }
]

const addressesMock = [
  {
    addr: '1LPdummZYKMmZ8FkFHzdSGtrFkvgGs7hcE',
    tag: 0,
    created_device_name: 'wallet-web',
    created_device_version: 'v4',
    info: {
      account_index: 0,
      change_index: 0,
      final_balance: 0
    }
  }
]

const accountBalanceMock = [
  {
    balance: 71687,
    coin: 'BTC',
    index: 0,
    label: 'My Bitcoin Wallet',
    network: undefined,
    type: 'ACCOUNT',
    xpub:
      'xpub6Cw9c97kckjdTay1mZDRmcNAN5M3xnExCwpH7dS7nwcm5SN69E7AhoZnaaldsjffhnvCDRse234roasdfFZtVsUj4gxzJTG33N'
  }
]

const ratesMock = {
  USD: {
    '15m': 100,
    last: 100,
    buy: 100,
    sell: 100,
    symbol: '$'
  }
}

const coinAvailability = {
  send: true,
  request: true,
  lockbox: true,
  exchange: true
}

const settingsMock = {
  currency: 'USD'
}

getToToggled.mockImplementation(() => false)
getFeePerByteToggled.mockImplementation(() => false)
getPayment.mockImplementation(() => Remote.of(paymentMock))
getActiveHDAccounts.mockImplementation(() => Remote.of(btcAccountsMock))
getActiveAddresses.mockImplementation(() => Remote.of(addressesMock))
getActiveAccountsBalances.mockImplementation(() => Remote.of(accountBalanceMock))
getDevices.mockImplementation(() => Remote.of([]))
getCoinAvailability.mockImplementation(curry((state, value) => Remote.of(coinAvailability)))
getBtcNetwork.mockImplementation(() => Remote.of('bitcoin'))
getAddressesBalances.mockImplementation(() => Remote.of(accountBalanceMock))
getLockboxBtcBalances.mockImplementation(() => Remote.of([]))
getBtcRates.mockImplementation(() => Remote.of(ratesMock))
getEthRates.mockImplementation(() => Remote.of(ratesMock))
getBchRates.mockImplementation(() => Remote.of(ratesMock))
getXlmRates.mockImplementation(() => Remote.of(ratesMock))
getCurrency.mockImplementation(() => Remote.of('USD'))
getSettings.mockImplementation(() => Remote.of(settingsMock))

describe('SendBtc Modal', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer,
    modals: modalsReducer,
    components: combineReducers({
      sendBtc: sendBtcReducer
    }),
    [paths.settingsPath]: coreReducers.settings
  }
  const sagas = [
    sendBtcSaga({ coreSagas, api }),
    settingsSagas({ coreSagas })
  ]
  let store
  let wrapper
  beforeEach(() => {
    store = createTestStore(reducers, sagas)
    wrapper = mount(
      <TestBed store={store}>
        <SendBtc />
      </TestBed>
    )
  })

  describe('Modal behaviour', () => {
    it('should render', () => {
      expect(wrapper.find(Form)).toHaveLength(1)
    })
  })
})
