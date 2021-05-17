import { v4 } from 'uuid'

import { getCardTypeByValue } from 'components/Form/CreditCardBox/model'
import { actionTypes as AT } from 'data'
import queuevent from 'utils/queuevent'

enum AnalyticsKey {
  BUY_AMOUNT_ENTERED = 'Buy Amount Entered',
  BUY_AMOUNT_MAX_CLICKED = 'Buy Amount Max Clicked',
  BUY_AMOUNT_MIN_CLICKED = 'Buy Amount Min Clicked',
  BUY_LEARN_MORE_CLICKED = 'Buy Learn More Clicked',
  BUY_PAYMENT_METHOD_SELECTED = 'Buy Payment Method Selected',
  CARD_REJECTED = 'Card Rejected',
}

type BasePayload = {
  originalTimestamp: string
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
  | BuyAmountEnteredPayload
  | BuyAmountMaxClickedPayload
  | BuyAmountMinClickedPayload
  | BuyLearnMoreClickedPayload
  | BuyPaymentMethodSelectedPayload
  | CardRejectedPayload

const analytics = queuevent<AnalyticsKey, AnalyticsPayload>({
  queueCallback: async (rawEvents) => {
    const res = await fetch('/wallet-options-v4.json')
    const options = await res.json()

    const analyticsURL = `${options.domains.api}/events/publish`

    const id = v4()

    const context = {}

    const events = rawEvents.map((event) => {
      const name = event.key

      const { originalTimestamp, ...properties } = event.payload

      return {
        name,
        originalTimestamp,
        properties,
      }
    })

    await fetch(analyticsURL, {
      body: JSON.stringify({
        context,
        events,
        id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  },
  queueName: 'analytics',
})

const getOriginalTimestamp = () => new Date().toISOString()

const analyticsMiddleware = () => (store) => (next) => (action) => {
  try {
    switch (action.type) {
      case '@@INIT': {
        analytics.clear()
        break
      }

      case AT.components.simpleBuy.CREATE_ORDER: {
        const state = store.getState()
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const inputAmount = Number(state.form.simpleBuyCheckout.values.amount)
        const inputAMountMax = Number(state.components.simpleBuy.pair.buyMax) / 100
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_ENTERED, {
          input_amount: inputAmount,
          input_amount_max: inputAMountMax,
          input_currency: inputCurrency,
          originalTimestamp: getOriginalTimestamp(),
          // output_amount: 123,
          output_currency: outputCurrency,

          platform: 'WALLET',
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_MAX_AMOUNT_CLICK: {
        const state = store.getState()
        const amount = Number(action.payload.amount) / 100
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MAX_CLICKED, {
          amount,
          input_currency: inputCurrency,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency,
          platform: 'WALLET',
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const amount = Number(action.payload.amount) / 100
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MIN_CLICKED, {
          amount,
          input_currency: inputCurrency,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency,
          platform: 'WALLET',
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_METHOD_CHANGE: {
        const paymentType = action.method.type

        analytics.push(AnalyticsKey.BUY_PAYMENT_METHOD_SELECTED, {
          originalTimestamp: getOriginalTimestamp(),
          payment_type: paymentType,
          platform: 'WALLET',
        })
        break
      }
      case AT.components.simpleBuy.ADD_CARD_DETAILS_FAILURE: {
        const state = store.getState()
        const cardType =
          getCardTypeByValue(state.form.addCCForm.values['card-number'])?.type || 'NOT_KNOWN'
        const countryBilling = state.form.addCCForm.values.billingAddress.country
        const reason = state.form.addCCForm.error

        analytics.push(AnalyticsKey.CARD_REJECTED, {
          card_type: cardType,
          country_billing: countryBilling,
          originalTimestamp: getOriginalTimestamp(),
          product: 'SIMPLE_BUY',
          reason,
        })
        break
      }
      default: {
        break
      }
    }
  } catch (e) {
    // nothing
  }

  return next(action)
}

export default analyticsMiddleware
