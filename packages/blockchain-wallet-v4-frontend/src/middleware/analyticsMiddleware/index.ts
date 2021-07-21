import analytics from 'middleware/analyticsMiddleware/analytics'
import {
  AccountType,
  AnalyticsKey,
  Coin,
  DepositMethod,
  FeeRate,
  Order,
  PageName,
  SendReceive,
  WithdrawalMethod
} from 'middleware/analyticsMiddleware/types'
import {
  buyPaymentMethodSelectedPaymentTypeDictionary,
  buySellClickedOriginDictionary,
  getNetworkFee,
  getOriginalTimestamp,
  interestDepositClickedOriginDictionary,
  linkBankClickedOriginDictionary,
  manageTabSelectionClickedSelectionDictionary,
  settingsHyperlinkClickedDestinationDictionary,
  settingsTabClickedDestinationDictionary,
  swapClickedOriginDictionary,
  upgradeVerificationClickedOriginDictionary
} from 'middleware/analyticsMiddleware/utils'

import { actions, actionTypes as AT } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { BankDWStepType, InterestStep, ModalNamesEnum, SwapBaseCounterTypes } from 'data/types'

const analyticsMiddleware = () => (store) => (next) => (action) => {
  try {
    switch (action.type) {
      case '@@INIT': {
        analytics.clear()
        break
      }
      case AT.router.LOCATION_CHANGE: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const pageName: PageName = action.payload.location.pathname

        switch (pageName) {
          case '/home': {
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = 'SIGN_IN' // TODO add way to add 'NAVIGATION' here

            analytics.push(AnalyticsKey.DASHBOARD_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            analytics.push(AnalyticsKey.DASHBOARD_VIEWED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp(),
                path: pathname,
                referrer,
                search,
                title,
                url: href
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case '/interest': {
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = 'NAVIGATION'

            analytics.push(AnalyticsKey.INTEREST_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            analytics.push(AnalyticsKey.INTEREST_VIEWED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp(),
                path: pathname,
                referrer,
                search,
                title,
                url: href
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case '/settings/addresses/btc': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid
            const currency = 'BTC'

            analytics.push(AnalyticsKey.SETTINGS_CURRENCY_CLICKED, {
              properties: {
                currency,
                id,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case '/settings/addresses/bch': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid
            const currency = 'BCH'

            analytics.push(AnalyticsKey.SETTINGS_CURRENCY_CLICKED, {
              properties: {
                currency,
                id,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case '/settings/addresses/eth': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid
            const currency = 'ETH'

            analytics.push(AnalyticsKey.SETTINGS_CURRENCY_CLICKED, {
              properties: {
                currency,
                id,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case '/settings/addresses/xlm': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid
            const currency = 'XLM'

            analytics.push(AnalyticsKey.SETTINGS_CURRENCY_CLICKED, {
              properties: {
                currency,
                id,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
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
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const modalName: ModalNamesEnum = action.payload.type

        switch (modalName) {
          case ModalNamesEnum.SIMPLE_BUY_MODAL: {
            const rawOrigin = action.payload.props.origin
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = buySellClickedOriginDictionary(rawOrigin)

            analytics.push(AnalyticsKey.BUY_SELL_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp(),
                type: Order.BUY
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            analytics.push(AnalyticsKey.BUY_SELL_VIEWED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp(),
                path: pathname,
                referrer,
                search,
                title,
                type: Order.BUY,
                url: href
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.SWAP_MODAL: {
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = swapClickedOriginDictionary(action.payload.props.origin)

            analytics.push(AnalyticsKey.SWAP_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            analytics.push(AnalyticsKey.SWAP_VIEWED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp(),
                path: pathname,
                referrer,
                search,
                title,
                url: href
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.REQUEST_CRYPTO_MODAL: {
            const origin = 'NAVIGATION'

            analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp(),
                type: SendReceive.RECEIVE
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            analytics.push(AnalyticsKey.SEND_RECEIVE_VIEWED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp(),
                type: SendReceive.RECEIVE
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.BANK_DEPOSIT_MODAL: {
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = 'CURRENCY_PAGE'

            analytics.push(AnalyticsKey.DEPOSIT_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            analytics.push(AnalyticsKey.DEPOSIT_VIEWED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp(),
                path: pathname,
                referrer,
                search,
                title,
                url: href
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.CUSTODY_WITHDRAW_MODAL: {
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = 'CURRENCY_PAGE'

            analytics.push(AnalyticsKey.WITHDRAWAL_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            analytics.push(AnalyticsKey.WITHDRAWAL_VIEWED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp(),
                path: pathname,
                referrer,
                search,
                title,
                url: href
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.ADD_BANK_YAPILY_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid
            const origin = linkBankClickedOriginDictionary(action.payload.origin)

            analytics.push(AnalyticsKey.LINK_BANK_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.ADD_BANK_YODLEE_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid
            const origin = linkBankClickedOriginDictionary(action.payload.origin)

            analytics.push(AnalyticsKey.LINK_BANK_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.KYC_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid
            const upgradeTier = action.payload.props.tier

            const origin = upgradeVerificationClickedOriginDictionary(action.payload.props.origin)

            analytics.push(AnalyticsKey.UPGRADE_VERIFICATION_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp(),
                tier: upgradeTier
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.VERIFY_MESSAGE_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid

            analytics.push(AnalyticsKey.ADDRESS_VERIFY_MESSAGE_CLICKED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.MOBILE_NUMBER_CHANGE_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid

            analytics.push(AnalyticsKey.CHANGE_MOBILE_NUMBER_CLICKED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.MOBILE_NUMBER_ADD_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid

            analytics.push(AnalyticsKey.ADD_MOBILE_NUMBER_CLICKED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case ModalNamesEnum.IMPORT_BTC_ADDRESS_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid

            analytics.push(AnalyticsKey.IMPORT_ADDRESS_CLICKED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          default: {
            break
          }
        }

        break
      }
      case AT.modules.securityCenter.VERIFY_EMAIL: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const origin = 'SIGN_UP'

        analytics.push(AnalyticsKey.EMAIL_VERIFICATION_REQUESTED, {
          properties: {
            id,
            origin,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.modules.securityCenter.RESEND_VERIFY_EMAIL: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const origin = 'VERIFICATION'

        analytics.push(AnalyticsKey.EMAIL_VERIFICATION_REQUESTED, {
          properties: {
            id,
            origin,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.modules.securityCenter.SKIP_VERIFY_EMAIL: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const origin = 'SIGN_UP'

        analytics.push(AnalyticsKey.EMAIL_VERIFICATION_SKIPPED, {
          properties: {
            id,
            origin,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.interest.SET_COIN_DISPLAY: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const { isCoinDisplayed } = action.payload
        const fix = isCoinDisplayed ? Coin.CRYPTO : Coin.FIAT
        const product = 'SAVINGS'

        analytics.push(AnalyticsKey.AMOUNT_SWITCHED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            product,
            switch_to: fix
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }

      case AT.components.swap.SWITCH_FIX: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const { fix } = action.payload

        analytics.push(AnalyticsKey.AMOUNT_SWITCHED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            product: 'SWAP',
            switch_to: fix
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }

      case AT.components.simpleBuy.SWITCH_FIX: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const { fix } = action.payload

        analytics.push(AnalyticsKey.AMOUNT_SWITCHED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            product: 'SIMPLEBUY',
            switch_to: fix
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }

      case AT.components.simpleBuy.CREATE_ORDER: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const inputAmount = Number(state.form.simpleBuyCheckout.values.amount)
        const inputAMountMax = Number(state.components.simpleBuy.pair.buyMax) / 100
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_ENTERED, {
          properties: {
            id,
            input_amount: inputAmount,
            input_currency: inputCurrency,
            max_card_limit: inputAMountMax,
            originalTimestamp: getOriginalTimestamp(),
            output_currency: outputCurrency
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_BUY_MAX_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const maxCardLimit = Number(action.payload.amount) / 100
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MAX_CLICKED, {
          properties: {
            id,
            input_currency: inputCurrency,
            max_card_limit: maxCardLimit,
            originalTimestamp: getOriginalTimestamp(),
            output_currency: outputCurrency
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_BUY_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MIN_CLICKED, {
          properties: {
            id,
            input_currency: inputCurrency,
            originalTimestamp: getOriginalTimestamp(),
            output_currency: outputCurrency
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SB_METHOD_CHANGE: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const paymentType = buyPaymentMethodSelectedPaymentTypeDictionary(action.method.type)

        analytics.push(AnalyticsKey.BUY_PAYMENT_METHOD_SELECTED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            payment_type: paymentType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.auth.LOGIN_SUCCESS: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid

        analytics.push(AnalyticsKey.SIGNED_IN, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.auth.LOGOUT: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid

        analytics.push(AnalyticsKey.SIGNED_OUT, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.auth.WRONG_CHANGE_CACHE: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid

        analytics.push(AnalyticsKey.WRONG_CHANGE_CACHE, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.auth.WRONG_RECEIVE_CACHE: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid

        analytics.push(AnalyticsKey.WRONG_RECEIVE_CACHE, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.components.swap.SET_STEP: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
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
              properties: {
                id,
                input_currency: inputCurrency,
                input_type: inputType,
                originalTimestamp: getOriginalTimestamp(),
                output_currency: outputCurrency,
                output_type: outputType
              },
              traits: {
                email,
                nabuId,
                tier
              }
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
              properties: {
                id,
                input_amount: inputAmount,
                input_currency: inputCurrency,
                input_type: inputType,
                originalTimestamp: getOriginalTimestamp(),
                output_amount: outputAmount,
                output_currency: outputCurrency,
                output_type: outputType
              },
              traits: {
                email,
                nabuId,
                tier
              }
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
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
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
          properties: {
            id,
            input_currency: inputCurrency,
            input_type: inputType,
            originalTimestamp: getOriginalTimestamp(),
            output_currency: outputCurrency,
            output_type: outputType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.swap.HANDLE_SWAP_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
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
          properties: {
            id,
            input_currency: inputCurrency,
            input_type: inputType,
            originalTimestamp: getOriginalTimestamp(),
            output_currency: outputCurrency,
            output_type: outputType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.components.swap.CHANGE_BASE: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const inputCurrency = action.payload.account.coin
        const inputType =
          action.payload.account.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SWAP_FROM_SELECTED, {
          properties: {
            id,
            input_currency: inputCurrency,
            input_type: inputType,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.components.swap.CHANGE_COUNTER: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const outputCurrency = action.payload.account.coin
        const outputType =
          action.payload.account.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SWAP_RECEIVE_SELECTED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            output_currency: outputCurrency,
            output_type: outputType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.components.swap.CREATE_ORDER: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
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
                  getNetworkFee(state.components.swap.payment.getOrElse(null))
                )
              )
        const networkFeeOutputAmount =
          state.form.initSwap.values.COUNTER.type === SwapBaseCounterTypes.CUSTODIAL
            ? 0
            : state.components.swap.quote.getOrElse({})?.quote.networkFee || 0

        analytics.push(AnalyticsKey.SWAP_REQUESTED, {
          properties: {
            exchange_rate: exchangeRate,
            id,
            input_amount: inputAmount,
            input_currency: inputCurrency,
            input_type: inputType,
            network_fee_input_amount: networkFeeInputAmount,
            network_fee_input_currency: inputCurrency,
            network_fee_output_amount: networkFeeOutputAmount,
            network_fee_output_currency: outputCurrency,
            originalTimestamp: getOriginalTimestamp(),
            output_amount: outputAmount,
            output_currency: outputCurrency,
            output_type: outputType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }

      case AT.components.request.GET_NEXT_ADDRESS: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const accountType =
          state.form.requestCrypto.values.selectedAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const currency = state.form.requestCrypto.values.selectedAccount.coin

        analytics.push(AnalyticsKey.RECEIVE_CURRENCY_SELECTED, {
          properties: {
            account_type: accountType,

            currency,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.request.SET_ADDRESS_COPIED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const accountType =
          state.form.requestCrypto.values.selectedAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const currency = state.form.requestCrypto.values.selectedAccount.coin

        analytics.push(AnalyticsKey.RECEIVE_DETAILS_COPIED, {
          properties: {
            account_type: accountType,

            currency,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.simpleBuy.SET_BUY_CRYPTO: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const rawOrigin = action.payload.props.origin
        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const origin = buySellClickedOriginDictionary(rawOrigin)

        analytics.push(AnalyticsKey.BUY_SELL_CLICKED, {
          properties: {
            id,
            origin,
            originalTimestamp: getOriginalTimestamp(),
            type: Order.BUY
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        analytics.push(AnalyticsKey.BUY_SELL_VIEWED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            path: pathname,
            referrer,
            search,
            title,
            type: Order.BUY,
            url: href
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.components.simpleBuy.SET_SELL_CRYPTO: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const rawOrigin = action.payload.props.origin
        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const origin = buySellClickedOriginDictionary(rawOrigin)

        analytics.push(AnalyticsKey.BUY_SELL_CLICKED, {
          properties: {
            id,
            origin,
            originalTimestamp: getOriginalTimestamp(),
            type: Order.SELL
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        analytics.push(AnalyticsKey.BUY_SELL_VIEWED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            path: pathname,
            referrer,
            search,
            title,
            type: Order.SELL,
            url: href
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }

      case AT.components.simpleBuy.SET_STEP: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const stepName = action.payload.step

        switch (stepName) {
          case 'ENTER_AMOUNT': {
            if (action.payload.orderType === Order.BUY) {
              break
            }

            const accountType =
              action.payload.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
                ? AccountType.TRADING
                : AccountType.USERKEY
            const inputCurrency = state.components.simpleBuy.fiatCurrency

            analytics.push(AnalyticsKey.SELL_FROM_SELECTED, {
              properties: {
                from_account_type: accountType,
                id,
                input_currency: inputCurrency,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
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
              properties: {
                from_account_type: accountType,
                id,
                input_amount: inputAmount,
                input_currency: inputCurrency,
                originalTimestamp: getOriginalTimestamp(),
                output_currency: outputCurrency
              },
              traits: {
                email,
                nabuId,
                tier
              }
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
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const accountType =
          state.components.simpleBuy.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.SELL_AMOUNT_MAX_CLICKED, {
          properties: {
            from_account_type: accountType,
            id,
            input_currency: inputCurrency,
            originalTimestamp: getOriginalTimestamp(),
            output_currency: outputCurrency
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.components.simpleBuy.HANDLE_SELL_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const accountType =
          state.components.simpleBuy.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const inputCurrency = state.components.simpleBuy.fiatCurrency
        const outputCurrency = state.components.simpleBuy.cryptoCurrency

        analytics.push(AnalyticsKey.SELL_AMOUNT_MIN_CLICKED, {
          properties: {
            from_account_type: accountType,
            id,
            input_currency: inputCurrency,
            originalTimestamp: getOriginalTimestamp(),
            output_currency: outputCurrency
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case actions.components.brokerage.setDWStep.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const stepName = action.payload.dwStep as BankDWStepType

        switch (stepName) {
          case BankDWStepType.CONFIRM: {
            const depositMethod = state.components.brokerage.account
              ? DepositMethod.BANK_ACCOUNT
              : DepositMethod.BANK_TRANSFER
            const { amount, currency } = state.form.brokerageTx.values

            analytics.push(AnalyticsKey.DEPOSIT_AMOUNT_ENTERED, {
              properties: {
                amount,

                currency,
                deposit_method: depositMethod,
                id,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }

          default: {
            break
          }
        }

        break
      }
      case actions.components.brokerage.setBankDetails.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid

        const originModal = state.modals.find((modal) => modal.type).type

        switch (originModal) {
          case 'BANK_DEPOSIT_MODAL': {
            const depositMethod = state.components.brokerage.account
              ? DepositMethod.BANK_ACCOUNT
              : DepositMethod.BANK_TRANSFER
            const { currency } = state.components.brokerage.fiatCurrency

            analytics.push(AnalyticsKey.DEPOSIT_METHOD_SELECTED, {
              properties: {
                currency,
                deposit_method: depositMethod,
                id,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }

          case 'CUSTODY_WITHDRAW_MODAL': {
            const currency = state.components.withdraw.fiatCurrency
            const withdrawalMethod = state.components.brokerage.account
              ? WithdrawalMethod.BANK_ACCOUNT
              : WithdrawalMethod.BANK_TRANSFER

            analytics.push(AnalyticsKey.WITHDRAWAL_METHOD_SELECTED, {
              properties: {
                currency,
                id,
                originalTimestamp: getOriginalTimestamp(),
                withdrawal_method: withdrawalMethod
              },
              traits: {
                email,
                nabuId,
                tier
              }
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
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
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
              ? WithdrawalMethod.BANK_ACCOUNT
              : WithdrawalMethod.BANK_TRANSFER

            analytics.push(AnalyticsKey.WITHDRAWAL_AMOUNT_ENTERED, {
              properties: {
                currency,
                id,
                input_amount: inputAmount,
                originalTimestamp: getOriginalTimestamp(),
                output_amount: outputAmount,
                withdrawal_method: withdrawMethod
              },
              traits: {
                email,
                nabuId,
                tier
              }
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
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const currency = state.components.withdraw.fiatCurrency
        const withdrawalMethod = state.components.brokerage.account
          ? WithdrawalMethod.BANK_ACCOUNT
          : WithdrawalMethod.BANK_TRANSFER

        analytics.push(AnalyticsKey.WITHDRAWAL_AMOUNT_MAX_CLICKED, {
          properties: {
            currency,
            id,
            originalTimestamp: getOriginalTimestamp(),
            withdrawal_method: withdrawalMethod
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.withdraw.HANDLE_WITHDRAWAL_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const currency = state.components.withdraw.fiatCurrency
        const withdrawalMethod = state.components.brokerage.account
          ? WithdrawalMethod.BANK_ACCOUNT
          : WithdrawalMethod.BANK_TRANSFER

        analytics.push(AnalyticsKey.WITHDRAWAL_AMOUNT_MIN_CLICKED, {
          properties: {
            currency,
            id,
            originalTimestamp: getOriginalTimestamp(),
            withdrawal_method: withdrawalMethod
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case AT.components.interest.SHOW_INTEREST_MODAL: {
        const stepName: InterestStep = action.payload.step

        switch (stepName) {
          case 'DEPOSIT': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const currency = action.payload.coin

            const origin = interestDepositClickedOriginDictionary(action.payload.props.origin)

            analytics.push(AnalyticsKey.INTEREST_DEPOSIT_CLICKED, {
              properties: {
                currency,
                id,
                origin,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            analytics.push(AnalyticsKey.INTEREST_DEPOSIT_VIEWED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp(),
                path: pathname,
                referrer,
                search,
                title,
                url: href
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            break
          }
          case 'WITHDRAWAL': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id
            const email = state.profile.userData.getOrElse({})?.email
            const tier = state.profile.userData.getOrElse({})?.tiers.current
            const id = state.walletPath.wallet.guid
            const { href, pathname, search } = window.location
            const { referrer, title } = document

            const origin = 'CURRENCY_PAGE'

            analytics.push(AnalyticsKey.INTEREST_WITHDRAWAL_CLICKED, {
              properties: {
                id,
                origin,
                originalTimestamp: getOriginalTimestamp()
              },
              traits: {
                email,
                nabuId,
                tier
              }
            })

            analytics.push(AnalyticsKey.INTEREST_WITHDRAWAL_VIEWED, {
              properties: {
                id,
                originalTimestamp: getOriginalTimestamp(),
                path: pathname,
                referrer,
                search,
                title,
                url: href
              },
              traits: {
                email,
                nabuId,
                tier
              }
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
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
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
          properties: {
            amount_currency: amountCurrency,

            currency,
            from_account_type: fromAccountType,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.interest.HANDLE_TRANSFER_MIN_AMOUNT_CLICK: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
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
          properties: {
            amount_currency: amountCurrency,

            currency,
            from_account_type: fromAccountType,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.interest.SUBMIT_DEPOSIT_FORM: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const currency = state.components.interest.coin
        const inputAmount = Number(state.form.interestDepositForm.values.depositAmount)
        const interestRate = state.components.interest.interestRate.getOrElse({})?.[currency]
        const fromAccountType =
          state.components.interest.account.getOrElse({})?.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.INTEREST_DEPOSIT_AMOUNT_ENTERED, {
          properties: {
            currency,
            from_account_type: fromAccountType,
            id,
            input_amount: inputAmount,
            interest_rate: interestRate,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.interest.HANDLE_WITHDRAWAL_SUPPLY_INFORMATION: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const { origin } = action.payload

        analytics.push(AnalyticsKey.INTEREST_SUBMIT_INFORMATION_CLICKED, {
          properties: {
            id,
            origin,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.preferences.SET_LINK_HANDLING: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid

        analytics.push(AnalyticsKey.CRYPTO_LINK_HANDLING_CLICKED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.wallet.MANAGE_WALLET_SELECTION: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const { currency } = action.payload
        const selection = manageTabSelectionClickedSelectionDictionary(action.payload.selection)

        analytics.push(AnalyticsKey.MANAGE_TAB_SELECTION_CLICKED, {
          properties: {
            currency,
            id,
            originalTimestamp: getOriginalTimestamp(),
            selection
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.core.settings.SET_NOTIFICATIONS_TYPE: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const isEmailEnabled = action.payload.types.includes(32)
        const isSMSEnabled = action.payload.types.includes(32)

        analytics.push(AnalyticsKey.NOTIFICATION_PREFERENCES_UPDATED, {
          properties: {
            email_enabled: isEmailEnabled,
            id,
            originalTimestamp: getOriginalTimestamp(),
            sms_enabled: isSMSEnabled
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.modules.settings.SHOW_BTC_PRIV_KEY: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const currency = 'BTC'

        analytics.push(AnalyticsKey.PRIVATE_KEYS_SHOWN, {
          properties: {
            currency,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.modules.settings.SHOW_ETH_PRIV_KEY: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const currency = 'ETH'

        analytics.push(AnalyticsKey.PRIVATE_KEYS_SHOWN, {
          properties: {
            currency,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.modules.settings.SHOW_XLM_PRIV_KEY: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const currency = 'XLM'

        analytics.push(AnalyticsKey.PRIVATE_KEYS_SHOWN, {
          properties: {
            currency,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.modules.settings.GENERAL_SETTINGS_EXTERNAL_REDIRECT: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const destination = settingsHyperlinkClickedDestinationDictionary(
          action.payload.destination
        )

        analytics.push(AnalyticsKey.SETTINGS_HYPERLINK_CLICKED, {
          properties: {
            destination,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.modules.settings.GENERAL_SETTINGS_INTERNAL_REDIRECT: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const destination = settingsTabClickedDestinationDictionary(action.payload.destination)

        analytics.push(AnalyticsKey.SETTINGS_TAB_CLICKED, {
          properties: {
            destination,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendBtc.SEND_BTC_INITIALIZED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const currency = 'BTC'

        analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
          properties: {
            currency,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        analytics.push(AnalyticsKey.SEND_RECEIVE_VIEWED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            path: pathname,
            referrer,
            search,
            title,
            url: href
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendBch.SEND_BCH_INITIALIZED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const currency = 'BCH'

        analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
          properties: {
            currency,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        analytics.push(AnalyticsKey.SEND_RECEIVE_VIEWED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            path: pathname,
            referrer,
            search,
            title,
            url: href
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendXlm.SEND_XLM_INITIALIZED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const currency = 'XLM'

        analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
          properties: {
            currency,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        analytics.push(AnalyticsKey.SEND_RECEIVE_VIEWED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            path: pathname,
            referrer,
            search,
            title,
            url: href
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendEth.SEND_ETH_INITIALIZED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const currency = action.payload

        analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
          properties: {
            currency,
            id,
            originalTimestamp: getOriginalTimestamp()
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        analytics.push(AnalyticsKey.SEND_RECEIVE_VIEWED, {
          properties: {
            id,
            originalTimestamp: getOriginalTimestamp(),
            path: pathname,
            referrer,
            search,
            title,
            url: href
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendBtc.SEND_BTC_FIRST_STEP_SUBMIT_CLICKED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const feePriority = state.components.sendBtc.payment.getOrElse({})?.fees.priority
        const currency = state.form['@SEND'].BTC.FORM.values.coin
        const feeRate =
          state.form['@SEND'].BTC.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? FeeRate.BACKEND
            : state.form['@SEND'].BTC.FORM.values.feePerByte === feePriority
            ? FeeRate.PRIORITY
            : FeeRate.NORMAL
        const fromAccountType =
          state.form['@SEND'].BTC.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const toAccountType =
          state.form['@SEND'].BTC.FORM.values.to.value.value.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SEND_AMOUNT_ENTERED, {
          properties: {
            currency,
            fee_rate: feeRate,
            from_account_type: fromAccountType,
            id,
            originalTimestamp: getOriginalTimestamp(),
            to_account_type: toAccountType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendBch.SEND_BCH_FIRST_STEP_SUBMIT_CLICKED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const feePriority = state.components.sendBch.payment.getOrElse({})?.fees.priority
        const currency = state.form['@SEND'].BCH.FORM.values.coin
        const feeRate =
          state.form['@SEND'].BCH.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? FeeRate.BACKEND
            : state.form['@SEND'].BCH.FORM.values.feePerByte === feePriority
            ? FeeRate.PRIORITY
            : FeeRate.NORMAL
        const fromAccountType =
          state.form['@SEND'].BCH.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const toAccountType =
          state.form['@SEND'].BCH.FORM.values.to.value.value.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SEND_AMOUNT_ENTERED, {
          properties: {
            currency,
            fee_rate: feeRate,
            from_account_type: fromAccountType,
            id,
            originalTimestamp: getOriginalTimestamp(),
            to_account_type: toAccountType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendXlm.SEND_XLM_FIRST_STEP_SUBMIT_CLICKED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const feePriority = state.components.sendXlm.payment.getOrElse({})?.fees.priority
        const currency = state.form['@SEND'].XLM.FORM.values.coin
        const feeRate =
          state.form['@SEND'].XLM.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? FeeRate.BACKEND
            : state.form['@SEND'].XLM.FORM.values.feePerByte === feePriority
            ? FeeRate.PRIORITY
            : FeeRate.NORMAL
        const fromAccountType =
          state.form['@SEND'].XLM.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const toAccountType =
          state.form['@SEND'].XLM.FORM.values.to.value.value.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SEND_AMOUNT_ENTERED, {
          properties: {
            currency,
            fee_rate: feeRate,
            from_account_type: fromAccountType,
            id,
            originalTimestamp: getOriginalTimestamp(),
            to_account_type: toAccountType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendEth.SEND_ETH_FIRST_STEP_SUBMIT_CLICKED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const feePriority = state.components.sendEth.payment.getOrElse({})?.fees.priority
        const currency = state.form['@SEND'].ETH.FORM.values.coin
        const feeRate =
          state.form['@SEND'].ETH.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? FeeRate.BACKEND
            : state.form['@SEND'].ETH.FORM.values.feePerByte === feePriority
            ? FeeRate.PRIORITY
            : FeeRate.NORMAL
        const fromAccountType =
          state.form['@SEND'].ETH.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const toAccountType =
          state.form['@SEND'].ETH.FORM.values.to.value.value.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SEND_AMOUNT_ENTERED, {
          properties: {
            currency,
            fee_rate: feeRate,
            from_account_type: fromAccountType,
            id,
            originalTimestamp: getOriginalTimestamp(),
            to_account_type: toAccountType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendBtc.SEND_BTC_SECOND_STEP_SUBMIT_CLICKED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const feePriority = state.components.sendBtc.payment.getOrElse({})?.fees.priority
        const currency = state.form['@SEND'].BTC.FORM.values.coin
        const feeRate =
          state.form['@SEND'].BTC.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? FeeRate.BACKEND
            : state.form['@SEND'].BTC.FORM.values.feePerByte === feePriority
            ? FeeRate.PRIORITY
            : FeeRate.NORMAL
        const fromAccountType =
          state.form['@SEND'].BTC.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const toAccountType =
          state.form['@SEND'].BTC.FORM.values.to.value.value.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SEND_SUBMITTED, {
          properties: {
            currency,
            fee_rate: feeRate,
            from_account_type: fromAccountType,
            id,
            originalTimestamp: getOriginalTimestamp(),
            to_account_type: toAccountType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendBch.SEND_BCH_SECOND_STEP_SUBMIT_CLICKED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const feePriority = state.components.sendBch.payment.getOrElse({})?.fees.priority
        const currency = state.form['@SEND'].BCH.FORM.values.coin
        const feeRate =
          state.form['@SEND'].BCH.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? FeeRate.BACKEND
            : state.form['@SEND'].BCH.FORM.values.feePerByte === feePriority
            ? FeeRate.PRIORITY
            : FeeRate.NORMAL
        const fromAccountType =
          state.form['@SEND'].BCH.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const toAccountType =
          state.form['@SEND'].BCH.FORM.values.to.value.value.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SEND_SUBMITTED, {
          properties: {
            currency,
            fee_rate: feeRate,
            from_account_type: fromAccountType,
            id,
            originalTimestamp: getOriginalTimestamp(),
            to_account_type: toAccountType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendXlm.SEND_XLM_SECOND_STEP_SUBMIT_CLICKED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const feePriority = state.components.sendXlm.payment.getOrElse({})?.fees.priority
        const currency = state.form['@SEND'].XLM.FORM.values.coin
        const feeRate =
          state.form['@SEND'].XLM.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? FeeRate.BACKEND
            : state.form['@SEND'].XLM.FORM.values.feePerByte === feePriority
            ? FeeRate.PRIORITY
            : FeeRate.NORMAL
        const fromAccountType =
          state.form['@SEND'].XLM.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const toAccountType =
          state.form['@SEND'].XLM.FORM.values.to.value.value.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SEND_SUBMITTED, {
          properties: {
            currency,
            fee_rate: feeRate,
            from_account_type: fromAccountType,
            id,
            originalTimestamp: getOriginalTimestamp(),
            to_account_type: toAccountType
          },
          traits: {
            email,
            nabuId,
            tier
          }
        })

        break
      }
      case AT.components.sendEth.SEND_ETH_SECOND_STEP_SUBMIT_CLICKED: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id
        const email = state.profile.userData.getOrElse({})?.email
        const tier = state.profile.userData.getOrElse({})?.tiers.current
        const id = state.walletPath.wallet.guid
        const feePriority = state.components.sendEth.payment.getOrElse({})?.fees.priority
        const currency = state.form['@SEND'].ETH.FORM.values.coin
        const feeRate =
          state.form['@SEND'].ETH.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? FeeRate.BACKEND
            : state.form['@SEND'].ETH.FORM.values.feePerByte === feePriority
            ? FeeRate.PRIORITY
            : FeeRate.NORMAL
        const fromAccountType =
          state.form['@SEND'].ETH.FORM.values.from.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const toAccountType =
          state.form['@SEND'].ETH.FORM.values.to.value.value.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY

        analytics.push(AnalyticsKey.SEND_SUBMITTED, {
          properties: {
            currency,
            fee_rate: feeRate,
            from_account_type: fromAccountType,
            id,
            originalTimestamp: getOriginalTimestamp(),
            to_account_type: toAccountType
          },
          traits: {
            email,
            nabuId,
            tier
          }
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
