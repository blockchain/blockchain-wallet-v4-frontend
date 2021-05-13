import { v4 } from 'uuid'

import { getCardTypeByValue } from 'components/Form/CreditCardBox/model'
import { actionTypes as AT } from 'data'
import { ModalNamesType, ModalOriginType } from 'data/types'
import queuevent from 'utils/queuevent'

enum AnalyticsKey {
  BUY_AMOUNT_ENTERED = 'Buy Amount Entered',
  BUY_AMOUNT_MAX_CLICKED = 'Buy Amount Max Clicked',
  BUY_AMOUNT_MIN_CLICKED = 'Buy Amount Min Clicked',
  BUY_LEARN_MORE_CLICKED = 'Buy Learn More Clicked',
  BUY_PAYMENT_METHOD_SELECTED = 'Buy Payment Method Selected',
  CARD_REJECTED = 'Card Rejected',
  MODAL_VIEW = 'Page Viewed',
  PAGE_VIEW = 'Page Viewed'
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
  title: string
  url: string
}

type PageViewPayload = BasePayload & {
  page: string
  referrer: string
  title: string
  url: string
}

type BuyAmountEnteredPayload = BasePayload & {
  input_amount: number
  input_amount_max: number
  input_currency: string
  // output_amount: number
  output_currency: string
  platform: 'WALLET'
}

type BuyAmountMaxClickedPayload = BasePayload & {
  amount: number
  // amount_currency: string
  input_currency: string
  output_currency: string
  platform: 'WALLET'
}

type BuyAmountMinClickedPayload = BasePayload & {
  amount: number
  // amount_currency: string
  input_currency: string
  output_currency: string
  platform: 'WALLET'
}

type BuyLearnMoreClickedPayload = BasePayload & {
  platform: 'WALLET'
}

type BuyPaymentMethodSelectedPayload = BasePayload & {
  payment_type: 'BANK_ACCOUNT' | 'BANK_TRANSFER' | 'FUNDS' | 'PAYMENT_CARD'
  platform: 'WALLET'
}

type CardRejectedPayload = BasePayload & {
  card_type: string
  country_billing: string
  product: 'SIMPLE_BUY' | 'SIMPLE_TRADE' | 'SWAP'
  reason: string
}

type AnalyticsPayload =
  | ModalViewPayload
  | PageViewPayload
  | BuyAmountEnteredPayload
  | BuyAmountMaxClickedPayload
  | BuyAmountMinClickedPayload
  | BuyLearnMoreClickedPayload
  | BuyPaymentMethodSelectedPayload
  | CardRejectedPayload

const analytics = queuevent<AnalyticsKey, AnalyticsPayload>({
  queueName: 'analytics',
  queueCallback: async rawEvents => {
    const res = await fetch('/wallet-options-v4.json')
    const options = await res.json()

    const analyticsURL = `${options.domains.api}/events/publish`

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
    default:
      return modalType
  }
}

const modalOriginDictionary = (modalOrigin: ModalOriginType) => {
  switch (modalOrigin) {
    default:
      return modalOrigin
  }
}

const getOriginalTimestamp = () => new Date().toISOString()

const analyticsMiddleware = () => store => next => action => {
  try {
    switch (action.type) {
      case '@@INIT': {
        analytics.clear()
        break
      }
      case AT.analytics.LOG_PAGE_VIEW: {
        const referrer = document.referrer
        const title = document.title
        const url = window.location.href
        const page = action.payload.route

        analytics.push(AnalyticsKey.PAGE_VIEW, {
          type: AnalyticsType.VIEW,
          title: title,
          originalTimestamp: getOriginalTimestamp(),
          referrer: referrer,
          page: page,
          url: url
        })
        break
      }
      case AT.modals.SHOW_MODAL: {
        const title = document.title
        const url = window.location.href
        const origin = modalOriginDictionary(action.payload.props?.origin)
        const page = modalNameDictionary(action.payload.type)

        analytics.push(AnalyticsKey.MODAL_VIEW, {
          type: AnalyticsType.VIEW,
          title: title,
          originalTimestamp: getOriginalTimestamp(),
          referrer: url,
          origin: origin,
          page: page,
          url: url
        })
        break
      }
      case AT.components.simpleBuy.CREATE_ORDER: {
        const state = store.getState()
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const inputAmount = Number(state.form.simpleBuyCheckout.values.amount)
        const inputAMountMax =
          Number(state.components.simpleBuy.pair.buyMax) / 100
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_ENTERED, {
          type: AnalyticsType.EVENT,
          originalTimestamp: getOriginalTimestamp(),
          input_amount: inputAmount,
          input_amount_max: inputAMountMax,
          input_currency: inputCurrency,
          // output_amount: 123,
          output_currency: outputCurrency,
          platform: 'WALLET'
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_MAX_AMOUNT_CLICK: {
        const state = store.getState()
        const amount = Number(action.payload.amount) / 100
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MAX_CLICKED, {
          type: AnalyticsType.EVENT,
          originalTimestamp: getOriginalTimestamp(),
          amount: amount,
          input_currency: inputCurrency,
          output_currency: outputCurrency,
          platform: 'WALLET'
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const amount = Number(action.payload.amount) / 100
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MIN_CLICKED, {
          type: AnalyticsType.EVENT,
          originalTimestamp: getOriginalTimestamp(),
          amount: amount,
          input_currency: inputCurrency,
          output_currency: outputCurrency,
          platform: 'WALLET'
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_METHOD_CHANGE: {
        const paymentType = action.method.type

        analytics.push(AnalyticsKey.BUY_PAYMENT_METHOD_SELECTED, {
          type: AnalyticsType.EVENT,
          originalTimestamp: getOriginalTimestamp(),
          payment_type: paymentType,
          platform: 'WALLET'
        })
        break
      }
      case AT.components.simpleBuy.ADD_CARD_DETAILS_FAILURE: {
        const state = store.getState()
        const cardType =
          getCardTypeByValue(state.form.addCCForm.values['card-number'])
            ?.type || 'NOT_KNOWN'
        const countryBilling =
          state.form.addCCForm.values.billingAddress.country
        const reason = state.form.addCCForm.error

        analytics.push(AnalyticsKey.CARD_REJECTED, {
          type: AnalyticsType.EVENT,
          originalTimestamp: getOriginalTimestamp(),
          card_type: cardType,
          country_billing: countryBilling,
          product: 'SIMPLE_BUY',
          reason: reason
        })
        break
      }
    }
  } catch (e) {}

  return next(action)
}

export default analyticsMiddleware
