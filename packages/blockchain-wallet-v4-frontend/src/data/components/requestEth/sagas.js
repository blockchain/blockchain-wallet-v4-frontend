import { prop } from 'ramda'
import { put, select, take } from 'redux-saga/effects'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import * as actionTypes from '../../actionTypes'
import Eth from '@ledgerhq/hw-app-eth'

export default ({ networks }) => {
  const logLocation = 'components/requestEth/sagas'

  const openLockboxAppClicked = function*(action) {
    try {
      const form = yield select(selectors.form.getFormValues('requestEth'))
      const to = prop('to', form)

      const deviceR = yield select(
        selectors.core.kvStore.lockbox.getDeviceFromEthAddr,
        prop('address', to)
      )
      const device = deviceR.getOrFail('missing_device')
      const deviceType = prop('device_type', device)
      yield put(
        actions.components.lockbox.pollForDeviceApp('ETH', null, deviceType)
      )
      // take new transport
      yield take(actionTypes.components.lockbox.SET_CONNECTION_INFO)
      const { transport } = yield select(
        selectors.components.lockbox.getCurrentConnection
      )
      const eth = new Eth(transport)
      eth.getAddress(`44'/60'/0'/0/0`, true)
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
