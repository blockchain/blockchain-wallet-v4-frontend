import { v4 } from 'uuid'

import { getCardTypeByValue } from 'components/Form/CreditCardBox/model'
import { actionTypes as AT } from 'data'
import { ModalNamesType, SBShowModalOriginType } from 'data/types'
import queuevent from 'utils/queuevent'

enum AnalyticsKey {
  BUY_AMOUNT_ENTERED = 'Buy Amount Entered',
  BUY_AMOUNT_MAX_CLICKED = 'Buy Amount Max Clicked',
  BUY_AMOUNT_MIN_CLICKED = 'Buy Amount Min Clicked',
  BUY_LEARN_MORE_CLICKED = 'Buy Learn More Clicked',
  BUY_PAYMENT_METHOD_SELECTED = 'Buy Payment Method Selected',
  BUY_SELL_CLICKED = 'Buy Sell Clicked',
  BUY_SELL_VIEWED = 'Buy Sell Viewed',
  CARD_REJECTED = 'Card Rejected',
  DASHBOARD_CLICKED = 'Dashboard Clicked',
  DASHBOARD_VIEWED = 'Dashboard Viewed',
  EMAIL_VERIFICATION_CLICKED = 'Email Verification Clicked',
  SIGNED_IN = 'Signed In',
  SIGNED_OUT = 'Signed Out',
  // SWAP_ACCOUNTS_SELECTED = 'Swap Accounts Selected', // not implemented
  // SWAP_AMOUNT_ENTERED = 'Swap Amount Entered', // not implemented
  // SWAP_AMOUNT_MAX_CLICKED = 'Swap Amount Max Clicked', // not implemented
  // SWAP_AMOUNT_MIN_CLICKED = 'Swap Amount Min Clicked', // not implemented
  SWAP_CLICKED = 'Swap Clicked',
  // SWAP_FROM_SELECTED = 'Swap From Selected', // not implemented
  // SWAP_RECEIVE_SELECTED = 'Swap Receive Selected', // not implemented
  SWAP_VIEWED = 'Swap Viewed',
  UPGRADE_VERIFICATION_CLICKED = 'Upgrade Verification Clicked'
}

type BasePayload = {
  originalTimestamp: string
}

