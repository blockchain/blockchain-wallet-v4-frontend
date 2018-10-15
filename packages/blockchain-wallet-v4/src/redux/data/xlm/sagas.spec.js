import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'
import { select } from 'redux-saga/effects'
import * as StellarSdk from 'stellar-sdk'

import * as S from './selectors'
import * as A from './actions'
import sagas, { ACCOUNT_NOT_FOUND } from './sagas'
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

const api = {
  createXlmAccount: jest.fn(),
  getLatestLedgerDetails: jest.fn(() => STUB_LEDGER),
  getXlmAccount: jest.fn(id => {
    if (id === STUB_ACCOUNT_ID) return STUB_ACCOUNT
    if (id === OTHER_ACCOUNT_ID) return OTHER_ACCOUNT
    return null
  })
}

const networks = {
  xlm: 'testnet'
}

const { createAccounts, fetchData, fetchLedgerDetails } = sagas({
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
      .put(A.setData(Remote.Loading))
      .select(S.getContext)
      .call(api.getXlmAccount, STUB_ACCOUNT_ID)
      .call(api.getXlmAccount, OTHER_ACCOUNT_ID)
      .put(
        A.setData(
          Remote.Success({
            [STUB_ACCOUNT_ID]: STUB_ACCOUNT,
            [OTHER_ACCOUNT_ID]: OTHER_ACCOUNT
          })
        )
      )
      .run())

  it('should create account if it is not found', () => {
    api.getXlmAccount.mockRejectedValue({ message: ACCOUNT_NOT_FOUND })
    return expectSaga(fetchData)
      .provide([
        [select(S.getContext), [STUB_ACCOUNT_ID]],
        [call.fn(createAccounts), jest.fn()]
      ])
      .put(A.setData(Remote.Loading))
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
      .put(A.setData(Remote.Loading))
      .select(S.getContext)
      .call(api.getXlmAccount, STUB_ACCOUNT_ID)
      .put(A.setData(Remote.Failure(error)))
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
      .put(A.setData(Remote.Failure(error)))
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
