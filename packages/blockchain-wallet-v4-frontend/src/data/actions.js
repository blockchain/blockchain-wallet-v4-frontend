import { coreActions as core } from 'blockchain-wallet-v4/src'
import * as alerts from './alerts/actions.js'
import * as auth from './auth/actions.js'
import * as data from './data/actions.js'
import * as goals from './goals/actions.js'
import * as modals from './modals/actions.js'
import { actions as form } from 'redux-form'
import * as payment from './payment/actions.js'
import * as preferences from './preferences/actions.js'
import { routerActions as router } from 'connected-react-router'
import * as scroll from './scroll/actions.js'
import * as session from './session/actions.js'
import * as settings from './settings/actions.js'
import * as wizard from './wizard/actions.js'
import * as wallet from './wallet/actions.js'

export {
  core,
  alerts,
  auth,
  data,
  goals,
  form,
  modals,
  payment,
  preferences,
  router,
  scroll,
  session,
  settings,
  wizard,
  wallet
}
