import * as alerts from './alerts/actions'
import * as analytics from './analytics/actions'
import * as auth from './auth/actions'
import * as cache from './cache/actions'
import * as components from './components/actions'
import * as custodial from './custodial/actions'
import * as form from './form/actions'
import * as goals from './goals/actions'
import * as logs from './logs/actions'
import * as middleware from './middleware/actions'
import * as modals from './modals/actions'
import * as modules from './modules/actions'
import * as preferences from './preferences/actions'
import * as session from './session/actions'
import * as wallet from './wallet/actions'
import * as wizard from './wizard/actions'
import * as ws from './middleware/webSocket/coins/actions'
import { coreActions as core } from 'blockchain-wallet-v4/src'
import { routerActions as router } from 'connected-react-router'

export {
  analytics,
  cache,
  core,
  components,
  custodial,
  alerts,
  auth,
  goals,
  logs,
  form,
  middleware,
  ws, // TODO
  modals,
  modules,
  preferences,
  router,
  session,
  wizard,
  wallet
}
