import { contains, path, prop } from 'ramda'

const PAYLOAD = ['payload']
const NAME = ['payload', 'name']
const TYPE = ['payload', 'type']
const FORM = ['meta', 'form']
const FIELD = ['meta', 'field']

// keep alphabetized
const TYPE_WHITELIST = [
  '@@redux-form/CHANGE',
  '@@redux-form/SET_SUBMIT_SUCCEEDED',
  '@EVENT.KYC.INITIALIZE_VERIFICATION',
  '@EVENT.KYC.UPDATE_EMAIL',
  'LOG_ERROR_MSG',
  'SHOW_MODAL'
]

const matomoMiddleware = () => store => next => action => {
  const eventCategory = prop('type', action)
  const eventAction =
    path(FORM, action) ||
    path(NAME, action) ||
    path(TYPE, action) ||
    JSON.stringify(path(PAYLOAD, action))
  const eventName = path(FIELD, action)

  const logEvent = contains(action.type, TYPE_WHITELIST)

  if (logEvent) {
    window._paq.push(['trackEvent', eventCategory, eventAction, eventName])
  }
  // if (logEvent) {
  // console.log('action', action)
  // console.log('logEvent', logEvent)
  // console.log(['trackEvent', eventCategory, eventAction, eventName])
  // }

  return next(action)
}

export default matomoMiddleware
