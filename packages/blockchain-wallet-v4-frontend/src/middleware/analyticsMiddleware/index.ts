import analytics from 'middleware/analyticsMiddleware/analytics'
import type { PageNamesType } from 'middleware/analyticsMiddleware/types'
import {
  AccountType,
  AnalyticsKey,
  AnalyticsType,
  CoinType,
  OrderType
} from 'middleware/analyticsMiddleware/types'
import {
  getNetworkFee,
  getOriginalTimestamp,
  simpleBuyOriginDictionary,
  simpleBuyPaymentTypeDictionary
} from 'middleware/analyticsMiddleware/utils'

import { actionTypes as AT } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
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
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              origin: 'SIGN_IN',
              originalTimestamp: getOriginalTimestamp()
            })

            analytics.push(AnalyticsKey.DASHBOARD_VIEWED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              path: pathname,
              referrer,
              search,
              title,
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
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              origin,
              originalTimestamp: getOriginalTimestamp(),
              type: OrderType.BUY
            })

            analytics.push(AnalyticsKey.BUY_SELL_VIEWED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              path: pathname,
              referrer,
              search,
              title,
              type: OrderType.BUY,
              url: href
            })

            break
          }
          case 'SWAP_MODAL': {
            const { origin } = action.payload.props
            const { href, pathname, search } = window.location
            const { referrer, title } = document

            analytics.push(AnalyticsKey.SWAP_CLICKED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              origin,
              originalTimestamp: getOriginalTimestamp()
            })

            analytics.push(AnalyticsKey.SWAP_VIEWED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              path: pathname,
              referrer,
              search,
              title,
              url: href
            })

            break
          }
          case 'REQUEST_CRYPTO_MODAL': {
            analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
              analyticsType: AnalyticsType.VIEW,
              id,
              nabuId,
              origin: 'NAVIGATION',
              originalTimestamp: getOriginalTimestamp(),
              type: 'RECEIVE'
            })

            analytics.push(AnalyticsKey.SEND_RECEIVE_VIEWED, {
              analyticsType: AnalyticsType.VIEW,
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              type: 'RECEIVE'
            })

            break
          }
          default: {
            break
          }
        }

        break
      }

      case AT.components.interest.SET_COIN_DISPLAY: {
        const { isCoinDisplayed } = action.payload

        const fix = isCoinDisplayed ? CoinType.CRYPTO : CoinType.FIAT

        analytics.push(AnalyticsKey.AMOUNT_SWITCHED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          product: 'SAVINGS',
          switch_to: fix
        })

        break
      }

      case AT.components.swap.SWITCH_FIX: {
        const { fix } = action.payload

        analytics.push(AnalyticsKey.AMOUNT_SWITCHED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          product: 'SWAP',
          switch_to: fix
        })

        break
      }

      case AT.components.simpleBuy.SWITCH_FIX: {
        const { fix } = action.payload

        analytics.push(AnalyticsKey.AMOUNT_SWITCHED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          product: 'SIMPLEBUY',
          switch_to: fix
        })

        break
      }

      case AT.components.simpleBuy.CREATE_ORDER: {
        const state = store.getState()
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const inputAmount = Number(state.form.simpleBuyCheckout.values.amount)
        const inputAMountMax = Number(state.components.simpleBuy.pair.buyMax) / 100
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_ENTERED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          input_amount: inputAmount,
          input_currency: inputCurrency,
          max_card_limit: inputAMountMax,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_MAX_AMOUNT_CLICK: {
        const state = store.getState()
        const maxCardLimit = Number(action.payload.amount) / 100
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MAX_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          input_currency: inputCurrency,
          max_card_limit: maxCardLimit,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MIN_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          input_currency: inputCurrency,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_METHOD_CHANGE: {
        const paymentType = action.method.type

        analytics.push(AnalyticsKey.BUY_PAYMENT_METHOD_SELECTED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          payment_type: simpleBuyPaymentTypeDictionary(paymentType)
        })
        break
      }
      case AT.auth.VERIFY_EMAIL_TOKEN_SUCCESS: {
        analytics.push(AnalyticsKey.EMAIL_VERIFICATION_REQUESTED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })
        break
      }
      case AT.auth.LOGIN_SUCCESS: {
        analytics.push(AnalyticsKey.SIGNED_IN, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })
        break
      }
      case AT.auth.LOGOUT: {
        analytics.push(AnalyticsKey.SIGNED_OUT, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })
        break
      }
      case AT.components.swap.SET_STEP: {
        const stepName = action.payload.step

        switch (stepName) {
          case 'ENTER_AMOUNT': {
            const state = store.getState()
            const inputCurrency = state.form.initSwap.values.BASE.coin
            const inputType =
              state.form.initSwap.values.BASE.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
                ? AccountType.TRADING
                : AccountType.USERKEY
            const outputCurrency = state.form.initSwap.values.COUNTER.coin
            const outputType =
              state.form.initSwap.values.COUNTER.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
                ? AccountType.TRADING
                : AccountType.USERKEY

            analytics.push(AnalyticsKey.SWAP_ACCOUNTS_SELECTED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              input_currency: inputCurrency,
              input_type: inputType,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              output_currency: outputCurrency,
              output_type: outputType
            })

            break
          }
          case 'PREVIEW_SWAP': {
            const state = store.getState()
            const exchangeRate = state.components.swap.quote.getOrElse({})?.rate || 1
            const inputAmount = Number(state.form.swapAmount.values.cryptoAmount)
            const inputCurrency = state.form.initSwap.values.BASE.coin
            const inputType =
              state.form.initSwap.values.BASE.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
                ? AccountType.TRADING
                : AccountType.USERKEY
            const outputAmount = inputAmount * exchangeRate
            const outputCurrency = state.form.initSwap.values.COUNTER.coin
            const outputType =
              state.form.initSwap.values.COUNTER.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
                ? AccountType.TRADING
                : AccountType.USERKEY

            analytics.push(AnalyticsKey.SWAP_AMOUNT_ENTERED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              input_amount: inputAmount,
              input_currency: inputCurrency,
              input_type: inputType,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              output_amount: outputAmount,
              output_currency: outputCurrency,
              output_type: outputType
            })

            break
          }
          default: {
            break
          }
        }
        break
      }
      case AT.components.swap.HANDLE_SWAP_MAX_AMOUNT_CLICK: {
        const state = store.getState()
        const inputCurrency = state.form.initSwap.values.BASE.coin
        const inputType =
          state.form.initSwap.values.BASE.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? AccountType.TRADING
            : AccountType.USERKEY
        const outputCurrency = state.form.initSwap.values.COUNTER.coin
        const outputType =
          state.form.initSwap.values.COUNTER.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SWAP_AMOUNT_MAX_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          input_currency: inputCurrency,
          input_type: inputType,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency,
          output_type: outputType
        })

        break
      }
      case AT.components.swap.HANDLE_SWAP_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const inputCurrency = state.form.initSwap.values.BASE.coin
        const inputType =
          state.form.initSwap.values.BASE.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? AccountType.TRADING
            : AccountType.USERKEY
        const outputCurrency = state.form.initSwap.values.COUNTER.coin
        const outputType =
          state.form.initSwap.values.COUNTER.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SWAP_AMOUNT_MIN_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          input_currency: inputCurrency,
          input_type: inputType,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency,
          output_type: outputType
        })
        break
      }
      case AT.components.swap.CHANGE_BASE: {
        const inputCurrency = action.payload.account.coin
        const inputType =
          action.payload.account.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SWAP_FROM_SELECTED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          input_currency: inputCurrency,
          input_type: inputType,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })
        break
      }
      case AT.components.swap.CHANGE_COUNTER: {
        const inputCurrency = action.payload.account.coin
        const inputType =
          action.payload.account.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SWAP_RECEIVE_SELECTED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          input_currency: inputCurrency,
          input_type: inputType,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })
        break
      }
      case AT.components.swap.CREATE_ORDER: {
        const state = store.getState()
        const exchangeRate = state.components.swap.quote.getOrElse({})?.rate || 1
        const inputAmount = Number(state.form.swapAmount.values.cryptoAmount)
        const inputCurrency = state.form.initSwap.values.BASE.coin
        const inputType =
          state.form.initSwap.values.BASE.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? AccountType.TRADING
            : AccountType.USERKEY
        const outputAmount = inputAmount * exchangeRate
        const outputCurrency = state.form.initSwap.values.COUNTER.coin
        const outputType =
          state.form.initSwap.values.COUNTER.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? AccountType.TRADING
            : AccountType.USERKEY
        const networkFeeInputAmount =
          state.form.initSwap.values.BASE.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? 0
            : Number(
                convertBaseToStandard(
                  state.form.initSwap.values.BASE.coin,
                  getNetworkFee(state.components.swap.payment.getOrElse(undefined))
                )
              )
        const networkFeeOutputAmount =
          state.form.initSwap.values.COUNTER.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? 0
            : state.components.swap.quote.getOrElse({})?.quote.networkFee || 0

        analytics.push(AnalyticsKey.SWAP_REQUESTED, {
          analyticsType: AnalyticsType.EVENT,
          exchange_rate: exchangeRate,
          id,
          input_amount: inputAmount,
          input_currency: inputCurrency,
          input_type: inputType,
          nabuId,
          network_fee_input_amount: networkFeeInputAmount,
          network_fee_input_currency: inputCurrency,
          network_fee_output_amount: networkFeeOutputAmount,
          network_fee_output_currency: outputCurrency,
          originalTimestamp: getOriginalTimestamp(),
          output_amount: outputAmount,
          output_currency: outputCurrency,
          output_type: outputType
        })

        break
      }

      case AT.components.request.GET_NEXT_ADDRESS: {
        const state = store.getState()
        const accountType =
          state.forms.requestCrypto.values.selectedAccount.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? AccountType.TRADING
            : AccountType.USERKEY
        const currency = state.forms.requestCrypto.values.selectedAccount.coin

        analytics.push(AnalyticsKey.RECEIVE_CURRENCY_SELECTED, {
          account_type: accountType,
          analyticsType: AnalyticsType.EVENT,
          currency,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })

        break
      }
      case AT.components.request.SET_ADDRESS_COPIED: {
        const state = store.getState()
        const accountType =
          state.forms.requestCrypto.values.selectedAccount.type === 'CUSTODIAL' // TODO add SwapBaseCounterTypes to it
            ? AccountType.TRADING
            : AccountType.USERKEY
        const currency = state.forms.requestCrypto.values.selectedAccount.coin

        analytics.push(AnalyticsKey.RECEIVE_DETAILS_COPIED, {
          account_type: accountType,
          analyticsType: AnalyticsType.EVENT,
          currency,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })

        break
      }
      case AT.components.simpleBuy.SET_BUY_CRYPTO: {
        const rawOrigin = action.payload.props.origin
        const { href, pathname, search } = window.location
        const { referrer, title } = document

        const origin = simpleBuyOriginDictionary(rawOrigin)

        analytics.push(AnalyticsKey.BUY_SELL_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          origin,
          originalTimestamp: getOriginalTimestamp(),
          type: OrderType.BUY
        })

        analytics.push(AnalyticsKey.BUY_SELL_VIEWED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          path: pathname,
          referrer,
          search,
          title,
          type: OrderType.BUY,
          url: href
        })
        break
      }
      case AT.components.simpleBuy.SET_SELL_CRYPTO: {
        const rawOrigin = action.payload.props.origin
        const { href, pathname, search } = window.location
        const { referrer, title } = document

        const origin = simpleBuyOriginDictionary(rawOrigin)

        analytics.push(AnalyticsKey.BUY_SELL_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          origin,
          originalTimestamp: getOriginalTimestamp(),
          type: OrderType.SELL
        })

        analytics.push(AnalyticsKey.BUY_SELL_VIEWED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          path: pathname,
          referrer,
          search,
          title,
          type: OrderType.SELL,
          url: href
        })

        break
      }

      default: {
        break
      }
    }
  } catch (e) {
    // do nothing
  }

  return next(action)
}

export default analyticsMiddleware
