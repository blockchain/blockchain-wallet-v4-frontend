import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const feeSaga = ({ api } = {}) => {
  const fetchFee = function * () {
    const response = yield call(api.getFee)
    yield put(A.setFee(response))
  }

  return {
    fetchFee
  }
}
