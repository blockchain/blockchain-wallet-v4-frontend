import { call, put } from 'redux-saga/effects'
import { sum, values } from 'ramda'
import * as A from './actions'

export const info = ({ api } = {}) => {
  const fetchEtherBalance = function * ({ context }) {
    const response = yield call(api.getEtherBalances, context)
    const balance = sum(values(response).map(obj => obj.balance))
    yield put(A.setEtherBalance(balance))
  }

  return {
    fetchEtherBalance
  }
}
