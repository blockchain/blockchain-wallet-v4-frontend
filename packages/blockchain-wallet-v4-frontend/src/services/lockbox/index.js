import { put, race, take } from 'redux-saga/effects'

import { actions, actionTypes } from 'data'

import apps from './apps'
import constants from './constants'
import firmware from './firmware'
import utils from './utils'

const promptForLockbox = function* (coin, deviceType, marquees = [], isTx = true) {
  if (marquees && !Array.isArray(marquees)) {
    throw new Error('MARQUEES_NEEDS_TO_BE_ARRAY')
  }
  yield put(
    actions.modals.showModal('LOCKBOX_CONNECTION_PROMPT_MODAL', {
      coin,
      isTx,
      marquees
    })
  )
  yield put(actions.components.lockbox.pollForDeviceApp(coin, null, deviceType))
  const { cancelled } = yield race({
    cancelled: take(actionTypes.modals.CLOSE_MODAL),
    response: take(actionTypes.components.lockbox.SET_CONNECTION_INFO)
  })
  if (cancelled) {
    throw new Error('PROMPT_FOR_LOCKBOX_CANCELED')
  } else {
    yield put(actions.components.lockbox.setConnectionReady())
  }
}

export { apps, constants, firmware, promptForLockbox, utils }
