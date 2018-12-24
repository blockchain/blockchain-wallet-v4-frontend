import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { flushPromises } from 'utils/test.utils'
import { mount } from 'enzyme'
import {
  Remote
} from 'blockchain-wallet-v4/src'
import modalsReducer from 'data/modals/reducers'
import ImportedAddresses from './index'
import { Wrapper } from './template.success'

// SELECTORS
import { getSettings } from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { getRates as getBtcRates } from 'blockchain-wallet-v4/src/redux/data/btc/selectors'
import { getRates as getEthRates } from 'blockchain-wallet-v4/src/redux/data/eth/selectors'
import { getRates as getBchRates } from 'blockchain-wallet-v4/src/redux/data/bch/selectors'
import { getRates as getXlmRates } from 'blockchain-wallet-v4/src/redux/data/xlm/selectors'
import { getActiveAddresses } from 'blockchain-wallet-v4/src/redux/common/btc/selectors'
import { getAddresses } from 'blockchain-wallet-v4/src/redux/wallet/selectors'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')
jest.mock('blockchain-wallet-v4/src/redux/sagas')
jest.mock('blockchain-wallet-v4/src/redux/wallet/selectors')
jest.mock('blockchain-wallet-v4/src/redux/common/btc/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/btc/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/eth/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/bch/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/xlm/selectors')

const addressesMock = [
  {
    addr: '1LPdummZYKMmZ8FkFHzdSGtrFkvgGs7hcE',
    priv: '8PWyBPE5yv7sTzqsankIQwBJy17oELwmjV7CvEpk3kQ4',
    tag: 0,
    created_device_name: 'wallet-web',
    created_device_version: 'v4',
    info: {
      account_index: 0,
      address: '1LPdummZYKMmZ8FkFHzdSGtrFkvgGs7hcE',
      change_index: 0,
      final_balance: 0,
      n_tx: 0,
      total_received: 0,
      total_sent: 0
    }
  },
  {
    addr: '196u4ipqanJbfKanRPFbpLiPyvT6CEM7yG',
    label: null,
    priv: null,
    tag: 0,
    created_device_name: 'wallet-web',
    created_device_version: 'v4',
    info: {
      account_index: 0,
      address: '196u4ipqanJbfKanRPFbpLiPyvT6CEM7yG',
      change_index: 0,
      final_balance: 0,
      n_tx: 0,
      total_received: 0,
      total_sent: 0
    }
  }
]

const settingsMock = {
  currency: 'USD'
}

const ratesMock = {
  USD: {
    '15m': 1000,
    last: 1000,
    buy: 1000,
    sell: 1000,
    symbol: '$'
  }
}

getActiveAddresses.mockImplementation(() => Remote.of(addressesMock))
getAddresses.mockImplementation(() => Remote.of(addressesMock))
getSettings.mockImplementation(() => Remote.of(settingsMock))
getBtcRates.mockImplementation(() => Remote.of(ratesMock))
getEthRates.mockImplementation(() => Remote.of(ratesMock))
getBchRates.mockImplementation(() => Remote.of(ratesMock))
getXlmRates.mockImplementation(() => Remote.of(ratesMock))

describe('ImportedAddresses', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer,
    modals: modalsReducer
  }
  const sagas = []
  let store
  let wrapper
  beforeEach(() => {
    store = createTestStore(reducers, sagas)
    wrapper = mount(
      <TestBed store={store}>
        <ImportedAddresses />
      </TestBed>
    )
  })

  describe('Imported Addresses Component behaviour', () => {
    it('should render', async () => {
      expect(wrapper.find(Wrapper)).toHaveLength(1)
      await flushPromises()
    })

    it('should have a non-spendable label', async () => {
      expect(
        wrapper.containsMatchingElement(
          <span>Non-Spendable</span>
        )
      ).toBeTruthy()
    })
  })
})
