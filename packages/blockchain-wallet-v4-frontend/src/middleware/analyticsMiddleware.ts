import queuevent from 'utils/queuevent'
import { actionTypes as AT } from 'data'
import { v4 } from 'uuid'

enum AnalyticsKey {
  PAGE_VIEW = 'Page View',
  MODAL_VIEW = 'Page View'
}

enum AnalyticsType {
  EVENT = 'EVENT',
  VIEW = 'VIEW'
}

type AnalyticsPayload = {
  type: AnalyticsType
  originalTimestamp: string
  page: string
}

const analyticsURL = 'https://api.dev.blockchain.info/events/publish'

const analytics = queuevent<AnalyticsKey, AnalyticsPayload>({
  queueName: 'analytics',
  queueCallback: async rawEvents => {
    const id = v4()

    const context = {}

    const events = rawEvents.map(event => {
      const name = event.key

      const { type, originalTimestamp, ...properties } = event.payload

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

const analyticsMiddleware = () => () => next => action => {
  switch (action.type) {
    case '@@INIT':
      analytics.clear()
      break
    case AT.analytics.LOG_PAGE_VIEW:
      analytics.push(AnalyticsKey.PAGE_VIEW, {
        type: AnalyticsType.VIEW,
        originalTimestamp: new Date().toISOString(),
        page: action.payload.route
      })
      break
    case AT.modals.SHOW_MODAL:
      analytics.push(AnalyticsKey.MODAL_VIEW, {
        type: AnalyticsType.VIEW,
        originalTimestamp: new Date().toISOString(),
        page: action.payload.type
      })
      break
  }

  return next(action)
}

export default analyticsMiddleware
