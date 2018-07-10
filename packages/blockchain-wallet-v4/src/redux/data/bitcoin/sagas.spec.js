import { call, put, select, take } from 'redux-saga/effects'
import { indexBy, length, last, path, prop } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'

import { expectSaga, testSaga } from 'redux-saga-test-plan'
import sagas from './sagas'

const blockchainData = { wallet: {}, info: {}}

const api = {
  fetchBlockchainData: jest.fn(() => blockchainData)
}

describe('bitcoin data sagas', () => {
  const dataBtcSagas = sagas(api)

  describe('fetchData', () => {
    const saga = testSaga(dataBtcSagas.fetchData)

    it('should put loading state', () => {
      saga.next().put(A.fetchDataLoading())
    })
    it('should get data from api', () => {
      const mockContext = 'xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x'
      saga.next()
        .select(selectors.wallet.getContext)
        .next()
        .call(api.fetchBlockchainData, mockContext, { n: 1 })

    })
  })
})