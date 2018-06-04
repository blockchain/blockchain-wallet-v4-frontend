import { call, put } from 'redux-saga/effects'
import * as actions from '../../actions.js'
import * as C from 'services/AlertService'
import { promptForInput } from 'services/SagaService'

export default ({ coreSagas }) => {
  const logLocation = 'modules/addressesBch/sagas'

  const editBchAccountLabel = function * (action) {
    try {
      const { index, label } = action.payload
      const newLabel = yield call(promptForInput, { title: 'Rename Bitcoin Cash Wallet', initial: label })
      yield put(actions.core.kvStore.bch.setAccountLabel(index, newLabel))
      yield put(actions.alerts.displaySuccess(C.RENAME_BCH_WALLET_SUCCESS))
    } catch (e) {
      if (e.message === 'PROMPT_INPUT_CANCEL') return
      yield put(actions.logs.logErrorMessage(logLocation, 'editBchAccountLabel', e))
      yield put(actions.alerts.displayError(C.RENAME_BCH_WALLET_ERROR))
    }
  }

  return {
    editBchAccountLabel
  }
}
