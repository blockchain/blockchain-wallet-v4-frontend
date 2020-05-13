import { equals, includes, path, prop } from 'ramda'

const PAYLOAD = ['payload']
const NAME = ['payload', 'name']
const TYPE = ['payload', 'type']
const PROPS = ['payload', 'props']
const FORM = ['meta', 'form']
const FIELD = ['meta', 'field']
const LOCATION = ['payload', 'location', 'pathname']
const _ERROR = ['payload', '_error']

// keep alphabetized
const TYPE_WHITELIST = [
  '@@redux-form/CHANGE',
  '@@redux-form/INITIALIZE',
  '@@redux-form/SET_SUBMIT_SUCCEEDED',
  '@@redux-form/STOP_SUBMIT',
  '@@redux-form/START_SUBMIT',
  '@@router/LOCATION_CHANGE',
  '@CORE.SET_ACCOUNT_ARCHIVED',
  '@CORE.SET_ACCOUNT_LABEL',
  '@CORE.SET_DEFAULT_ACCOUNT',
  '@CORE.SET_EMAIL_VERIFIED',
  '@EVENT.KYC.INITIALIZE_VERIFICATION',
  '@EVENT.KYC.UPDATE_EMAIL',
  '@EVENT.BORROW.SET_STEP',
  '@EVENT.SET_SB_STEP',
  'CLOSE_MODAL',
  'SHOW_MODAL'
]

const EVENT_ACTION_BLACKLIST = ['ShowXPub']

let lastEvent = []

const formatEvent = x => (typeof x !== 'string' ? JSON.stringify(x) : x)

const matomoMiddleware = () => store => next => action => {
  try {
    const eventCategory = prop('type', action)
    const nextAction =
      path(FORM, action) ||
      path(NAME, action) ||
      path(TYPE, action) ||
      path(LOCATION, action) ||
      path(PAYLOAD, action)
    const nextName =
      path(FIELD, action) || path(_ERROR, action) || path(PROPS, action)
    const eventAction = formatEvent(nextAction)
    const eventName = formatEvent(nextName)
    const logEvent = includes(action.type, TYPE_WHITELIST)
    const nextEvent = [eventCategory, eventAction, eventName]

    if (
      logEvent &&
      !equals(nextEvent, lastEvent) &&
      !includes(eventAction, EVENT_ACTION_BLACKLIST)
    ) {
      // console.info('EVENT', nextEvent) // uncomment to assist with debugging
      const frame = document.getElementById('matomo-iframe')
      frame &&
        frame.contentWindow &&
        frame.contentWindow.postMessage(
          {
            method: 'trackEvent',
            messageData: nextEvent
          },
          '*'
        )

      lastEvent = nextEvent
    }
  } catch (e) {
    /* eslint-disable-next-line */
    console.log(e)
  }

  return next(action)
}

export default matomoMiddleware