type PageViewPayload = {
  path: string
  referrer: string
  search: string
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

type BuySellClickedPayload = BasePayload & {
  origin: 'BUY_WIDGET' | string
  // type: "BUY" | "SELL"
}

type BuySellViewedPayload = BasePayload &
  PageViewPayload & {
    // type: "BUY" | "SELL"
  }

type CardRejectedPayload = BasePayload & {
  card_type: string
  country_billing: string
  product: 'SIMPLE_BUY' | 'SIMPLE_TRADE' | 'SWAP'
  reason: string
}

type SwapClickedPayload = BasePayload & {
  origin: 'CURRENCY_PAGE' | 'DASHBOARD_PROMO' | 'NAVIGATION'
}

type SwapViewedPayload = BasePayload & PageViewPayload & {}

type DashboardClickedPayload = BasePayload & {
  origin: 'SIGN_IN'
}

type DashboardViewedPayload = BasePayload & PageViewPayload & {}

type EmailVerificationClicked = BasePayload & {
  // origin: 'SIGN_UP' | 'VERIFICATION'
}

type SignedInPayload = BasePayload & {
  platform: 'WALLET'
}

type SignedUpPayload = BasePayload & {
  platform: 'WALLET'
}

type UpgradeVerificationClickedPayload = BasePayload & {
  // origin:
  //   | 'AIRDROP'
  //   | 'FIAT_FUNDS'
  //   | 'RESUBMISSION'
  //   | 'SAVINGS'
  //   | 'SETTINGS'
  //   | 'SIMPLEBUY'
  //   | 'SIMPLETRADE'
  //   | 'SWAP'
  tier: number
}

type AnalyticsPayload =
  | BuyAmountEnteredPayload
  | BuyAmountMaxClickedPayload
  | BuyAmountMinClickedPayload
  | BuyLearnMoreClickedPayload
  | BuyPaymentMethodSelectedPayload
  | BuySellClickedPayload
  | BuySellViewedPayload
  | CardRejectedPayload
  | SwapClickedPayload
  | SwapViewedPayload
  | DashboardClickedPayload
  | DashboardViewedPayload
  | EmailVerificationClicked
  | SignedInPayload
  | SignedUpPayload
  | UpgradeVerificationClickedPayload

type PageNamesType = '/home' | '/interest'

const simpleBuyOriginDictionary = (rawOrigin: SBShowModalOriginType) => {
  switch (rawOrigin) {
    case 'SimpleBuyLink':
      return 'BUY_WIDGET'
    default: {
      return rawOrigin
    }
  }
}

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
        properties
      }
    })

    await fetch(analyticsURL, {
      body: JSON.stringify({
        context,
        events,
        id
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
  },
  queueName: 'analytics'
})

const getOriginalTimestamp = () => new Date().toISOString()

const analyticsMiddleware = () => (store) => (next) => (action) => {
  try {
    switch (action.type) {
      case '@@INIT': {
        analytics.clear()
        break
      }
      case AT.analytics.LOG_PAGE_VIEW: {
        const pageName: PageNamesType = action.payload.route

        switch (pageName) {
          case '/home': {
            const { href, pathname, search } = window.location
            const { referrer, title } = document

            analytics.push(AnalyticsKey.DASHBOARD_CLICKED, {
              origin: 'SIGN_IN',
              originalTimestamp: getOriginalTimestamp()
            })

            analytics.push(AnalyticsKey.DASHBOARD_VIEWED, {
              originalTimestamp: getOriginalTimestamp(),
              path: pathname,
              referrer,
              search,
              title,
              url: href
            })

            break
          }
          default: {
            break
          }
        }

        break
      }
      case AT.modals.SHOW_MODAL: {
        const modalName: ModalNamesType = action.payload.type

        switch (modalName) {
          case 'SIMPLE_BUY_MODAL': {
            const rawOrigin = action.payload.props.origin
            const { href, pathname, search } = window.location
            const { referrer, title } = document

            const origin = simpleBuyOriginDictionary(rawOrigin)

            analytics.push(AnalyticsKey.BUY_SELL_CLICKED, {
              origin,
              originalTimestamp: getOriginalTimestamp()
            })

            analytics.push(AnalyticsKey.BUY_SELL_VIEWED, {
              originalTimestamp: getOriginalTimestamp(),
              path: pathname,
              referrer,
              search,
              title,
              url: href
            })

            break
          }
          case 'SWAP_MODAL': {
            const { origin } = action.payload.props
            const { href, pathname, search } = window.location
            const { referrer, title } = document

            analytics.push(AnalyticsKey.SWAP_CLICKED, {
              origin,
              originalTimestamp: getOriginalTimestamp()
            })

            analytics.push(AnalyticsKey.SWAP_VIEWED, {
              originalTimestamp: getOriginalTimestamp(),
              path: pathname,
              referrer,
              search,
              title,
              url: href
            })

            break
          }
          case 'KYC_MODAL': {
            const { tier } = action.payload.props

            analytics.push(AnalyticsKey.SWAP_CLICKED, {
              originalTimestamp: getOriginalTimestamp(),
              tier
            })
            break
          }
          default: {
            break
          }
        }

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
          amount,
          input_currency: inputCurrency,
          originalTimestamp: getOriginalTimestamp(),
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
          amount,
          input_currency: inputCurrency,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency,
          platform: 'WALLET'
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_METHOD_CHANGE: {
        const paymentType = action.method.type

        analytics.push(AnalyticsKey.BUY_PAYMENT_METHOD_SELECTED, {
          originalTimestamp: getOriginalTimestamp(),
          payment_type: paymentType,
          platform: 'WALLET'
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
          reason
        })
        break
      }
      case AT.auth.VERIFY_EMAIL_TOKEN_SUCCESS: {
        analytics.push(AnalyticsKey.EMAIL_VERIFICATION_CLICKED, {
          originalTimestamp: getOriginalTimestamp()
        })
        break
      }
      case AT.auth.LOGIN_SUCCESS: {
        analytics.push(AnalyticsKey.SIGNED_IN, {
          originalTimestamp: getOriginalTimestamp(),
          platform: 'WALLET'
        })
        break
      }
      case AT.auth.LOGOUT: {
        analytics.push(AnalyticsKey.SIGNED_OUT, {
          originalTimestamp: getOriginalTimestamp(),
          platform: 'WALLET'
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
