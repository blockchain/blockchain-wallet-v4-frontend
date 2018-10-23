import { put, select, take } from 'redux-saga/effects'
import { identity, prop } from 'ramda'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import * as actionTypes from '../../actionTypes'
import * as C from 'services/AlertService'
import * as Lockbox from 'services/LockboxService'
import Btc from '@ledgerhq/hw-app-btc'

export default ({ networks }) => {
  const logLocation = 'components/requestBtc/sagas'
  const setHDLabelError = 'accountIdx must be integer'

  const firstStepSubmitClicked = function*(action) {
    try {
      let { accountIdx, addressIdx, message } = action.payload
      if (Number.isInteger(accountIdx)) {
        yield put(
          actions.core.wallet.setHdAddressLabel(accountIdx, addressIdx, message)
        )
      } else {
        throw new Error(setHDLabelError)
      }
    } catch (error) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'firstStepSubmitClicked',
          error
        )
      )
    }
  }

  const openLockboxAppClicked = function*(action) {
    try {
      const form = yield select(selectors.form.getFormValues('requestBitcoin'))
      const appState = yield select(identity)
      const to = prop('to', form)

      const receiveIndexR = selectors.core.common.btc.getNextAvailableReceiveIndexLockbox(
        networks.btc,
        prop('xpub', to),
        appState
      )
      const receiveIndex = receiveIndexR.getOrFail('missing_receive_index')
      const deviceR = yield select(
        selectors.core.kvStore.lockbox.getDeviceFromBtcXpubs,
        [prop('xpub', to)]
      )
      const device = deviceR.getOrFail('missing_device')
      const deviceType = prop('device_type', device)
      yield put(
        actions.components.lockbox.pollForDeviceApp('BTC', null, deviceType)
      )
      // take new transport
      yield take(actionTypes.components.lockbox.SET_CONNECTION_INFO)
      const { transport } = yield select(
        selectors.components.lockbox.getCurrentConnection
      )
      const scrambleKey = Lockbox.utils.getScrambleKey('BTC', deviceType)
      const btc = new Btc(transport, scrambleKey)
      // TODO: multiple hd account support?
      // display receive address on device
      btc.getWalletPublicKey(`44'/0'/0'/0/${receiveIndex}`, true)
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'openLockboxAppClicked', e)
      )
    }
  }

  const btcPaymentReceived = function*(action) {
    yield put(actions.alerts.displaySuccess(C.RECEIVE_BTC_SUCCESS))
  }

  return {
    firstStepSubmitClicked,
    openLockboxAppClicked,
    btcPaymentReceived
  }
}
