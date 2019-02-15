import Bitcoin from 'bitcoinjs-lib'
import { testSaga } from 'redux-saga-test-plan'
import { KVStoreEntry } from '../../../types'
import * as A from './actions'
import eth from './sagas'
import { walletV3 } from '../../../../data'
import { derivationMap, ETHEREUM } from '../config'
import { set } from 'ramda-lens'
import { getMetadataXpriv } from '../root/selectors'

const api = {
  fetchKVStore: () => {}
}
const networks = { btc: Bitcoin.networks['bitcoin'] }
const ethKvStoreSagas = eth({ api, networks })
const typeId = derivationMap[ETHEREUM]
const { accounts } = walletV3.hd_wallets[0]
const { xpriv } = accounts[0]
const askSecondPasswordEnhancer = () => () => 'pasSWord'
const { createEthereum, deriveAccount, fetchMetadataEthereum } = ethKvStoreSagas

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
  last_tx_timestamp: null
}

const newkv = set(
  KVStoreEntry.value,
  { ethereum: mockNewEthEntry },
  mockKvStoreEntry
)

describe('kvStore eth sagas', () => {
  describe('createEthereum', () => {
    it('creates a valid eth metadata entry', () => {
      const saga = testSaga(createEthereum, { kv: mockKvStoreEntry })
      saga
        .next()
        .call(deriveAccount, undefined)
        .next({
          defaultIndex: 0,
          addr: '0xc8bECCD34B3bd13bE21941f7598843931F4E45Ab'
        })
        .put(A.createMetadataEthereum(newkv))
        .next()
        .isDone()
    })
  })
  describe('fetchMetadataEthereum', () => {
    const saga = testSaga(fetchMetadataEthereum, askSecondPasswordEnhancer)
    it('fetches users metadata', () => {
      saga
        .next()
        .select(getMetadataXpriv)
        .next(xpriv)
        .put(A.fetchMetadataEthereumLoading())
        // callTask is undefined
        // .next()
        // .call(api.fetchKVStore(mockKvStoreEntry))
        .next()
        .save('before fetch')
        .next(newkv)
        .put(A.fetchMetadataEthereumSuccess(newkv))
    })
  })
})
