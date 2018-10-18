import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'
import { select } from 'redux-saga/effects'
import * as StellarSdk from 'stellar-sdk'

import * as S from './selectors'
import * as A from './actions'
import * as selectors from '../../selectors'
import sagas, { ACCOUNT_NOT_FOUND, TX_PER_PAGE } from './sagas'
import Remote from '../../../remote'

const STUB_LEDGER = {
  base_reserve_in_stroops: 500000,
  base_fee_in_stroops: 100
}
const STUB_ACCOUNT_ID = StellarSdk.Keypair.random().publicKey()
const OTHER_ACCOUNT_ID = StellarSdk.Keypair.random().publicKey()
const STUB_ACCOUNT = {
  account_id: STUB_ACCOUNT_ID,
  subentry_count: 1,
  balances: [
    {
      asset_type: 'native',
      balance: 10000000000
    }
  ]
}
const OTHER_ACCOUNT = {
  account_id: OTHER_ACCOUNT_ID,
  subentry_count: 1,
  balances: [
    {
      asset_type: 'native',
      balance: 10000000000
    }
  ]
}

const STUB_TXS = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

const api = {
  createXlmAccount: jest.fn(),
  getLatestLedgerDetails: jest.fn(() => STUB_LEDGER),
  getXlmAccount: jest.fn(id => {
    if (id === STUB_ACCOUNT_ID) return STUB_ACCOUNT
    if (id === OTHER_ACCOUNT_ID) return OTHER_ACCOUNT
    return null
  }),
  getXlmTransactions: jest.fn(() => STUB_TXS)
}

const networks = {
  xlm: 'testnet'
}

const {
  createAccounts,
  fetchData,
  fetchLedgerDetails,
  fetchTransactions
} = sagas({
  api,
  networks
})

describe('fetch ledger details saga', () => {
  it('should fetch latest ledger details', () =>
    expectSaga(fetchLedgerDetails)
      .put(A.setLedgerDetails(Remote.Loading))
      .call(api.getLatestLedgerDetails)
      .put(A.setLedgerDetails(Remote.Success(STUB_LEDGER)))
      .run())

  it('should set ledger error if fetch fails', () => {
    const error = 'error'
    api.getLatestLedgerDetails.mockRejectedValue(error)
    return expectSaga(fetchLedgerDetails)
      .put(A.setLedgerDetails(Remote.Loading))
      .call(api.getLatestLedgerDetails)
      .put(A.setLedgerDetails(Remote.Failure(error)))
      .run()
  })
})

describe('fetch data saga', () => {
  it('should fetch accounts', () =>
    expectSaga(fetchData)
      .provide([[select(S.getContext), [STUB_ACCOUNT_ID, OTHER_ACCOUNT_ID]]])
      .put(A.fetchDataLoading())
      .select(S.getContext)
      .call(api.getXlmAccount, STUB_ACCOUNT_ID)
      .call(api.getXlmAccount, OTHER_ACCOUNT_ID)
      .put(
        A.fetchDataSuccess({
          [STUB_ACCOUNT_ID]: STUB_ACCOUNT,
          [OTHER_ACCOUNT_ID]: OTHER_ACCOUNT
        })
      )
      .run())

  it('should create account if it is not found', () => {
    api.getXlmAccount.mockRejectedValue({ message: ACCOUNT_NOT_FOUND })
    return expectSaga(fetchData)
      .provide([
        [select(S.getContext), [STUB_ACCOUNT_ID]],
        [call.fn(createAccounts), jest.fn()]
      ])
      .put(A.fetchDataLoading())
      .select(S.getContext)
      .call(api.getXlmAccount, STUB_ACCOUNT_ID)
      .call(createAccounts)
      .run()
  })

  it('should set account error if fetch fails', () => {
    const error = 'error'
    api.getXlmAccount.mockRejectedValue(error)
    return expectSaga(fetchData)
      .provide([[select(S.getContext), [STUB_ACCOUNT_ID]]])
      .put(A.fetchDataLoading())
      .select(S.getContext)
      .call(api.getXlmAccount, STUB_ACCOUNT_ID)
      .put(A.fetchDataFailure(error))
      .run()
  })
})

