import * as activity from './Activity/actions.js'
import * as auth from './Auth/actions.js'
import * as interactivity from './Interactivity/actions.js'
import * as form from './Form/actions.js'
import * as log from './Log/actions.js'
import * as modals from './Modals/actions.js'
import * as preferences from './Preferences/actions.js'
import * as alerts from './Alerts/actions.js'
import { coreActions as core } from 'dream-wallet/lib'

export {
  core,
  activity,
  auth,
  interactivity,
  form,
  log,
  modals,
  preferences,
  alerts
}
