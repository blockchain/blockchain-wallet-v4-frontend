import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const advertsSaga = ({ api } = {}) => {
  const fetchAdverts = function * ({ number }) {
    const response = yield call(api.getAdverts, number)
    yield put(A.setAdverts(response))
  }

  return {
    fetchAdverts
  }
}
