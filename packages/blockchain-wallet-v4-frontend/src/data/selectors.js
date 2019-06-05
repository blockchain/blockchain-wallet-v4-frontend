import { coreSelectors as core } from 'blockchain-wallet-v4/src'
import * as alerts from './alerts/selectors'
import * as analytics from './analytics/selectors'
import * as auth from './auth/selectors'
import * as cache from './cache/selectors'
import * as components from './components/selectors'
import * as exchange from './exchange/selectors'
import * as form from './form/selectors'
import * as goals from './goals/selectors'
import * as logs from './logs/selectors'
import * as modals from './modals/selectors'
import * as modules from './modules/selectors'
import * as preferences from './preferences/selectors'
import * as router from './router/selectors'
import * as session from './session/selectors'
import * as wizard from './wizard/selectors'

// TODO: SEGWIT where do we want to get this information from?
// TODO: SEGWIT this selector should for sure be somewhere else
// TODO: SEGWIT if we keep this, it should be moved to core, so both core and frontend can use
export const selectDefaultDerivationType = state => 'segwitP2SH'

export {
  alerts,
  analytics,
  auth,
  cache,
  components,
  exchange,
  form,
  core,
  goals,
  logs,
  modals,
  modules,
  preferences,
  router,
  session,
  wizard
}
