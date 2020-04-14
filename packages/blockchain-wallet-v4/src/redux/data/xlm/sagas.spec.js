import * as A from './actions'
import * as S from './selectors'
import * as StellarSdk from 'stellar-sdk'
import { call } from 'redux-saga-test-plan/matchers'
import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import Remote from '../../../remote'
import sagas, { sumBigNumbers } from './sagas'

const STUB_LEDGER = {
  base_reserve_in_stroops: 500000,
  base_fee_in_stroops: 100
}
const STUB_ACCOUNT_ID = StellarSdk.Keypair.random().publicKey()
const OTHER_ACCOUNT_ID = StellarSdk.Keypair.random().publicKey()
const STUB_ACCOUNT = {
  account_id: STUB_ACCOUNT_ID,
  subentry_count: 1,
  balances: [{ asset_type: 'native', balance: 10000000000 }]
}
const OTHER_ACCOUNT = {
  account_id: OTHER_ACCOUNT_ID,
  subentry_count: 1,
  balances: [{ asset_type: 'native', balance: 10000000000 }]
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
const networks = { xlm: 'testnet' }
const { createAccounts, fetchData, fetchLedgerDetails } = sagas({
  api,
  networks
})

describe('fetch ledger details saga', () => {
  it('should fetch latest ledger details', () => {
    expectSaga(fetchLedgerDetails)
      .put(A.setLedgerDetailsLoading())
      .call(api.getLatestLedgerDetails)
      .put(A.setLedgerDetailsSuccess(STUB_LEDGER))
      .run()
  })

  it('should set ledger error if fetch fails', () => {
    const error = 'error'
    api.getLatestLedgerDetails.mockRejectedValue(error)
    expectSaga(fetchLedgerDetails)
      .put(A.setLedgerDetailsLoading())
      .call(api.getLatestLedgerDetails)
      .put(A.setLedgerDetailsFailure(error))
      .run()
  })
})

describe('fetch data saga', () => {
  it('should fetch accounts', () => {
    expectSaga(fetchData)
      .provide([
        [select(S.getContext), [STUB_ACCOUNT_ID, OTHER_ACCOUNT_ID]],
        [
          select(S.getAccounts),
          {
            STUB_ACCOUNT_ID: Remote.of(STUB_ACCOUNT),
            OTHER_ACCOUNT_ID: Remote.of(OTHER_ACCOUNT)
          }
        ]
      ])
      .select(S.getContext)
      .put(A.fetchAccountLoading(STUB_ACCOUNT_ID))
      .call(api.getXlmAccount, STUB_ACCOUNT_ID)
      .put(A.fetchAccountLoading(OTHER_ACCOUNT_ID))
      .call(api.getXlmAccount, OTHER_ACCOUNT_ID)
      .select(S.getAccounts)
      .put(A.fetchAccountSuccess(STUB_ACCOUNT_ID, STUB_ACCOUNT))
      .put(A.fetchAccountSuccess(OTHER_ACCOUNT_ID, OTHER_ACCOUNT))
      .put(
        A.fetchDataSuccess({
          info: {
            final_balance: sumBigNumbers([
              STUB_ACCOUNT.balances[0].balance,
              OTHER_ACCOUNT.balances[0].balance
            ])
          }
        })
      )
      .run()
  })

  it('should set account error if fetch fails', () => {
    const error = 'error'
    api.getXlmAccount.mockRejectedValue(error)
    expectSaga(fetchData)
      .provide([
        [select(S.getContext), [STUB_ACCOUNT_ID]],
        [
          select(S.getAccounts),
          {
            STUB_ACCOUNT_ID: Remote.Failure(error)
          }
        ]
      ])
      .select(S.getContext)
      .put(A.fetchAccountLoading(STUB_ACCOUNT_ID))
      .call(api.getXlmAccount, STUB_ACCOUNT_ID)
      .put(A.fetchAccountFailure(STUB_ACCOUNT_ID, error))
      .select(S.getAccounts)
      .put(A.fetchDataSuccess({ info: { final_balance: '0' } }))
      .run()
  })
})

describe('create account saga', () => {
  it('should create account', () => {
    expectSaga(createAccounts)
      .provide([
        [select(S.getContext), [STUB_ACCOUNT_ID]],
        [call.fn(fetchData), jest.fn()]
      ])
      .select(S.getContext)
      .call(api.createXlmAccount, STUB_ACCOUNT_ID)
      .call(fetchData)
      .run()
  })

  it('should not create account for non-testnet', () => {
    networks.xlm = 'public'
    expectSaga(createAccounts)
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
