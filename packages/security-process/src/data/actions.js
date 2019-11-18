import { coreActions as core } from 'blockchain-wallet-v4/src'
import * as alerts from './alerts/actions'
import * as analytics from './analytics/actions'
import * as auth from './auth/actions'
import * as cache from './cache/actions'
import * as components from './components/actions'
import * as goals from './goals/actions'
import * as logs from './logs/actions'
import * as modals from './modals/actions'
import * as modules from './modules/actions'
import * as form from './form/actions'
import * as preferences from './preferences/actions'
import { routerActions as router } from 'connected-react-router'
import * as session from './session/actions'
import * as wizard from './wizard/actions'
import * as wallet from './wallet/actions'

export {
  analytics,
  cache,
  core,
  components,
  alerts,
  auth,
  goals,
  logs,
  form,
  modals,
  modules,
  preferences,
  router,
  session,
  wizard,
  wallet
}
