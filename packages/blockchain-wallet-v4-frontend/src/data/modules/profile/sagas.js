import { put, select, call } from 'redux-saga/effects'

import * as A from './actions'
import * as S from './selectors'
import { USER_ACTIVATION_STATES } from './model'

export const logLocation = 'modules/profile/sagas'

export default ({ api }) => {
  const signIn = function*() {}

  const createUser = function*({ payload }) {
    const { data } = payload
    const { id } = yield call(api.createUser, data)
    yield put(
      A.setUserData({ ...data, id, state: USER_ACTIVATION_STATES.CREATED })
    )
  }

  const updateUser = function*({ payload }) {
    const { data } = payload
    const { id, ...userData } = yield select(S.getUserData)
    const updatedData = { ...userData, ...data }
    yield call(api.updateUser, id, updatedData)
    yield put(A.setUserData({ id, ...updatedData }))
  }

  return {
    signIn,
    createUser,
    updateUser
  }
}
