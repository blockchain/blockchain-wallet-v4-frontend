import Bitcoin from 'bitcoinjs-lib'
import { testSaga } from 'redux-saga-test-plan'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, LOCKBOX } from '../config'
import * as A from './actions'
import lockbox from './sagas'
import { set } from 'ramda-lens'
import { walletV3 } from '../../../../data'

const api = {
  fetchKVStore: () => {}
}
const networks = { btc: Bitcoin.networks['bitcoin'] }
const lockboxKvStoreSagas = lockbox({ api, networks })
const typeId = derivationMap[LOCKBOX]
const { accounts } = walletV3.hd_wallets[0]
const { xpriv } = accounts[0]

const { createLockbox, fetchMetadataLockbox } = lockboxKvStoreSagas

const mockKvStoreEntry = KVStoreEntry.fromMetadataXpriv(
  xpriv,
  typeId,
  networks.btc
)

const mockNewLockboxEntry = {
  devices: []
}

const newkv = set(KVStoreEntry.value, mockNewLockboxEntry, mockKvStoreEntry)

describe('kvStore lockbox sagas', () => {
  describe('createLockbox', () => {
    it('creates a valid lockbox metadata entry', () => {
      const saga = testSaga(createLockbox, mockKvStoreEntry, accounts, [])
      saga
        .next()
        .put(A.createMetadataLockbox(newkv))
        .next()
        .next()
        .isDone()
    })
  })
  describe('fetchMetadataLockbox', () => {
    const saga = testSaga(fetchMetadataLockbox)
    it('fetches users metadata', () => {
      saga
        .next()
        .select(getMetadataXpriv)
        .next(xpriv)
        .put(A.fetchMetadataLockboxLoading())
        // callTask is undefined
        // .next()
        // .call(api.fetchKVStore(mockKvStoreEntry))
        .next()
        .save('before fetch')
        .next(newkv)
        .put(A.fetchMetadataLockboxSuccess(newkv))
    })
    it('creates entry if value is empty', () => {
      const nullKv = set(KVStoreEntry.value, null, mockKvStoreEntry)
      saga
        .restore('before fetch')
        .next(nullKv)
        .call(createLockbox, nullKv)
    })
    it('sets fail state', () => {
      saga
        .restore('before fetch')
        .throw({ message: 'failed to fetch' })
        .put(A.fetchMetadataLockboxFailure('failed to fetch'))
        .next()
        .isDone()
    })
  })
})
