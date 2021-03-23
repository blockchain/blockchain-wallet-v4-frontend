import { routerActions as router } from 'connected-react-router'

import { coreActions as core } from 'blockchain-wallet-v4/src'

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
import * as ws from './middleware/webSocket/coins/actions'
import * as modals from './modals/actions'
import * as modules from './modules/actions'
import * as preferences from './preferences/actions'
import * as prices from './prices/actions'
import * as session from './session/actions'
import * as wallet from './wallet/actions'
import * as wizard from './wizard/actions'

export {
  alerts,
  analytics,
  auth,
  cache,
  components,
  core,
  custodial,
  form,
  goals,
  logs,
  middleware,
  modals,
  modules,
  preferences,
  prices,
  router,
  session,
  wallet,
  wizard,
  ws // TODO
}
