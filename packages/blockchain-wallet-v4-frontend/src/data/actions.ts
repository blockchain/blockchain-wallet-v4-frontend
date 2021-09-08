import { routerActions as router } from 'connected-react-router'

import { coreActions as core } from 'blockchain-wallet-v4/src'

import { actions as alerts } from './alerts/slice'
import { actions as analytics } from './analytics/slice'
import { actions as auth } from './auth/slice'
import { actions as cache } from './cache/slice'
import * as components from './components/actions'
import * as custodial from './custodial/actions'
import * as form from './form/actions'
import { actions as goals } from './goals/slice'
import { actions as logs } from './logs/slice'
import * as middleware from './middleware/actions'
import * as ws from './middleware/webSocket/coins/actions'
import * as modals from './modals/actions'
import * as modules from './modules/actions'
import * as preferences from './preferences/actions'
import { actions as prices } from './prices/slice'
import { actions as session } from './session/slice'
import * as wallet from './wallet/actions'

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
  ws
}
