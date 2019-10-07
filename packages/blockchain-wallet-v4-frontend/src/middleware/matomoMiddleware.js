import { contains, path, prop } from 'ramda'

const PAYLOAD = ['payload']
const NAME = ['payload', 'name']
const TYPE = ['payload', 'type']
const FORM = ['meta', 'form']
const FIELD = ['meta', 'field']
const LOCATION = ['payload', 'location', 'pathname']

// keep alphabetized
const TYPE_WHITELIST = [
  '@@redux-form/CHANGE',
  '@@redux-form/SET_SUBMIT_SUCCEEDED',
  '@@router/LOCATION_CHANGE',
  '@ANALYTICS.LOG_EVENT',
  '@CORE.SET_ACCOUNT_ARCHIVED',
  '@CORE.SET_ACCOUNT_LABEL',
  '@CORE.SET_DEFAULT_ACCOUNT',
  '@EVENT.KYC.INITIALIZE_VERIFICATION',
  '@EVENT.KYC.UPDATE_EMAIL',
  'LOG_ERROR_MSG',
  'SHOW_MODAL'
]

const matomoMiddleware = () => store => next => action => {
  const eventCategory = prop('type', action)
  const nextAction =
    path(FORM, action) ||
    path(NAME, action) ||
    path(TYPE, action) ||
    path(LOCATION, action) ||
    path(PAYLOAD, action)
  const eventName = path(FIELD, action)
  const eventAction =
    typeof nextAction !== 'string' ? JSON.stringify(nextAction) : nextAction
  const logEvent = contains(action.type, TYPE_WHITELIST)

  // if (logEvent) {
  //   window._paq.push(['trackEvent', eventCategory, eventAction, eventName])
  // }
  console.log('action', action)
  console.log('logEvent', logEvent)
  if (logEvent) {
    console.log(['trackEvent', eventCategory, eventAction, eventName])
  }

  return next(action)
}

export default matomoMiddleware
