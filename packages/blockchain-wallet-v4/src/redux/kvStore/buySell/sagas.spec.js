import Bitcoin from 'bitcoinjs-lib'
import { testSaga } from 'redux-saga-test-plan'
import { KVStoreEntry } from '../../../types'
import * as A from './actions'
import buySell from './sagas'
import { walletV3 } from '../../../../data'
import { derivationMap, BUYSELL } from '../config'
import { set } from 'ramda-lens'
import { getMetadataXpriv } from '../root/selectors'

const api = {
  fetchKVStore: () => {}
}
const networks = { btc: Bitcoin.networks['bitcoin'] }
const buySellKvStoreSagas = buySell({ api, networks })
const typeId = derivationMap[BUYSELL]
const { accounts } = walletV3.hd_wallets[0]
const { xpriv } = accounts[0]

const { createBuySell, fetchMetadataBuySell } = buySellKvStoreSagas

const mockKvStoreEntry = KVStoreEntry.fromMetadataXpriv(
  xpriv,
  typeId,
  networks.btc
)

const mockNewBuySellEntry = {
  sfox: {
    trades: []
  },
  coinify: {
    trades: []
  }
}

const newkv = set(KVStoreEntry.value, mockNewBuySellEntry, mockKvStoreEntry)

describe('kvStore buySell sagas', () => {
  describe('createBuySell', () => {
    it('creates a valid buySell metadata entry', () => {
      const saga = testSaga(createBuySell, mockKvStoreEntry)
      saga
        .next()
        .put(A.createMetadataBuySell(newkv))
        .next()
        .isDone()
    })
  })
  describe('fetchMetadataBuySell', () => {
    const saga = testSaga(fetchMetadataBuySell)
    it('fetches users metadata', () => {
      saga
        .next()
        .select(getMetadataXpriv)
        .next(xpriv)
        .put(A.fetchMetadataBuySellLoading())
        // callTask is undefined
        // .next()
        // .call(api.fetchKVStore(mockKvStoreEntry))
        .next()
        .save('before fetch')
        .next(newkv)
        .put(A.fetchMetadataBuySellSuccess(newkv))
    })
    it('creates entry if value is empty', () => {
      const nullKv = set(KVStoreEntry.value, null, mockKvStoreEntry)
      saga
        .restore('before fetch')
        .next(nullKv)
        .call(createBuySell, nullKv)
    })
    it('sets fail state', () => {
      saga
        .restore('before fetch')
        .throw({ message: 'failed to fetch' })
        .put(A.fetchMetadataBuySellFailure('failed to fetch'))
    })
  })
})
