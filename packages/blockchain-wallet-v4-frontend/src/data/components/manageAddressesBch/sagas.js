import * as A from './actions'
import * as actions from '../../actions'
import * as C from 'services/AlertService'
import { call, put } from 'redux-saga/effects'
import { promptForInput } from 'services/SagaService'

export default ({ api, networks }) => {
  const logLocation = 'components/manageAddressesBch/sagas'

  const editAddressLabel = function * (action) {
    const { address } = action.payload
    try {
      yield put(A.editImportedAddressLabelLoading(address))

      // prompt for new label
      let newLabel = yield call(promptForInput, {
        title: 'Rename Address Label',
        maxLength: 50
      })

      // update label
      yield put(
        actions.core.kvStore.bch.setLegacyAddressLabel(address.addr, newLabel)
      )

      yield put(A.editImportedAddressLabelSuccesss(address))

      // display success popup
      yield put(actions.alerts.displaySuccess(C.UPDATE_ADDRESS_LABEL_SUCCESS))
    } catch (error) {
      yield put(A.editImportedAddressLabelError(address, error))

      // log error message to redux state
      yield put(
        actions.logs.logErrorMessage(logLocation, 'editAddressLabel', error)
      )

      // display error popup
      yield put(
        actions.alerts.displayError(C.UPDATE_IMPORTED_ADDRESS_LABEL_ERROR)
      )
    }
  }
  return { editAddressLabel }
}
