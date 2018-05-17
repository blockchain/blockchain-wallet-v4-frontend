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
      if (e.message === 'PROMPT_INPUT_CANCEL') return
      yield put(actions.logs.logErrorMessage(logLocation, 'editBchAccountLabel', e))
      yield put(actions.alerts.displayError('Failed to update Bitcoin Cash account label.'))
    }
  }

  return {
    editBchAccountLabel
  }
}
