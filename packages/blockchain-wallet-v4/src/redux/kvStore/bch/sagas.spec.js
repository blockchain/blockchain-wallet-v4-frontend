import * as A from './actions'
import * as bchActions from '../../data/bch/actions'
import * as Bitcoin from 'bitcoinjs-lib'
import { BCH, derivationMap } from '../config'
import { getHDAccounts } from '../../wallet/selectors'
import { getMetadataXpriv } from '../root/selectors'
import { KVStoreEntry } from '../../../types'
import { set } from 'ramda-lens'
import { testSaga } from 'redux-saga-test-plan'
import { walletV3 } from '../../../../data'
import bch from './sagas'

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
  ],
  addresses: {}
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
        .put(bchActions.fetchData())
        .next()
        .isDone()
    })
  })
  describe('fetchMetadataBch', () => {
    const saga = testSaga(fetchMetadataBch)
    it('fetches users metadata', () => {
      saga
        .next()
        .select(getMetadataXpriv)
        .next(xpriv)
        .put(A.fetchMetadataBchLoading())
        // callTask is undefined
        // .next()
        // .call(api.fetchKVStore(mockKvStoreEntry))
        .next()
        .save('before fetch')
        .next(newkv)
        .select(getHDAccounts)
        .next(accounts)
        .put(A.fetchMetadataBchSuccess(newkv))
    })
    it('creates entry if value is empty', () => {
      const nullKv = set(KVStoreEntry.value, null, mockKvStoreEntry)
      saga
        .restore('before fetch')
        .next(nullKv)
        .select(getHDAccounts)
        .next(accounts)
        .call(createBch, nullKv, accounts, [])
    })
    it('sets fail state', () => {
      saga
        .restore('before fetch')
        .throw({ message: 'failed to fetch' })
        .put(A.fetchMetadataBchFailure('failed to fetch'))
    })
  })
})