describe('create account saga', () => {
  it('should create account', () =>
    expectSaga(createAccounts)
      .provide([
        [select(S.getContext), [STUB_ACCOUNT_ID]],
        [call.fn(fetchData), jest.fn()]
      ])
      .select(S.getContext)
      .call(api.createXlmAccount, STUB_ACCOUNT_ID)
      .call(fetchData)
      .run())

  it('should set account error if creation fails', () => {
    const error = 'error'
    api.createXlmAccount.mockRejectedValue(error)
    return expectSaga(createAccounts)
      .provide([[select(S.getContext), [STUB_ACCOUNT_ID]]])
      .select(S.getContext)
      .call(api.createXlmAccount, STUB_ACCOUNT_ID)
      .not.call(fetchData)
      .put(A.fetchDataFailure(error))
      .run()
  })

  it('should not create account for non-testnet', () => {
    networks.xlm = 'public'
    return expectSaga(createAccounts)
      .provide([
        [select(S.getContext), [STUB_ACCOUNT_ID]],
        [call.fn(fetchData), jest.fn()]
      ])
      .not.select(S.getContext)
      .not.call(api.createXlmAccount, STUB_ACCOUNT_ID)
      .not.call(fetchData)
      .run()
  })
})

describe('fetch transactions saga', () => {
  it('should fetch transactions', () =>
    expectSaga(fetchTransactions, { payload: {} })
      .provide([
        [
          select(selectors.kvStore.xlm.getDefaultAccountId),
          Remote.of(STUB_ACCOUNT_ID)
        ]
      ])
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .select(S.getTransactions)
      .select(S.getTransactionsAtBound)
      .put(A.fetchTransactionsLoading())
      .call(api.getXlmTransactions, {
        publicKey: STUB_ACCOUNT_ID,
        limit: TX_PER_PAGE,
        latestTradeId: null
      })
      .put(A.transactionsAtBound(true))
      .put(A.fetchTransactionsSuccess(STUB_TXS))
      .run())

  it('should fetch transactions for requested accountId', () =>
    expectSaga(fetchTransactions, { payload: { accountId: OTHER_ACCOUNT_ID } })
      .provide([
        [
          select(selectors.kvStore.xlm.getDefaultAccountId),
          Remote.of(STUB_ACCOUNT_ID)
        ]
      ])
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .select(S.getTransactions)
      .select(S.getTransactionsAtBound)
      .put(A.fetchTransactionsLoading())
      .call(api.getXlmTransactions, {
        publicKey: OTHER_ACCOUNT_ID,
        limit: TX_PER_PAGE,
        latestTradeId: null
      })
      .put(A.transactionsAtBound(true))
      .put(A.fetchTransactionsSuccess(STUB_TXS))
      .run())

  it('should not fetch txs if atBound is true', () =>
    expectSaga(fetchTransactions, { payload: {} })
      .provide([
        [
          select(selectors.kvStore.xlm.getDefaultAccountId),
          Remote.of(STUB_ACCOUNT_ID)
        ],
        [select(S.getTransactionsAtBound), true]
      ])
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .select(S.getTransactions)
      .select(S.getTransactionsAtBound)
      .not.put(A.fetchTransactionsLoading())
      .not.call(api.getXlmTransactions, {
        publicKey: STUB_ACCOUNT_ID,
        limit: TX_PER_PAGE,
        latestTradeId: null
      })
      .not.put(A.transactionsAtBound(true))
      .not.put(A.fetchTransactionsSuccess(STUB_TXS))
      .run())

  it('should fetch txs if atBound is true and reset them', () =>
    expectSaga(fetchTransactions, { payload: { reset: true } })
      .provide([
        [
          select(selectors.kvStore.xlm.getDefaultAccountId),
          Remote.of(STUB_ACCOUNT_ID)
        ],
        [select(S.getTransactionsAtBound), true]
      ])
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .select(S.getTransactions)
      .select(S.getTransactionsAtBound)
      .put(A.fetchTransactionsLoading(true))
      .call(api.getXlmTransactions, {
        publicKey: STUB_ACCOUNT_ID,
        limit: TX_PER_PAGE,
        latestTradeId: null
      })
      .put(A.transactionsAtBound(true))
      .put(A.fetchTransactionsSuccess(STUB_TXS, true))
      .run())

  it('should set atBound to false if tx length is bigger or equal to TX_PER_PAGE', () => {
    const fullPage = new Array(TX_PER_PAGE).fill({})
    expectSaga(fetchTransactions, { payload: {} })
      .provide([
        [
          select(selectors.kvStore.xlm.getDefaultAccountId),
          Remote.of(STUB_ACCOUNT_ID)
        ],
        [call.fn(api.getXlmTransactions), fullPage]
      ])
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .select(S.getTransactions)
      .select(S.getTransactionsAtBound)
      .put(A.fetchTransactionsLoading())
      .call(api.getXlmTransactions, {
        publicKey: STUB_ACCOUNT_ID,
        limit: TX_PER_PAGE,
        latestTradeId: null
      })
      .put(A.transactionsAtBound(false))
      .put(A.fetchTransactionsSuccess(fullPage))
      .run()
  })
})
