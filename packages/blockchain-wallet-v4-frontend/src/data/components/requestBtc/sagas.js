import { put, select, take } from 'redux-saga/effects'
import { identity, path, prop, propEq, equals } from 'ramda'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import * as actionTypes from '../../actionTypes'
import * as C from 'services/AlertService'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
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

  const formChanged = function*(action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      const appState = yield select(identity)
      if (!equals('requestBitcoin', form)) return

      if (field === 'to') {
        if (propEq('type', ADDRESS_TYPES.LOCKBOX, payload)) {
          const receiveIndexR = selectors.core.common.btc.getNextAvailableReceiveIndexLockbox(
            networks.btc,
            prop('address', payload),
            appState
          )
          const receiveIndex = receiveIndexR.getOrFail('missing_receive_index')
          const deviceR = yield select(
            selectors.core.kvStore.lockbox.getDeviceFromBtcXpubs,
            [prop('xpub', payload)]
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
          const btc = new Btc(transport)
          // TODO: multiple hd account support?
          // display receive address on device
          btc.getWalletPublicKey(`44'/0'/0'/0/${receiveIndex}`, true)
        }
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const btcPaymentReceived = function*(action) {
    yield put(actions.alerts.displaySuccess(C.RECEIVE_BTC_SUCCESS))
  }

  return {
    firstStepSubmitClicked,
    btcPaymentReceived,
    formChanged
  }
}
