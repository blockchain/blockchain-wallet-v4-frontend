import { call, put } from 'redux-saga/effects'
import * as actions from '../../actions.js'
import { promptForInput } from 'services/SagaService'

export default ({ coreSagas }) => {
  const logLocation = 'modules/addressesBch/sagas'

  const editBchAccountLabel = function * (action) {
    try {
      const { index, label } = action.payload
      const newLabel = yield call(promptForInput, { title: 'Rename Bitcoin Cash Wallet', initial: label })
      yield put(actions.core.kvStore.bch.setAccountLabel(index, newLabel))
      yield put(actions.alerts.displaySuccess('BCH wallet name updated.'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'editBchAccountLabel', e))
      yield put(actions.alerts.displayError('Failed to update Bitcoin Cash account label.'))
    }
  }

  const editBchHdLabel = function * (action) {
    try {
      let { accountIdx, addressIdx } = action.payload
      let newLabel = yield call(promptForInput, { title: 'Rename Address Label' })
      yield put(actions.core.kvStore.bch.setHdAddressLabel(accountIdx, addressIdx, newLabel))
      yield put(actions.alerts.displaySuccess('Address label updated.'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'editBchHdLabel', e))
      yield put(actions.alerts.displayError('Failed to update Bitcoin Cash account label.'))
    }
  }

  return {
    editBchHdLabel,
    editBchAccountLabel
  }
}
