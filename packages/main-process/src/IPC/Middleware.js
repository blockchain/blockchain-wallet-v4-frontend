import * as router from 'connected-react-router'

import * as coreTypes from 'blockchain-wallet-v4/src/redux/actionTypes'
import * as types from '../data/actionTypes'

const alreadyForwarded = ({ meta }) => meta && meta.forwarded

const dispatchToSecurityProcess = ({ securityProcess }, action) => {
  securityProcess.dispatch(action)
}

const dispatchToRootProcess = ({ rootProcessDispatch }, action) => {
  rootProcessDispatch(action)
}

const ROOT_LOCATION_CHANGE = ({ rootProcessDispatch }, { payload }) => {
  rootProcessDispatch({ type: router.LOCATION_CHANGE, payload })
}

const handlers = {
  // Security Center needs settings.
  [coreTypes.settings.FETCH_SETTINGS_FAILURE]: dispatchToSecurityProcess,
  [coreTypes.settings.FETCH_SETTINGS_LOADING]: dispatchToSecurityProcess,
  [coreTypes.settings.FETCH_SETTINGS_SUCCESS]: dispatchToSecurityProcess,

  // Tell the Security Process to merge our wrapper with its own.
  [coreTypes.wallet.MERGE_WRAPPER]: dispatchToSecurityProcess,

  // Report a location change to the Root Process instead of processing it
  // ourselves.
  ROOT_LOCATION_CHANGE,

  // Inform the Root Process about routing changes so that it can switch the
  // appropriate process to the foreground.
  [router.LOCATION_CHANGE]: dispatchToRootProcess,

  // Tell the Security Process to reload itself when we do.
  [types.auth.LOGOUT]: dispatchToSecurityProcess
}

export default ({ imports }) => () => next => action => {
  const { type } = action

  if (!alreadyForwarded(action)) {
    if (type in handlers) {
      handlers[type](imports, action)
    } else if (type.startsWith(`@DATA.PREFERENCES.`)) {
      // The Security Process handles persistence for preferences.
      dispatchToSecurityProcess(imports, action)
    }
  }

  return next(action)
}
