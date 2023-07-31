// DO NOT ADD ANYTHING TO THIS, ONLY REMOVE ENTRIES
// It's being deprecated, see notion doc

import { Coin } from '@core/utils'
import { actions, actionTypes as AT } from 'data'
import {
  BankDWStepType,
  InterestStep,
  ModalName,
  RecurringBuyStepType,
  SwapBaseCounterTypes
} from 'data/types'
import analytics from 'middleware/analyticsMiddleware/analytics'
import {
  AccountType,
  AnalyticsKey,
  DepositMethod,
  FeeRate,
  Order,
  PageName,
  RecurringBuyCancelPayload,
  RecurringBuyClickedPayload,
  RecurringBuyDetailsClickedPayload,
  RecurringBuyInfoViewedPayload,
  RecurringBuyLearnMoreClickPayload,
  RecurringBuyPeriodSelectionPayload,
  RecurringBuySuggestionSkippedPayload,
  RecurringBuyViewedPayload,
  SendReceive,
  WithdrawalMethod
} from 'middleware/analyticsMiddleware/types'
import {
  buyPaymentMethodSelectedPaymentTypeDictionary,
  buySellClickedOriginDictionary,
  getOriginalTimestamp,
  interestDepositClickedOriginDictionary,
  linkBankClickedOriginDictionary,
  manageTabSelectionClickedSelectionDictionary,
  recurringBuyCancelOrigin,
  recurringBuyDetailsClickOrigin,
  sendReceiveClickedOriginDictionary,
  settingsHyperlinkClickedDestinationDictionary,
  settingsTabClickedDestinationDictionary,
  upgradeVerificationClickedOriginDictionary
} from 'middleware/analyticsMiddleware/utils'

