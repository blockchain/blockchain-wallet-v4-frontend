import { assoc, assocPath } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'

import * as AT from './actionTypes'

const INITIAL_STATE = {
  connection: {},
  firmware: {},
  appManager: {
    latestAppInfos: Remote.NotAsked,
    appChangeStatus: Remote.NotAsked,
    targetId: Remote.NotAsked
  },
  newDeviceSetup: {
    device: Remote.NotAsked,
    deviceType: null,
    newOrExisting: null,
    showBtcWarning: false
  },
  isAuthentic: Remote.NotAsked,
  showProductTour: false
}

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.RESET_CONNECTION_STATUS: {
      return assoc('connection', {}, state)
    }
    case AT.RESET_NEW_DEVICE_SETUP: {
      return assoc('newDeviceSetup', INITIAL_STATE.newDeviceSetup, state)
    }
    case AT.SET_NEW_DEVICE_INFO: {
      return assocPath(
        ['newDeviceSetup', 'device'],
        Remote.Success(payload.deviceInfo),
        state
      )
    }
    case AT.SET_SETUP_NEW_OR_EXISTING: {
      return assocPath(['newDeviceSetup', 'newOrExisting'], payload, state)
    }
    case AT.SET_SETUP_DEVICE_TYPE: {
      return assocPath(['newDeviceSetup', 'deviceType'], payload, state)
    }
    case AT.SET_NEW_DEVICE_SETUP_STEP: {
      const { done, error, step } = payload
      return assocPath(
        ['newDeviceSetup', 'currentStep'],
        { done, error, step },
        state
      )
    }
    case AT.SET_NEW_DEVICE_SHOW_BTC_WARNING: {
      return assocPath(['newDeviceSetup', 'showBtcWarning'], payload, state)
    }
    case AT.SET_FIRMWARE_UPDATE_STEP: {
      return assoc('firmware', payload.step, state)
    }
    case AT.RESET_FIRMWARE_INFO: {
      return assoc('firmware', {}, state)
    }
    case AT.SET_DEVICE_TARGET_ID: {
      return assocPath(
        ['appManager', 'targetId'],
        Remote.Success(payload),
        state
      )
    }
    case AT.APP_CHANGE_LOADING: {
      return assocPath(['appManager', 'appChangeStatus'], Remote.Loading, state)
    }
    case AT.APP_CHANGE_FAILURE: {
      return assocPath(
        ['appManager', 'appChangeStatus'],
        Remote.Failure(payload),
        state
      )
    }
    case AT.APP_CHANGE_SUCCESS: {
      return assocPath(
        ['appManager', 'appChangeStatus'],
        Remote.Success(payload),
        state
      )
    }
    case AT.SET_LATEST_APP_INFOS_LOADING: {
      return assocPath(['appManager', 'latestAppInfos'], Remote.Loading, state)
    }
    case AT.SET_LATEST_APP_INFOS_SUCCESS: {
      return assocPath(
        ['appManager', 'latestAppInfos'],
        Remote.Success(payload),
        state
      )
    }
    case AT.RESET_APP_CHANGE_STATUS: {
      return assocPath(
        ['appManager', 'appChangeStatus'],
        Remote.NotAsked,
        state
      )
    }
    case AT.SET_PRODUCT_TOUR_VISIBILITY: {
      return assoc('showProductTour', payload, state)
    }
    case AT.SET_CONNECTION_INFO: {
      return assoc('connection', payload, state)
    }
    case AT.SET_CONNECTION_ERROR: {
      return assocPath(['connection', 'error'], payload.error, state)
    }
    case AT.SET_CONNECTION_READY: {
      return assocPath(['connection', 'ready'], true, state)
    }
    case AT.SET_CONNECTION_SUCCESS: {
      return assocPath(['connection', 'success'], true, state)
    }
    default:
      return state
  }
}
