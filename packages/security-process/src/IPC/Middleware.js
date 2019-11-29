import * as router from 'connected-react-router'
import { REHYDRATE } from 'redux-persist'

import * as coreTypes from 'blockchain-wallet-v4/src/redux/actionTypes'
import * as Wrapper from 'blockchain-wallet-v4/src/types/Wrapper'
import * as types from '../data/actionTypes'

const alreadyForwarded = ({ meta }) => meta && meta.forwarded

const dispatchToMainProcess = ({ mainProcessDispatch }, action) => {
  mainProcessDispatch(action)
}

const dispatchToRootProcess = ({ rootProcessDispatch }, action) => {
  rootProcessDispatch(action)
}

const ROOT_LOCATION_CHANGE = ({ rootProcessDispatch }, { payload }) => {
  rootProcessDispatch({ type: router.LOCATION_CHANGE, payload })
}

const handlers = {
  // Dispatched by createRoot which requires the seed.
  [coreTypes.kvStore.root.UPDATE_METADATA_ROOT]: dispatchToMainProcess,

  // Dispatched by createXlm which requires the seed.
  [coreTypes.kvStore.xlm.CREATE_METADATA_XLM]: dispatchToMainProcess,

  // Report failure of wallet synchronization.
  [coreTypes.walletSync.SYNC_ERROR]: dispatchToMainProcess,

  // Report success of wallet synchronization.
  [coreTypes.walletSync.SYNC_SUCCESS]: dispatchToMainProcess,

  // We handle persistence for the Main Process.
  [REHYDRATE]: dispatchToMainProcess,

  // Report a location change to the Root Process instead of processing it
  // ourselves.
  ROOT_LOCATION_CHANGE,

  // Inform the Root Process about routing changes so that it can switch the
  // appropriate process to the foreground.
  [router.LOCATION_CHANGE]: dispatchToRootProcess,

  // Proceed with the login routine after receiving the payload.
  [types.auth.AUTHENTICATE]: dispatchToMainProcess,

  [types.goals.SAVE_GOAL]: dispatchToMainProcess
}

// Used to set the wrapper in /recover.
handlers[coreTypes.wallet.REFRESH_WRAPPER] = (
  { mainProcessDispatch },
  action
) => {
  const redactedWrapper = Wrapper.redact(action.payload)
  mainProcessDispatch({ ...action, payload: redactedWrapper })
}

// Send the wrapper to the Main Process after logging in.
handlers[coreTypes.wallet.SET_WRAPPER] =
  handlers[coreTypes.wallet.REFRESH_WRAPPER]

export default ({ imports }) => () => next => action => {
  const { type } = action

  if (!alreadyForwarded(action) && type in handlers) {
    handlers[type](imports, action)
  }

  return next(action)
}
