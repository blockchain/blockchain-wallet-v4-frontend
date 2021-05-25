import analytics from 'middleware/analyticsMiddleware/analytics'
import type { PageNamesType } from 'middleware/analyticsMiddleware/types'
import { AnalyticsKey, AnalyticsType } from 'middleware/analyticsMiddleware/types'
import {
  getOriginalTimestamp,
  simpleBuyOriginDictionary,
  simpleBuyPaymentTypeDictionary
} from 'middleware/analyticsMiddleware/utils'

import { getCardTypeByValue } from 'components/Form/CreditCardBox/model'
import { actionTypes as AT } from 'data'
import { ModalNamesType } from 'data/types'

const analyticsMiddleware = () => (store) => (next) => (action) => {
  const state = store.getState()
  const nabuId = state.profile.userData.getOrElse({})?.id
  const id = state.walletPath.wallet.guid

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
              id,
              nabuId,
              origin: 'SIGN_IN',
              originalTimestamp: getOriginalTimestamp(),
              type: AnalyticsType.EVENT
            })

            analytics.push(AnalyticsKey.DASHBOARD_VIEWED, {
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              path: pathname,
              referrer,
              search,
              title,
              type: AnalyticsType.EVENT,
              url: href
            })

            analytics.clear()

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
              id,
              nabuId,
              origin,
              originalTimestamp: getOriginalTimestamp(),
              type: AnalyticsType.EVENT
            })

            analytics.push(AnalyticsKey.BUY_SELL_VIEWED, {
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              path: pathname,
              referrer,
              search,
              title,
              type: AnalyticsType.EVENT,
              url: href
            })

            break
          }
          case 'SWAP_MODAL': {
            const { origin } = action.payload.props
            const { href, pathname, search } = window.location
            const { referrer, title } = document

            analytics.push(AnalyticsKey.SWAP_CLICKED, {
              id,
              nabuId,
              origin,
              originalTimestamp: getOriginalTimestamp(),
              type: AnalyticsType.EVENT
            })

            analytics.push(AnalyticsKey.SWAP_VIEWED, {
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              path: pathname,
              referrer,
              search,
              title,
              type: AnalyticsType.EVENT,
              url: href
            })

            break
          }
          case 'KYC_MODAL': {
            const { tier } = action.payload.props

            analytics.push(AnalyticsKey.SWAP_CLICKED, {
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              tier,
              type: AnalyticsType.EVENT
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
          id,
          input_amount: inputAmount,
          input_currency: inputCurrency,
          max_card_limit: inputAMountMax,
          nabuId,

          originalTimestamp: getOriginalTimestamp(),

          // output_amount: 123,
          output_currency: outputCurrency,
          platform: 'WALLET',
          type: AnalyticsType.EVENT
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_MAX_AMOUNT_CLICK: {
        const state = store.getState()
        const maxCardLimit = Number(action.payload.amount) / 100
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MAX_CLICKED, {
          id,
          input_currency: inputCurrency,
          max_card_limit: maxCardLimit,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency,
          platform: 'WALLET',
          type: AnalyticsType.EVENT
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MIN_CLICKED, {
          id,
          input_currency: inputCurrency,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency,
          platform: 'WALLET',
          type: AnalyticsType.EVENT
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_METHOD_CHANGE: {
        const paymentType = action.method.type

        analytics.push(AnalyticsKey.BUY_PAYMENT_METHOD_SELECTED, {
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          payment_type: simpleBuyPaymentTypeDictionary(paymentType),
          platform: 'WALLET',
          type: AnalyticsType.EVENT
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
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          product: 'SIMPLE_BUY',
          reason,
          type: AnalyticsType.EVENT
        })
        break
      }
      case AT.auth.VERIFY_EMAIL_TOKEN_SUCCESS: {
        analytics.push(AnalyticsKey.EMAIL_VERIFICATION_REQUESTED, {
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          type: AnalyticsType.EVENT
        })
        break
      }
      case AT.auth.LOGIN_SUCCESS: {
        analytics.push(AnalyticsKey.SIGNED_IN, {
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          platform: 'WALLET',
          type: AnalyticsType.EVENT
        })
        break
      }
      case AT.auth.LOGOUT: {
        analytics.push(AnalyticsKey.SIGNED_OUT, {
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          platform: 'WALLET',
          type: AnalyticsType.EVENT
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
