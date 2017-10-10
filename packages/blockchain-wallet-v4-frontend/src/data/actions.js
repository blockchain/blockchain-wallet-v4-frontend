import { coreActions as core } from 'blockchain-wallet-v4/src'
import * as alerts from './Alerts/actions.js'
import * as auth from './Auth/actions.js'
import * as data from './Data/actions.js'
import * as modals from './Modals/actions.js'
import { actions as form } from 'redux-form'
import * as payment from './Payment/actions.js'
import * as preferences from './Preferences/actions.js'
import { routerActions as router } from 'react-router-redux'
import * as scroll from './Scroll/actions.js'
import * as session from './Session/actions.js'
import * as settings from './Settings/actions.js'
import * as wizard from './Wizard/actions.js'
import * as wallet from './Wallet/actions.js'

export {
  core,
  alerts,
  auth,
  data,
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