const analyticsMiddleware = () => (store) => (next) => (action) => {
  try {
    switch (action.type) {
      case '@@INIT': {
        analytics.clear()
        break
      }
      case AT.router.LOCATION_CHANGE: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const pageName: PageName = action.payload.location.pathname

        try {
          if (window && window.gtag) {
            window.gtag('set', 'page_path', pageName)
            window.gtag('event', 'page_view')
          }
        } catch (e) {
          // do nothing
        }
        // We should find a way to add origins to page changes

        switch (pageName) {
          case '/home': {
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = 'SIGN_IN'

            analytics.push(AnalyticsKey.DASHBOARD_CLICKED, {
              properties: {
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
          case '/earn': {
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = 'NAVIGATION'

            analytics.push(AnalyticsKey.INTEREST_CLICKED, {
              properties: {
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
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            const currency = 'BTC'

            analytics.push(AnalyticsKey.SETTINGS_CURRENCY_CLICKED, {
              properties: {
                currency,
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
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            const currency = 'BCH'

            analytics.push(AnalyticsKey.SETTINGS_CURRENCY_CLICKED, {
              properties: {
                currency,
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
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            const currency = 'ETH'

            analytics.push(AnalyticsKey.SETTINGS_CURRENCY_CLICKED, {
              properties: {
                currency,
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
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            const currency = 'XLM'

            analytics.push(AnalyticsKey.SETTINGS_CURRENCY_CLICKED, {
              properties: {
                currency,
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
      case actions.modals.showModal.type: {
        const state = store.getState()
        const userData = state.profile.getOrElse({})

        const nabuId = userData.id ?? null
        const email = userData.emailVerified ? userData.email : null
        const tier = userData.tiers?.current ?? null

        const modalName: ModalName = action.payload.type
        switch (modalName) {
          case ModalName.SIMPLE_BUY_MODAL: {
            const rawOrigin = action.payload.props.origin
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = buySellClickedOriginDictionary(rawOrigin)

            analytics.push(AnalyticsKey.BUY_SELL_CLICKED, {
              properties: {
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
          case ModalName.REQUEST_CRYPTO_MODAL: {
            const origin = sendReceiveClickedOriginDictionary(action.payload.props.origin)

            analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
              properties: {
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
          case ModalName.BANK_DEPOSIT_MODAL: {
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = 'CURRENCY_PAGE'

            analytics.push(AnalyticsKey.DEPOSIT_CLICKED, {
              properties: {
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
          case ModalName.CUSTODY_WITHDRAW_MODAL: {
            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const origin = 'CURRENCY_PAGE'

            analytics.push(AnalyticsKey.WITHDRAWAL_CLICKED, {
              properties: {
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
          case ModalName.ADD_BANK_YAPILY_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            const origin = linkBankClickedOriginDictionary(action.payload.origin)

            analytics.push(AnalyticsKey.LINK_BANK_CLICKED, {
              properties: {
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
          case ModalName.ADD_BANK_YODLEE_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            const origin = linkBankClickedOriginDictionary(action.payload.origin)

            analytics.push(AnalyticsKey.LINK_BANK_CLICKED, {
              properties: {
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
          case ModalName.KYC_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null
            let currency = state.profile.userData.getOrElse({})?.limits[0]?.currency
            if (!currency) {
              currency = state.settingsPath.currency
            }

            const upgradeTier = action.payload.props.tier

            const origin = upgradeVerificationClickedOriginDictionary(action.payload.props.origin)

            analytics.push(AnalyticsKey.UPGRADE_VERIFICATION_CLICKED, {
              properties: {
                currency,
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
          case ModalName.VERIFY_MESSAGE_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            analytics.push(AnalyticsKey.ADDRESS_VERIFY_MESSAGE_CLICKED, {
              properties: {
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
          case ModalName.MOBILE_NUMBER_CHANGE_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            analytics.push(AnalyticsKey.CHANGE_MOBILE_NUMBER_CLICKED, {
              properties: {
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
          case ModalName.MOBILE_NUMBER_ADD_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            analytics.push(AnalyticsKey.ADD_MOBILE_NUMBER_CLICKED, {
              properties: {
                origin: 'SETTINGS',
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
          case ModalName.IMPORT_BTC_ADDRESS_MODAL: {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            analytics.push(AnalyticsKey.IMPORT_ADDRESS_CLICKED, {
              properties: {
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const origin = 'SIGN_UP'

        analytics.push(AnalyticsKey.EMAIL_VERIFICATION_REQUESTED, {
          properties: {
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const origin = 'SIGN_UP'

        analytics.push(AnalyticsKey.EMAIL_VERIFICATION_SKIPPED, {
          properties: {
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
      case actions.components.interest.setCoinDisplay.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const { isCoinDisplayed } = action.payload
        const fix = isCoinDisplayed ? Coin.CRYPTO : Coin.FIAT
        const product = 'SAVINGS'

        analytics.push(AnalyticsKey.AMOUNT_SWITCHED, {
          properties: {
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

      case actions.components.swap.switchFix.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const { fix } = action.payload

        analytics.push(AnalyticsKey.AMOUNT_SWITCHED, {
          properties: {
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

      case actions.components.buySell.switchFix.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const { fix } = action.payload

        analytics.push(AnalyticsKey.AMOUNT_SWITCHED, {
          properties: {
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

      case actions.components.buySell.handleBuyMaxAmountClick.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const maxCardLimit = Number(action.payload.amount) / 100
        const inputCurrency = state.components.buySell.fiatCurrency
        const outputCurrency = state.components.buySell.cryptoCurrency
        const paymentType = buyPaymentMethodSelectedPaymentTypeDictionary(
          state.components.buySell.method.type
        )

        analytics.push(AnalyticsKey.BUY_AMOUNT_MAX_CLICKED, {
          properties: {
            input_currency: inputCurrency,
            max_card_limit: maxCardLimit,
            originalTimestamp: getOriginalTimestamp(),
            output_currency: outputCurrency,
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
      case actions.components.buySell.handleBuyMinAmountClick.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const inputCurrency = state.components.buySell.fiatCurrency
        const outputCurrency = state.components.buySell.cryptoCurrency

        analytics.push(AnalyticsKey.BUY_AMOUNT_MIN_CLICKED, {
          properties: {
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
      case actions.components.swap.handleSwapMaxAmountClick.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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
      case actions.components.swap.handleSwapMinAmountClick.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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

      case AT.components.request.GET_NEXT_ADDRESS: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const accountType =
          state.form.requestCrypto.values.selectedAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const currency = state.form.requestCrypto.values.selectedAccount.coin

        analytics.push(AnalyticsKey.RECEIVE_CURRENCY_SELECTED, {
          properties: {
            account_type: accountType,
            currency,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const accountType =
          state.form.requestCrypto.values.selectedAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const currency = state.form.requestCrypto.values.selectedAccount.coin

        analytics.push(AnalyticsKey.RECEIVE_DETAILS_COPIED, {
          properties: {
            account_type: accountType,
            currency,
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
      case actions.components.buySell.setBuyCrypto.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const rawOrigin = action.payload.props.origin
        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const origin = buySellClickedOriginDictionary(rawOrigin)

        analytics.push(AnalyticsKey.BUY_SELL_CLICKED, {
          properties: {
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
      case actions.components.buySell.setSellCrypto.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const rawOrigin = action.payload.props.origin
        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const origin = buySellClickedOriginDictionary(rawOrigin)

        analytics.push(AnalyticsKey.BUY_SELL_CLICKED, {
          properties: {
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

      case actions.components.buySell.setStep.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const stepName = action.payload.step

        switch (stepName) {
          case 'ENTER_AMOUNT':
          case 'SELL_ENTER_AMOUNT': {
            if (action.payload.orderType === Order.BUY) {
              break
            }

            const accountType =
              action.payload.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
                ? AccountType.TRADING
                : AccountType.USERKEY
            const inputCurrency = state.components.buySell.fiatCurrency

            analytics.push(AnalyticsKey.SELL_FROM_SELECTED, {
              properties: {
                from_account_type: accountType,
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
              state.components.buySell.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
                ? AccountType.TRADING
                : AccountType.USERKEY
            const inputCurrency = state.components.buySell.fiatCurrency
            const inputAmount = Number(state.form.buySellCheckout.values.amount)
            const outputCurrency = state.components.buySell.cryptoCurrency

            analytics.push(AnalyticsKey.SELL_AMOUNT_ENTERED, {
              properties: {
                from_account_type: accountType,
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
      case actions.components.buySell.handleSellMaxAmountClick.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const accountType =
          state.components.buySell.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const inputCurrency = state.components.buySell.fiatCurrency
        const outputCurrency = state.components.buySell.cryptoCurrency

        analytics.push(AnalyticsKey.SELL_AMOUNT_MAX_CLICKED, {
          properties: {
            from_account_type: accountType,
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
      case actions.components.buySell.handleSellMinAmountClick.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const accountType =
          state.components.buySell.swapAccount.type === SwapBaseCounterTypes.CUSTODIAL
            ? AccountType.TRADING
            : AccountType.USERKEY
        const inputCurrency = state.components.buySell.fiatCurrency
        const outputCurrency = state.components.buySell.cryptoCurrency

        analytics.push(AnalyticsKey.SELL_AMOUNT_MIN_CLICKED, {
          properties: {
            from_account_type: accountType,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const originModal = state.modals.find((modal) => modal.type).type

        switch (originModal) {
          case 'BANK_DEPOSIT_MODAL': {
            const depositMethod = state.components.brokerage.account
              ? DepositMethod.BANK_ACCOUNT
              : DepositMethod.BANK_TRANSFER
            const currency = state.components.brokerage.fiatCurrency

            analytics.push(AnalyticsKey.DEPOSIT_METHOD_SELECTED, {
              properties: {
                currency,
                deposit_method: depositMethod,
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
      case actions.components.recurringBuy.setPeriod.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        analytics.push(AnalyticsKey.RECURRING_BUY_PERIOD_SELECTED, {
          properties: {
            ...action.payload
          } as RecurringBuyPeriodSelectionPayload,
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case actions.components.recurringBuy.viewed.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null
        const path = window.location.pathname
        const url = window.location.href
        const { search } = window.location
        const { title } = window.document
        const { referrer } = window.document

        analytics.push(AnalyticsKey.RECURRING_BUY_VIEWED, {
          properties: {
            path,
            referrer,
            search,
            title,
            url
          } as RecurringBuyViewedPayload,
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case actions.components.recurringBuy.learnMoreLinkClicked.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null
        const origin = action.payload

        analytics.push(AnalyticsKey.RECURRING_BUY_LEARN_MORE_CLICKED, {
          properties: { origin } as RecurringBuyLearnMoreClickPayload,
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case actions.components.recurringBuy.suggestionSkipped.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null
        const origin = action.payload
        analytics.push(AnalyticsKey.RECURRING_BUY_SUGGESTION_SKIPPED, {
          properties: { origin } as RecurringBuySuggestionSkippedPayload,
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case actions.components.recurringBuy.infoViewed.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null
        const page = action.payload
        analytics.push(AnalyticsKey.RECURRING_BUY_INFO_VIEWED, {
          properties: { page } as RecurringBuyInfoViewedPayload,
          traits: {
            email,
            nabuId,
            tier
          }
        })
        break
      }
      case actions.components.recurringBuy.setStep.type: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null
        const stepName: RecurringBuyStepType = action.payload.step
        switch (stepName) {
          case RecurringBuyStepType.REMOVE_CONFIRM: {
            const origin = recurringBuyCancelOrigin(action.payload.origin)
            const {
              destinationCurrency: output_currency,
              inputCurrency: input_currency,
              inputValue: input_amount,
              paymentMethod: payment_method,
              period: frequency
            } = state.components.recurringBuy.active

            analytics.push(AnalyticsKey.CANCEL_RECURRING_BUY_CLICKED, {
              properties: {
                frequency,
                input_amount: Number(input_amount),
                input_currency,
                origin,
                output_currency,
                payment_method
              } as RecurringBuyCancelPayload,
              traits: {
                email,
                nabuId,
                tier
              }
            })
            break
          }
          case RecurringBuyStepType.GET_STARTED: {
            analytics.push(AnalyticsKey.RECURRING_BUY_CLICKED, {
              properties: {
                origin
              } as RecurringBuyClickedPayload,
              traits: {
                email,
                nabuId,
                tier
              }
            })
            break
          }
          case RecurringBuyStepType.DETAILS: {
            const { inputCurrency: currency }: { inputCurrency: string } =
              state.components.recurringBuy.active
            const origin = recurringBuyDetailsClickOrigin(action.payload.origin)
            analytics.push(AnalyticsKey.RECURRING_BUY_DETAILS_CLICKED, {
              properties: {
                currency,
                origin
              } as RecurringBuyDetailsClickedPayload,
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
      case actions.components.interest.showInterestModal.type: {
        const stepName: InterestStep = action.payload.step

        switch (stepName) {
          case 'DEPOSIT': {
            const state = store.getState()
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            const { href, pathname, search } = window.location
            const { referrer, title } = document
            const currency = action.payload.coin

            const origin = interestDepositClickedOriginDictionary(action.payload.props.origin)

            analytics.push(AnalyticsKey.INTEREST_DEPOSIT_CLICKED, {
              properties: {
                currency,
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
            const nabuId = state.profile.userData.getOrElse({})?.id ?? null
            const email = state.profile.userData.getOrElse({})?.emailVerified
              ? state.profile.userData.getOrElse({})?.email
              : null
            const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

            const { href, pathname, search } = window.location
            const { referrer, title } = document

            const origin = 'CURRENCY_PAGE'

            analytics.push(AnalyticsKey.INTEREST_WITHDRAWAL_CLICKED, {
              properties: {
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
      case AT.preferences.SET_LINK_HANDLING: {
        const state = store.getState()
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        analytics.push(AnalyticsKey.CRYPTO_LINK_HANDLING_CLICKED, {
          properties: {
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const { currency } = action.payload
        const selection = manageTabSelectionClickedSelectionDictionary(action.payload.selection)

        analytics.push(AnalyticsKey.MANAGE_TAB_SELECTION_CLICKED, {
          properties: {
            currency,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const isEmailEnabled = action.payload.types.includes(32)
        const isSMSEnabled = action.payload.types.includes(32)

        analytics.push(AnalyticsKey.NOTIFICATION_PREFERENCES_UPDATED, {
          properties: {
            email_enabled: isEmailEnabled,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const currency = 'BTC'

        analytics.push(AnalyticsKey.PRIVATE_KEYS_SHOWN, {
          properties: {
            currency,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const currency = 'ETH'

        analytics.push(AnalyticsKey.PRIVATE_KEYS_SHOWN, {
          properties: {
            currency,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const currency = 'XLM'

        analytics.push(AnalyticsKey.PRIVATE_KEYS_SHOWN, {
          properties: {
            currency,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const destination = settingsHyperlinkClickedDestinationDictionary(
          action.payload.destination
        )

        analytics.push(AnalyticsKey.SETTINGS_HYPERLINK_CLICKED, {
          properties: {
            destination,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const destination = settingsTabClickedDestinationDictionary(action.payload.destination)

        analytics.push(AnalyticsKey.SETTINGS_TAB_CLICKED, {
          properties: {
            originalTimestamp: getOriginalTimestamp(),
            settings_tab: destination
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const currency = 'BTC'
        const origin = sendReceiveClickedOriginDictionary(action.payload.props.origin)

        analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
          properties: {
            currency,
            origin,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const currency = 'BCH'
        const origin = sendReceiveClickedOriginDictionary(action.payload.props.origin)

        analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
          properties: {
            currency,
            origin,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const currency = 'XLM'
        const origin = sendReceiveClickedOriginDictionary(action.payload.props.origin)

        analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
          properties: {
            currency,
            origin,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

        const { href, pathname, search } = window.location
        const { referrer, title } = document
        const currency = action.payload
        const origin = sendReceiveClickedOriginDictionary(action.payload.props.origin)

        analytics.push(AnalyticsKey.SEND_RECEIVE_CLICKED, {
          properties: {
            currency,
            origin,
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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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
        const nabuId = state.profile.userData.getOrElse({})?.id ?? null
        const email = state.profile.userData.getOrElse({})?.emailVerified
          ? state.profile.userData.getOrElse({})?.email
          : null
        const tier = state.profile.userData.getOrElse({})?.tiers?.current ?? null

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
