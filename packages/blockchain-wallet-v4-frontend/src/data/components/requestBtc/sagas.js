import { put } from 'redux-saga/effects'
import * as actions from '../../actions.js'

export default () => {
  const logLocation = 'components/requestBtc/sagas'

  const firstStepSubmitClicked = function * (action) {
    try {
      let { accountIdx, addressIdx, message } = action.payload
      yield put(actions.core.wallet.setHdAddressLabel(accountIdx, addressIdx, message))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'editHdLabel', error))
    }
  }

  return {
    firstStepSubmitClicked
  }
}
