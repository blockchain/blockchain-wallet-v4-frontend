import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { flushPromises } from 'utils/test.utils'
import { mount } from 'enzyme'
import { combineReducers } from 'redux'
import * as actionTypes from 'data/actionTypes'

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
import { curry, compose, head, values, pickAll } from 'ramda'

// SELECTORS
import {
  getCurrency,
  getSettings
} from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { getRates as getBtcRates } from 'blockchain-wallet-v4/src/redux/data/btc/selectors'
import { getRates as getEthRates } from 'blockchain-wallet-v4/src/redux/data/eth/selectors'
import { getRates as getBchRates } from 'blockchain-wallet-v4/src/redux/data/bch/selectors'
import { getRates as getXlmRates } from 'blockchain-wallet-v4/src/redux/data/xlm/selectors'
import { getRates as getBsvRates } from 'blockchain-wallet-v4/src/redux/data/bsv/selectors'
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
import { getDevices } from 'blockchain-wallet-v4/src/redux/kvStore/lockbox/selectors'
import {
  getCoinAvailability,
  getBtcNetwork
} from 'blockchain-wallet-v4/src/redux/walletOptions/selectors'

import { Form } from 'components/Form'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

jest.mock('blockchain-wallet-v4/src/redux/sagas')
jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')
jest.mock('blockchain-wallet-v4/src/redux/walletOptions/selectors')
jest.mock('data/components/sendBtc/selectors')
jest.mock('blockchain-wallet-v4/src/redux/common/btc/selectors')
jest.mock('blockchain-wallet-v4/src/redux/kvStore/lockbox/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/btc/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/eth/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/bch/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/xlm/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/bsv/selectors')

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

const paymentMock = {
  change: '123changeaddress',
  coins: [{ value: 10000 }],
  effectiveBalance: 100000,
  fee: 5,
  fees: { regular: 5, priority: 25, limits: { max: 30, min: 2 } },
  // from: [
  //   'xpub6Cw9c97kckjdTay1mZDRmcNAN5M3xnExCwpH7dS7nwcm5SN69E7AhoZnaaldsjffhnvCDRse234roasdfFZtVsUj4gxzJTG33N'
  // ],
  fromAccountIdx: 0,
  fromType: 'ACCOUNT',
  value: jest.fn(() => paymentMock),
  init: jest.fn(() => paymentMock),
  to: jest.fn(() => paymentMock),
  amount: jest.fn(() => paymentMock),
  from: jest.fn(() => paymentMock),
  build: jest.fn(() => paymentMock),
  buildSweep: jest.fn(() => paymentMock),
  sign: jest.fn(() => paymentMock),
  publish: jest.fn(() => paymentMock),
  description: jest.fn(() => paymentMock),
  chain: jest.fn()
}

const btcAccountsMock = [
  {
    index: 0,
    label: 'My Bitcoin Wallet',
    xpub:
      'xpub6Cw9c97kckjdTay1mZDRmcNAN5M3xnExCwpH7dS7nwcm5SN69E7AhoZnaaldsjffhnvCDRse234roasdfFZtVsUj4gxzJTG33N',
    info: {
      account_index: 1,
      change_index: 1,
      final_balance: 1000000
    }
  }
]

const addressesMock = []

const accountBalanceMock = [
  {
    balance: 701687,
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
    '15m': 4000,
    last: 4000,
    buy: 4000,
    sell: 4000,
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
getActiveAccountsBalances.mockImplementation(() =>
  Remote.of(accountBalanceMock)
)
getDevices.mockImplementation(() => Remote.of([]))
getCoinAvailability.mockImplementation(
  curry((state, value) => Remote.of(coinAvailability))
)
getBtcNetwork.mockImplementation(() => Remote.of('bitcoin'))
getAddressesBalances.mockImplementation(() => Remote.of(accountBalanceMock))
getLockboxBtcBalances.mockImplementation(() => Remote.of([]))
getBtcRates.mockImplementation(() => Remote.of(ratesMock))
getEthRates.mockImplementation(() => Remote.of(ratesMock))
getBchRates.mockImplementation(() => Remote.of(ratesMock))
getXlmRates.mockImplementation(() => Remote.of(ratesMock))
getBsvRates.mockImplementation(() => Remote.of(ratesMock))
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
    sendBtcSaga({ coreSagas, networks }),
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

  describe('Send Modal behaviour', () => {
    beforeEach(() => {
      coreSagas.payment.btc.create.mockImplementation(
        ({ payment, network }) => paymentMock
      )
      wrapper.update()
    })
    it('should render', async () => {
      expect(wrapper.find(Form)).toHaveLength(1)
      await flushPromises()
    })

    it('should trigger a payment update success action when the amount changes', async () => {
      wrapper.unmount().mount()
      wrapper
        .find('input[data-e2e="sendBtcFiatAmount"]')
        .simulate('change', { target: { value: '1' } })

      let pickIndex = compose(
        values,
        pickAll
      )
      let calls = dispatchSpy.mock.calls
      expect(head(pickIndex([calls.length - 2], calls)[0]).type).toEqual(
        actionTypes.components.sendBtc.SEND_BTC_PAYMENT_UPDATED_SUCCESS
      )
    })

    it('should enable the Continue button if all required fields have input', async () => {
      wrapper.unmount().mount()
      wrapper
        .find('input[data-e2e="sendBtcFiatAmount"]')
        .simulate('change', { target: { value: '0.5' } })
      wrapper
        .find('input[data-e2e="sendBtcAddressTextBox"]')
        .simulate('change', {
          target: { value: '14uvrESf3q9xpny1ERb6iXX8WZd9RTZwKZ' }
        })

      wrapper
        .find('Field[name="coin"]')
        .find('SelectBoxCoin')
        .prop('input')
        .onChange({ value: 'BTC' })

      wrapper
        .find('Field[name="from"]')
        .find('SelectBoxBtcAddresses')
        .prop('input')
        .onChange({ value: btcAccountsMock })

      await jest.runAllTimers()
      await flushPromises()
      wrapper.update()
      expect(
        wrapper
          .find('button')
          .first()
          .props().disabled
      ).toEqual(false)
    })
  })
})
