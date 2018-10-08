import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'
import { select } from 'redux-saga/effects'

import * as selectors from '../../selectors'
import * as A from './actions'
import sagas, { NO_ACCOUNT_ID_ERROR, ACCOUNT_NOT_FOUND } from './sagas'
import Remote from '../../../remote'

const STUB_LEDGER = {
  base_reserve_in_stroops: 500000,
  base_fee_in_stroops: 100
}
const STUB_ACCOUNT_ID =
  'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5'
const STUB_ACCOUNT = {
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
  getXlmAccount: jest.fn(() => STUB_ACCOUNT)
}

const { createAccount, fetchAccount, fetchLedgerDetails } = sagas({ api })

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

describe('fetch account saga', () => {
  it('should fetch account', () =>
    expectSaga(fetchAccount)
      .provide([
        [
          select(selectors.kvStore.xlm.getDefaultAccountId),
          Remote.Success(STUB_ACCOUNT_ID)
        ]
      ])
      .put(A.setAccount(Remote.Loading))
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .call(api.getXlmAccount, STUB_ACCOUNT_ID)
      .put(A.setAccount(Remote.Success(STUB_ACCOUNT)))
      .run())

  it('should set account error if account id is not found', () =>
    expectSaga(fetchAccount)
      .provide([
        [select(selectors.kvStore.xlm.getDefaultAccountId), Remote.NotAsked]
      ])
      .put(A.setAccount(Remote.Loading))
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .not.call(api.getXlmAccount)
      .put(A.setAccount(Remote.Failure(NO_ACCOUNT_ID_ERROR)))
      .run())

  it('should create account if it is not found', () => {
    api.getXlmAccount.mockRejectedValue({ message: ACCOUNT_NOT_FOUND })
    return expectSaga(fetchAccount)
      .provide([
        [
          select(selectors.kvStore.xlm.getDefaultAccountId),
          Remote.Success(STUB_ACCOUNT_ID)
        ],
        [call.fn(createAccount), jest.fn()]
      ])
      .put(A.setAccount(Remote.Loading))
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .call(api.getXlmAccount, STUB_ACCOUNT_ID)
      .call(createAccount)
      .run()
  })

  it('should set account error if fetch fails', () => {
    const error = 'error'
    api.getXlmAccount.mockRejectedValue(error)
    return expectSaga(fetchAccount)
      .provide([
        [
          select(selectors.kvStore.xlm.getDefaultAccountId),
          Remote.Success(STUB_ACCOUNT_ID)
        ]
      ])
      .put(A.setAccount(Remote.Loading))
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .call(api.getXlmAccount, STUB_ACCOUNT_ID)
      .put(A.setAccount(Remote.Failure(error)))
      .run()
  })
})

describe('create account saga', () => {
  it('should create account', () =>
    expectSaga(createAccount)
      .provide([
        [
          select(selectors.kvStore.xlm.getDefaultAccountId),
          Remote.Success(STUB_ACCOUNT_ID)
        ],
        [call.fn(fetchAccount), jest.fn()]
      ])
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .call(api.createXlmAccount, STUB_ACCOUNT_ID)
      .call(fetchAccount)
      .run())

  it('should set account error if account id is not found', () =>
    expectSaga(createAccount)
      .provide([
        [select(selectors.kvStore.xlm.getDefaultAccountId), Remote.NotAsked]
      ])
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .not.call(api.createXlmAccount)
      .not.call(fetchAccount)
      .put(A.setAccount(Remote.Failure(NO_ACCOUNT_ID_ERROR)))
      .run())

  it('should set account error if creation fails', () => {
    const error = 'error'
    api.createXlmAccount.mockRejectedValue(error)
    return expectSaga(createAccount)
      .provide([
        [
          select(selectors.kvStore.xlm.getDefaultAccountId),
          Remote.Success(STUB_ACCOUNT_ID)
        ]
      ])
      .select(selectors.kvStore.xlm.getDefaultAccountId)
      .call(api.createXlmAccount, STUB_ACCOUNT_ID)
      .not.call(fetchAccount)
      .put(A.setAccount(Remote.Failure(error)))
      .run()
  })
})
