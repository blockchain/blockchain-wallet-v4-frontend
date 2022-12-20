import { routerActions as router } from 'connected-react-router'

import { coreActions as core } from '@core'

import { actions as alerts } from './alerts/slice'
import * as analytics from './analytics/slice'
import { actions as auth } from './auth/slice'
import { actions as cache } from './cache/slice'
import * as components from './components/actions'
import { actions as custodial } from './custodial/slice'
import { actions as experiments } from './experiments/slice'
import * as form from './form/actions'
import { actions as goals } from './goals/slice'
import { actions as logs } from './logs/slice'
import * as middleware from './middleware/actions'
import * as ws from './middleware/webSocket/coins/actions'
import { actions as misc } from './misc/slice'
import { actions as modals } from './modals/slice'
import * as modules from './modules/actions'
import * as preferences from './preferences/actions'
import { actions as prices } from './prices/slice'
import { actions as session } from './session/slice'
import { actions as signup } from './signup/slice'
import * as wallet from './wallet/actions'

export {
  alerts,
  analytics,
  auth,
  cache,
  components,
  core,
  custodial,
  experiments,
  form,
  goals,
  logs,
  middleware,
  misc,
  modals,
  modules,
  preferences,
  prices,
  router,
  session,
  signup,
  wallet,
  ws
}
