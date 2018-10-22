import { put, select, take } from 'redux-saga/effects'
import { identity, prop } from 'ramda'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import * as actionTypes from '../../actionTypes'
import Btc from '@ledgerhq/hw-app-btc'

export default ({ networks }) => {
  const logLocation = 'components/requestBch/sagas'

  const openLockboxAppClicked = function*(action) {
    try {
      const form = yield select(selectors.form.getFormValues('requestBch'))
      const appState = yield select(identity)
      const to = prop('to', form)

      const receiveIndexR = selectors.core.common.bch.getNextAvailableReceiveIndexLockbox(
        networks.btc,
        prop('xpub', to),
        appState
      )
      const receiveIndex = receiveIndexR.getOrFail('missing_receive_index')
      const deviceR = yield select(
        selectors.core.kvStore.lockbox.getDeviceFromBchXpubs,
        [prop('xpub', to)]
      )
      const device = deviceR.getOrFail('missing_device')
      const deviceType = prop('device_type', device)
      yield put(
        actions.components.lockbox.pollForDeviceApp('BCH', null, deviceType)
      )
      // take new transport
      yield take(actionTypes.components.lockbox.SET_CONNECTION_INFO)
      const { transport } = yield select(
        selectors.components.lockbox.getCurrentConnection
      )
      const btc = new Btc(transport)
      // TODO: multiple hd account support?
      // display receive address on device
      btc.getWalletPublicKey(`44'/145'/0'/0/${receiveIndex}`, true)
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'openLockboxAppClicked', e)
      )
    }
  }

  return {
    openLockboxAppClicked
  }
}
