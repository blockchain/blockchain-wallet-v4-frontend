import { call, put } from 'redux-saga/effects'
import { sum, values } from 'ramda'
import * as A from './actions'

export const info = ({ api } = {}) => {
  const fetchEtherBalance = function * ({ addresses }) {
    const response = yield call(api.fetchEtherBalances, addresses)
    const balance = sum(values(response.data).map(obj => obj.balance))
    yield put(A.setEtherBalance(balance))
  }

  return {
    fetchEtherBalance
  }
}
