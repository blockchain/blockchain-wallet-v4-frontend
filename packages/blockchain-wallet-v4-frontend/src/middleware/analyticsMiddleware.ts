import { v4 } from 'uuid'

import { actionTypes as AT } from 'data'
import { ModalNamesType, ModalOriginType } from 'data/types'
import queuevent from 'utils/queuevent'

enum AnalyticsKey {
  KYC_INITIALIZE_VERIFICATION = 'KYC Initialized',
  MODAL_VIEW = 'Page View',
  PAGE_VIEW = 'Page View'
}

enum AnalyticsType {
  EVENT = 'EVENT',
  VIEW = 'VIEW'
}

type BasePayload = {
  originalTimestamp: string
  type: AnalyticsType
}

type ModalViewPayload = BasePayload & {
  origin: string
  page: string
  referrer: string
}

type PageViewPayload = BasePayload & {
  page: string
  referrer: string
}

type KYCPayload = BasePayload & {
  language: string
}

type AnalyticsPayload = ModalViewPayload | PageViewPayload | KYCPayload

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

const modalNameDictionary = (modalType: ModalNamesType): string => {
  switch (modalType) {
    case 'SEND_BCH_MODAL':
      return '/send'
    default:
      return modalType
  }
}

const modalOriginDictionary = (modalOrigin: ModalOriginType) => {
  switch (modalOrigin) {
    case 'AddBankModal':
      return 'ADD_BANK_MODAL'
    default:
      return modalOrigin
  }
}

const getOriginalTimestamp = () => new Date().toISOString()

const analyticsMiddleware = () => store => next => action => {
  const referrer = document.referrer
  const location = window.location.href
  const state = store.getState()
  const language = state.preferences.language

  try {
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
          origin: modalOriginDictionary(action.payload.props.origin),
          page: modalNameDictionary(action.payload.type)
        })
        break
      case AT.components.identityVerification.INITIALIZE_VERIFICATION:
        analytics.push(AnalyticsKey.KYC_INITIALIZE_VERIFICATION, {
          type: AnalyticsType.EVENT,
          originalTimestamp: getOriginalTimestamp(),
          language: language
        })
        break
    }
  } catch (e) {
    // eslint-disable-next-line
    console.log(e)
  }

  return next(action)
}

export default analyticsMiddleware
