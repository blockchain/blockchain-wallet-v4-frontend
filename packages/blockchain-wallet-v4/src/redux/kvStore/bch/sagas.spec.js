import Bitcoin from 'bitcoinjs-lib'
import { testSaga } from 'redux-saga-test-plan'
import { KVStoreEntry } from '../../../types'
import * as A from './actions'
import bch from './sagas'
import { walletV3 } from '../../../../data'
import { derivationMap, BCH } from '../config'
import { set } from 'ramda-lens'
import { getMetadataXpriv } from '../root/selectors'
import { getHDAccounts } from '../../wallet/selectors'

const api = {
  fetchKVStore: () => {}
}
const networks = { btc: Bitcoin.networks['bitcoin'] }
const bchKvStoreSagas = bch({ api, networks })
const typeId = derivationMap[BCH]
const { accounts } = walletV3.hd_wallets[0]
const { xpriv } = accounts[0]

const { createBch, fetchMetadataBch } = bchKvStoreSagas

const mockKvStoreEntry = KVStoreEntry.fromMetadataXpriv(
  xpriv,
  typeId,
  networks.btc
)

const mockNewBchEntry = {
  default_account_idx: 0,
  accounts: [
    {
      label: 'My Bitcoin Cash Wallet',
      archived: false
    },
    {
      label: 'My Bitcoin Cash Wallet 2',
      archived: false
    }
  ]
}

const newkv = set(KVStoreEntry.value, mockNewBchEntry, mockKvStoreEntry)

describe('kvStore bch sagas', () => {
  describe('createBch', () => {
    it('creates a valid bch metadata entry', () => {
      const saga = testSaga(createBch, mockKvStoreEntry, accounts, [])
      saga
        .next()
        .put(A.createMetadataBch(newkv))
        .next()
        .next()
        .isDone()
    })
  })
  describe('fetchMetadataBch', () => {
    it('fetches users metadata', () => {
      const saga = testSaga(fetchMetadataBch)
      saga
        .next()
        .select(getMetadataXpriv)
        .next(xpriv)
        .put(A.fetchMetadataBchLoading())
        // callTask is undefined
        // .next()
        // .call(api.fetchKVStore(mockKvStoreEntry))
        .next()
        .next(newkv)
        .select(getHDAccounts)
        .next(accounts)
        .put(A.fetchMetadataBchSuccess(newkv))
    })
  })
})
