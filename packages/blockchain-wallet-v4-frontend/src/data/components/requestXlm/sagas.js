import { prop } from 'ramda'
import { put, select, take } from 'redux-saga/effects'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import * as actionTypes from '../../actionTypes'
import * as Lockbox from 'services/LockboxService'
import Str from '@ledgerhq/hw-app-str'

export default () => {
  const logLocation = 'components/requestXlm/sagas'

  const openLockboxAppClicked = function*(action) {
    try {
      const form = yield select(selectors.form.getFormValues('requestXlm'))
      const to = prop('to', form)

      const deviceR = yield select(
        selectors.core.kvStore.lockbox.getDeviceFromXlmAddr,
        prop('address', to)
      )
      const device = deviceR.getOrFail('missing_device')
      const deviceType = prop('device_type', device)
      yield put(
        actions.components.lockbox.pollForDeviceApp('XLM', null, deviceType)
      )
      // take new transport
      yield take(actionTypes.components.lockbox.SET_CONNECTION_INFO)
      const { transport } = yield select(
        selectors.components.lockbox.getCurrentConnection
      )
      const scrambleKey = Lockbox.utils.getScrambleKey('XLM', deviceType)
      const str = new Str(transport, scrambleKey)
      str.getPublicKey(`44'/148'/0'`, true, true)
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
