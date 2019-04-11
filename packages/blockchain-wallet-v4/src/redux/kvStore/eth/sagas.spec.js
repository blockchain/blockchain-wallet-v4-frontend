import Bitcoin from 'bitcoinjs-lib'
import { testSaga } from 'redux-saga-test-plan'
import { KVStoreEntry } from '../../../types'
import * as A from './actions'
import eth from './sagas'
import { walletV3 } from '../../../../data'
import { derivationMap, ETH } from '../config'
import { set } from 'ramda-lens'

const api = {
  fetchKVStore: () => {}
}
const networks = { btc: Bitcoin.networks['bitcoin'] }
const ethKvStoreSagas = eth({ api, networks })
const typeId = derivationMap[ETH]
const { accounts } = walletV3.hd_wallets[0]
const { xpriv } = accounts[0]
const { createEth, createNewErc20Entry, deriveAccount } = ethKvStoreSagas

const mockKvStoreEntry = KVStoreEntry.fromMetadataXpriv(
  xpriv,
  typeId,
  networks.btc
)

const mockNewEthEntry = {
  has_seen: true,
  default_account_idx: 0,
  accounts: [
    {
      label: 'My Ether Wallet',
      archived: false,
      correct: true,
      addr: '0xc8bECCD34B3bd13bE21941f7598843931F4E45Ab'
    }
  ],
  tx_notes: {},
  last_tx: null,
  legacy_account: null,
  last_tx_timestamp: null,
  erc20: {
    label: 'My USD Pax Wallet',
    contract: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    has_seen: false,
    tx_notes: {}
  }
}

const newkv = set(
  KVStoreEntry.value,
  { ethereum: mockNewEthEntry },
  mockKvStoreEntry
)

describe('kvStore eth sagas', () => {
  describe('createEth', () => {
    it('creates a valid eth metadata entry', () => {
      const saga = testSaga(createEth, { kv: mockKvStoreEntry })
      saga
        .next()
        .call(deriveAccount, undefined)
        .next({
          defaultIndex: 0,
          addr: '0xc8bECCD34B3bd13bE21941f7598843931F4E45Ab'
        })
        .call(createNewErc20Entry)
        .next({
          label: 'My USD Pax Wallet',
          contract: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
          has_seen: false,
          tx_notes: {}
        })
        .put(A.createMetadataEth(newkv))
        .next()
        .isDone()
    })
  })
})
