import analytics from 'middleware/analyticsMiddleware/analytics'
import type { PageNamesType } from 'middleware/analyticsMiddleware/types'
import {
  AccountType,
  AnalyticsKey,
  AnalyticsType,
  CoinType,
  DepositMethodType,
  OrderType,
  SendReceiveType,
  WithdrawalMethodType
} from 'middleware/analyticsMiddleware/types'
import {
  getNetworkFee,
  getOriginalTimestamp,
  simpleBuyOriginDictionary,
  simpleBuyPaymentTypeDictionary
} from 'middleware/analyticsMiddleware/utils'

import { actionTypes as AT } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { BankDWStepType, InterestStep, ModalNamesType, SwapBaseCounterTypes } from 'data/types'

const analyticsMiddleware = () => (store) => (next) => (action) => {
  try {
    switch (action.type) {
      case '@@INIT': {
        analytics.clear()
        break
      }
      case AT.analytics.LOG_PAGE_VIEW: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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

            break
          }
          case '/interest': {
            const { href, pathname, search } = window.location
            const { referrer, title } = document

            analytics.push(AnalyticsKey.INTEREST_CLICKED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              origin: 'NAVIGATION',
              originalTimestamp: getOriginalTimestamp()
            })

            analytics.push(AnalyticsKey.INTEREST_VIEWED, {
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
          default: {
            break
          }
        }

        break
      }
      case AT.modals.SHOW_MODAL: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              origin: 'NAVIGATION',
              originalTimestamp: getOriginalTimestamp(),
              type: SendReceiveType.RECEIVE
            })

            analytics.push(AnalyticsKey.SEND_RECEIVE_VIEWED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              type: SendReceiveType.RECEIVE
            })

            break
          }
          case 'BANK_DEPOSIT_MODAL': {
            const { origin } = action.payload.props
            const { href, pathname, search } = window.location
            const { referrer, title } = document

            analytics.push(AnalyticsKey.DEPOSIT_CLICKED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              origin,
              originalTimestamp: getOriginalTimestamp()
            })

            analytics.push(AnalyticsKey.DEPOSIT_VIEWED, {
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
          case 'CUSTODY_WITHDRAW_MODAL': {
            const { origin } = action.payload.props
            const { href, pathname, search } = window.location
            const { referrer, title } = document

            analytics.push(AnalyticsKey.WITHDRAWAL_CLICKED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              origin,
              originalTimestamp: getOriginalTimestamp()
            })

            analytics.push(AnalyticsKey.WITHDRAWAL_VIEWED, {
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
          case 'ADD_BANK_YAPILY_MODAL': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const id = state.walletPath.wallet.guid

            analytics.push(AnalyticsKey.LINK_BANK_CLICKED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp()
            })
            break
          }
          case 'ADD_BANK_YODLEE_MODAL': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const id = state.walletPath.wallet.guid

            analytics.push(AnalyticsKey.LINK_BANK_CLICKED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp()
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
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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
      case AT.components.simpleBuy.HANDLE_BUY_MAX_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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
      case AT.components.simpleBuy.HANDLE_BUY_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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
      // case AT.auth.VERIFY_EMAIL_TOKEN_SUCCESS: {
      //   const state = store.getState()
      //   const nabuId = state.profile.userData.getOrElse({})?.id
      //   const id = state.walletPath.wallet.guid
      //   analytics.push(AnalyticsKey.EMAIL_VERIFICATION_REQUESTED, {
      //     analyticsType: AnalyticsType.EVENT,
      //     id,
      //     nabuId,
      //     originalTimestamp: getOriginalTimestamp()
      //   })
      //   break
      // }
      case AT.auth.LOGIN_SUCCESS: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid

        analytics.push(AnalyticsKey.SIGNED_IN, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })

        break
      }
      case AT.auth.LOGOUT: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid

        analytics.push(AnalyticsKey.SIGNED_OUT, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })
        break
      }
      case AT.auth.WRONG_CHANGE_CACHE: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid

        analytics.push(AnalyticsKey.WRONG_CHANGE_CACHE, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })
        break
      }
      case AT.auth.WRONG_RECEIVE_CACHE: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid

        analytics.push(AnalyticsKey.WRONG_RECEIVE_CACHE, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })
        break
      }
      case AT.components.swap.SET_STEP: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const stepName = action.payload.step

        switch (stepName) {
          case 'ENTER_AMOUNT': {
            const inputCurrency = state.form.initSwap.values.BASE.coin
            const inputType =
              state.form.initSwap.values.BASE.type === SwapBaseCounterTypes.CUSTODIAL
                ? AccountType.TRADING
                : AccountType.USERKEY
            const outputCurrency = state.form.initSwap.values.COUNTER.coin
            const outputType =
              state.form.initSwap.values.COUNTER.type === SwapBaseCounterTypes.CUSTODIAL
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
            const exchangeRate = state.components.swap.quote.getOrElse({})?.rate || 1
            const inputAmount = Number(state.form.swapAmount.values.cryptoAmount)
            const inputCurrency = state.form.initSwap.values.BASE.coin
            const inputType =
              state.form.initSwap.values.BASE.type === SwapBaseCounterTypes.CUSTODIAL
                ? AccountType.TRADING
                : AccountType.USERKEY
            const outputAmount = inputAmount * exchangeRate
            const outputCurrency = state.form.initSwap.values.COUNTER.coin
            const outputType =
              state.form.initSwap.values.COUNTER.type === SwapBaseCounterTypes.CUSTODIAL
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
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const inputCurrency = state.form.initSwap.values.BASE.coin
        const inputType =
          state.form.initSwap.values.BASE.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const outputCurrency = state.form.initSwap.values.COUNTER.coin
        const outputType =
          state.form.initSwap.values.COUNTER.type === SwapBaseCounterTypes.CUSTODIAL
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
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const inputCurrency = state.form.initSwap.values.BASE.coin
        const inputType =
          state.form.initSwap.values.BASE.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const outputCurrency = state.form.initSwap.values.COUNTER.coin
        const outputType =
          state.form.initSwap.values.COUNTER.type === SwapBaseCounterTypes.CUSTODIAL
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
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const inputCurrency = action.payload.account.coin
        const inputType =
          action.payload.account.type === SwapBaseCounterTypes.CUSTODIAL
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
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const inputCurrency = action.payload.account.coin
        const inputType =
          action.payload.account.type === SwapBaseCounterTypes.CUSTODIAL
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
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const exchangeRate = state.components.swap.quote.getOrElse({})?.rate || 1
        const inputAmount = Number(state.form.swapAmount.values.cryptoAmount)
        const inputCurrency = state.form.initSwap.values.BASE.coin
        const inputType =
          state.form.initSwap.values.BASE.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const outputAmount = inputAmount * exchangeRate
        const outputCurrency = state.form.initSwap.values.COUNTER.coin
        const outputType =
          state.form.initSwap.values.COUNTER.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const networkFeeInputAmount =
          state.form.initSwap.values.BASE.type === SwapBaseCounterTypes.CUSTODIAL
            ? 0
            : Number(
                convertBaseToStandard(
                  state.form.initSwap.values.BASE.coin,
                  getNetworkFee(state.components.swap.payment.getOrElse(undefined))
                )
              )
        const networkFeeOutputAmount =
          state.form.initSwap.values.COUNTER.type === SwapBaseCounterTypes.CUSTODIAL
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
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const accountType =
          state.form.requestCrypto.values.selectedAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const currency = state.form.requestCrypto.values.selectedAccount.coin

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
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const accountType =
          state.form.requestCrypto.values.selectedAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const currency = state.form.requestCrypto.values.selectedAccount.coin

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
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
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

      case AT.components.simpleBuy.SET_STEP: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const stepName = action.payload.step

        switch (stepName) {
          case 'ENTER_AMOUNT': {
            if (action.payload.orderType === OrderType.BUY) {
              break
            }

            const accountType =
              action.payload.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
                ? AccountType.TRADING
                : AccountType.USERKEY
            const inputCurrency = state.components.simpleBuy.fiatCurrency

            analytics.push(AnalyticsKey.SELL_FROM_SELECTED, {
              analyticsType: AnalyticsType.EVENT,
              from_account_type: accountType,
              id,
              input_currency: inputCurrency,
              nabuId,
              originalTimestamp: getOriginalTimestamp()
            })

            break
          }

          case 'PREVIEW_SELL': {
            const accountType =
              state.components.simpleBuy.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
                ? AccountType.TRADING
                : AccountType.USERKEY
            const inputCurrency = state.components.simpleBuy.fiatCurrency
            const inputAmount = Number(state.form.simpleBuyCheckout.values.amount)
            const outputCurrency = state.components.simpleBuy.cryptoCurrency

            analytics.push(AnalyticsKey.SELL_AMOUNT_ENTERED, {
              analyticsType: AnalyticsType.EVENT,
              from_account_type: accountType,
              id,
              input_amount: inputAmount,
              input_currency: inputCurrency,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              output_currency: outputCurrency
            })
            break
          }
          default: {
            break
          }
        }
        break
      }
      case AT.components.simpleBuy.HANDLE_SELL_MAX_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const accountType =
          state.components.simpleBuy.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.SELL_AMOUNT_MAX_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          from_account_type: accountType,
          id,
          input_currency: inputCurrency,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SELL_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const accountType =
          state.components.simpleBuy.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.SELL_AMOUNT_MIN_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          from_account_type: accountType,
          id,
          input_currency: inputCurrency,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          output_currency: outputCurrency
        })
        break
      }
      case AT.components.brokerage.SET_D_W_STEP: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const stepName = action.payload.dwStep as BankDWStepType

        switch (stepName) {
          case BankDWStepType.CONFIRM: {
            const depositMethod = state.components.brokerage.account
              ? DepositMethodType.BANK_ACCOUNT
              : DepositMethodType.BANK_TRANSFER
            const { amount, currency } = state.form.brokerageTx.values

            analytics.push(AnalyticsKey.DEPOSIT_AMOUNT_ENTERED, {
              amount,
              analyticsType: AnalyticsType.EVENT,
              currency,
              deposit_method: depositMethod,
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp()
            })

            break
          }

          default: {
            break
          }
        }

        break
      }
      case AT.components.brokerage.SET_BANK_DETAILS: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid

        const originModal = state.modals.find((modal) => modal.type).type

        switch (originModal) {
          case 'BANK_DEPOSIT_MODAL': {
            const depositMethod = state.components.brokerage.account
              ? DepositMethodType.BANK_ACCOUNT
              : DepositMethodType.BANK_TRANSFER
            const { currency } = state.form.brokerageTx.values

            analytics.push(AnalyticsKey.DEPOSIT_METHOD_SELECTED, {
              analyticsType: AnalyticsType.EVENT,
              currency,
              deposit_method: depositMethod,
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp()
            })

            break
          }

          case 'CUSTODY_WITHDRAW_MODAL': {
            const currency = state.components.withdraw.fiatCurrency
            const withdrawalMethod = state.components.brokerage.account
              ? WithdrawalMethodType.BANK_ACCOUNT
              : WithdrawalMethodType.BANK_TRANSFER

            analytics.push(AnalyticsKey.WITHDRAWAL_METHOD_SELECTED, {
              analyticsType: AnalyticsType.EVENT,
              currency,
              id,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              withdrawal_method: withdrawalMethod
            })

            break
          }

          default: {
            break
          }
        }

        break
      }
      case AT.components.withdraw.SET_STEP: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const stepName = action.payload.step

        switch (stepName) {
          case 'CONFIRM_WITHDRAW': {
            const currency = state.components.withdraw.fiatCurrency
            const inputAmount = Number(state.form.custodyWithdrawForm.values.amount)
            const fee = state.components.withdraw.feesAndMinAmount
              .getOrElse({})
              ?.fees.find((fee) => fee.symbol === currency)?.value
            const outputAmount = inputAmount + fee
            const withdrawMethod = state.components.brokerage.account
              ? WithdrawalMethodType.BANK_ACCOUNT
              : WithdrawalMethodType.BANK_TRANSFER

            analytics.push(AnalyticsKey.WITHDRAWAL_AMOUNT_ENTERED, {
              analyticsType: AnalyticsType.EVENT,
              currency,
              id,
              input_amount: inputAmount,
              nabuId,
              originalTimestamp: getOriginalTimestamp(),
              output_amount: outputAmount,
              withdrawal_method: withdrawMethod
            })

            break
          }
          default: {
            break
          }
        }

        break
      }
      case AT.components.withdraw.HANDLE_WITHDRAWAL_MAX_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const currency = state.components.withdraw.fiatCurrency
        const withdrawalMethod = state.components.brokerage.account
          ? WithdrawalMethodType.BANK_ACCOUNT
          : WithdrawalMethodType.BANK_TRANSFER

        analytics.push(AnalyticsKey.WITHDRAWAL_AMOUNT_MAX_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          currency,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          withdrawal_method: withdrawalMethod
        })

        break
      }
      case AT.components.withdraw.HANDLE_WITHDRAWAL_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const currency = state.components.withdraw.fiatCurrency
        const withdrawalMethod = state.components.brokerage.account
          ? WithdrawalMethodType.BANK_ACCOUNT
          : WithdrawalMethodType.BANK_TRANSFER

        analytics.push(AnalyticsKey.WITHDRAWAL_AMOUNT_MIN_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          currency,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp(),
          withdrawal_method: withdrawalMethod
        })
        break
      }
      case AT.components.interest.SHOW_INTEREST_MODAL: {
        const stepName: InterestStep = action.payload.step

        switch (stepName) {
          case 'DEPOSIT': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const id = state.walletPath.wallet.guid
            // const { origin } = action.payload.props
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const currency = action.payload.coin

            analytics.push(AnalyticsKey.INTEREST_DEPOSIT_CLICKED, {
              analyticsType: AnalyticsType.EVENT,
              currency,
              id,
              nabuId,
              // origin,
              originalTimestamp: getOriginalTimestamp()
            })

            analytics.push(AnalyticsKey.INTEREST_DEPOSIT_VIEWED, {
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
          case 'WITHDRAWAL': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const id = state.walletPath.wallet.guid
            // const { origin } = action.payload.props
            const { href, pathname, search } = window.location
            const { referrer, title } = document

            analytics.push(AnalyticsKey.INTEREST_WITHDRAWAL_CLICKED, {
              analyticsType: AnalyticsType.EVENT,
              id,
              nabuId,
              // origin,
              originalTimestamp: getOriginalTimestamp()
            })

            analytics.push(AnalyticsKey.INTEREST_WITHDRAWAL_VIEWED, {
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
          default: {
            break
          }
        }

        break
      }
      case AT.components.interest.HANDLE_TRANSFER_MAX_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const amountCurrency = state.components.interest.isCoinDisplayed
          ? action.payload.coin
          : state.settingsPath.getOrElse({})?.currency
        const currency = state.components.interest.coin
        const fromAccountType =
          state.components.interest.account.getOrElse({})?.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.INTEREST_DEPOSIT_MAX_AMOUNT_CLICKED, {
          amount_currency: amountCurrency,
          analyticsType: AnalyticsType.EVENT,
          currency,
          from_account_type: fromAccountType,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })

        break
      }
      case AT.components.interest.HANDLE_TRANSFER_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const amountCurrency = state.components.interest.isCoinDisplayed
          ? action.payload.coin
          : state.settingsPath.getOrElse({})?.currency
        const currency = state.components.interest.coin
        const fromAccountType =
          state.components.interest.account.getOrElse({})?.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.INTEREST_DEPOSIT_MIN_AMOUNT_CLICKED, {
          amount_currency: amountCurrency,
          analyticsType: AnalyticsType.EVENT,
          currency,
          from_account_type: fromAccountType,
          id,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })

        break
      }
      case AT.components.interest.SUBMIT_DEPOSIT_FORM: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const currency = state.components.interest.coin
        const inputAmount = Number(state.form.interestDepositForm.values.depositAmount)
        const interestRate = state.components.interest.interestRate.getOrElse({})?.[currency]
        const fromAccountType =
          state.components.interest.account.getOrElse({})?.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.INTEREST_DEPOSIT_AMOUNT_ENTERED, {
          analyticsType: AnalyticsType.EVENT,
          currency,
          from_account_type: fromAccountType,
          id,
          input_amount: inputAmount,
          interest_rate: interestRate,
          nabuId,
          originalTimestamp: getOriginalTimestamp()
        })

        break
      }
      case AT.components.interest.HANDLE_WITHDRAWAL_SUPPLY_INFORMATION: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const id = state.walletPath.wallet.guid
        const { origin } = action.payload

        analytics.push(AnalyticsKey.INTEREST_SUBMIT_INFORMATION_CLICKED, {
          analyticsType: AnalyticsType.EVENT,
          id,
          nabuId,
          origin,
          originalTimestamp: getOriginalTimestamp()
        })

        break
      }

      default: {
        break
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }

  return next(action)
}

export default analyticsMiddleware
