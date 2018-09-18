import { assocPath } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

// TODO: simplify installs state once app store is introduced
const INITIAL_STATE = {
  connection: {},
  firmware: {},
  installs: {
    apps: {
      BTC: Remote.NotAsked,
      BCH: Remote.NotAsked,
      ETH: Remote.NotAsked
    },
    blockchain: Remote.NotAsked
  },
  newDeviceSetup: {
    device: Remote.NotAsked,
    isAuthentic: Remote.NotAsked
  }
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.RESET_CONNECTION_STATUS: {
      return assocPath(['connection'], {}, state)
    }
    case AT.SET_NEW_DEVICE_SETUP_STEP: {
      const { step, done, error } = payload
      return assocPath(
        ['newDeviceSetup', 'currentStep'],
        { step, done, error },
        state
      )
    }
    case AT.CHECK_DEVICE_AUTHENTICITY_LOADING: {
      return assocPath(['newDeviceSetup', 'isAuthentic'], Remote.Loading, state)
    }
    case AT.CHECK_DEVICE_AUTHENTICITY_FAILURE: {
      return assocPath(
        ['newDeviceSetup', 'isAuthentic'],
        Remote.Failure(payload),
        state
      )
    }
    case AT.CHECK_DEVICE_AUTHENTICITY_SUCCESS: {
      return assocPath(
        ['newDeviceSetup', 'isAuthentic'],
        Remote.Success(payload),
        state
      )
    }
    case AT.SET_FIRMWARE_UPDATE_STEP: {
      return assocPath(['firmware', 'step'], payload.step, state)
    }
    case AT.SET_FIRMWARE_INSTALLED_INFO: {
      return assocPath(
        ['firmware', 'versions', 'installed'],
        payload.info,
        state
      )
    }
    case AT.SET_FIRMWARE_LATEST_INFO: {
      return assocPath(['firmware', 'versions', 'latest'], payload.info, state)
    }
    case AT.RESET_FIRMWARE_INFO: {
      return assocPath(['firmware'], {}, state)
    }
    case AT.INSTALL_APPLICATION: {
      return assocPath(['installs', 'apps', payload.app], Remote.Loading, state)
    }
    case AT.INSTALL_APPLICATION_FAILURE: {
      return assocPath(
        ['installs', 'apps', payload.app],
        Remote.Failure(payload),
        state
      )
    }
    case AT.INSTALL_APPLICATION_SUCCESS: {
      return assocPath(
        ['installs', 'apps', payload.app],
        Remote.Success(payload),
        state
      )
    }
    // TODO: remove Blockchain app reducers once app store is introduced
    case AT.INSTALL_BLOCKCHAIN_APPS: {
      return assocPath(['installs', 'blockchain'], Remote.Loading, state)
    }
    case AT.INSTALL_BLOCKCHAIN_APPS_FAILURE: {
      return assocPath(
        ['installs', 'blockchain'],
        Remote.Failure(payload),
        state
      )
    }
    case AT.INSTALL_BLOCKCHAIN_APPS_SUCCESS: {
      return assocPath(
        ['installs', 'blockchain'],
        Remote.Success(payload),
        state
      )
    }
    case AT.RESET_APPS_INSTALL_STATUS: {
      return assocPath(
        ['installs', 'apps'],
        {
          BTC: Remote.NotAsked,
          BCH: Remote.NotAsked,
          ETH: Remote.NotAsked
        },
        state
      )
    }
    case AT.SET_CONNECTION_INFO: {
      return assocPath(['connection'], payload, state)
    }
    case AT.SET_CONNECTION_ERROR: {
      return assocPath(['connection', 'error'], payload.error, state)
    }
    case AT.SET_NEW_DEVICE_INFO: {
      return assocPath(
        ['newDeviceSetup', 'device'],
        Remote.Success(payload.deviceInfo),
        state
      )
    }
    case AT.SET_CONNECTION_READY: {
      return assocPath(['connection', 'ready'], true, state)
    }
    default:
      return state
  }
}
