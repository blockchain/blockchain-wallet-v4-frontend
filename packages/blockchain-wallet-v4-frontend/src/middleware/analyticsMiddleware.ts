import { v4 } from 'uuid'

import { actionTypes as AT } from 'data'
// import { ModalNamesType, ModalOriginType } from 'data/types'
import queuevent from 'utils/queuevent'

enum AnalyticsKey {
  MODAL_VIEW = 'Page View',
  PAGE_VIEW = 'Page View'
}

enum AnalyticsType {
  EVENT = 'EVENT',
  VIEW = 'VIEW'
}

type ModalViewPayload = {
  origin: string
  originalTimestamp: string
  page: string
  referrer: string
  type: AnalyticsType.VIEW
}

type PageViewPayload = {
  originalTimestamp: string
  page: string
  referrer: string
  type: AnalyticsType.VIEW
}

type AnalyticsPayload = ModalViewPayload | PageViewPayload

const analyticsURL = 'https://api.dev.blockchain.info/events/publish'

const analytics = queuevent<AnalyticsKey, AnalyticsPayload>({
  queueName: 'analytics',
  queueCallback: async rawEvents => {
    const id = v4()

    const context = {}

    const events = rawEvents.map(event => {
      const name = event.key

      const { originalTimestamp, type, ...properties } = event.payload

      return {
        name,
        type,
        originalTimestamp,
        properties
      }
    })

    await fetch(analyticsURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        context,
        events
      })
    })
  }
})

// const modalNameDictionary = (modalType: ModalNamesType) => {
//   switch (modalType) {
//     case 'SEND_BCH_MODAL':
//       return '/send'
//   }
// }

// const modalOriginDictionary = (modalOrigin: ModalOriginType) => {
//   switch (modalOrigin) {
//     case 'AddBankModal':
//       return '/send'
//   }
// }

const getOriginalTimestamp = () => new Date().toISOString()

const analyticsMiddleware = () => store => next => action => {
  const referrer = document.referrer
  const location = window.location.href
  const state = store.getState()

  // eslint-disable-next-line no-console
  console.log(state)

  switch (action.type) {
    case '@@INIT':
      analytics.clear()
      break
    case AT.analytics.LOG_PAGE_VIEW:
      analytics.push(AnalyticsKey.PAGE_VIEW, {
        type: AnalyticsType.VIEW,
        originalTimestamp: getOriginalTimestamp(),
        referrer: referrer,
        page: action.payload.route
      })
      break
    case AT.modals.SHOW_MODAL:
      analytics.push(AnalyticsKey.MODAL_VIEW, {
        type: AnalyticsType.VIEW,
        originalTimestamp: getOriginalTimestamp(),
        referrer: location,
        origin: action.payload.props.origin,
        page: action.payload.type
      })
      break
  }

  return next(action)
}

export default analyticsMiddleware
