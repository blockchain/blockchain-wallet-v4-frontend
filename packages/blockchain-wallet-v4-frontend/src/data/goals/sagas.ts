import base64 from 'base-64'
import BigNumber from 'bignumber.js'
import bip21 from 'bip21'
import { anyPass, equals, includes, map, path, pathOr, prop, startsWith } from 'ramda'
import { all, call, delay, join, put, select, spawn, take } from 'redux-saga/effects'

import { Exchange, utils } from '@core'
import {
  InterestAfterTransactionType,
  RatesType,
  TermsAndConditionType,
  WalletFiatType
} from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, model, selectors } from 'data'
import { getBchBalance, getBtcBalance } from 'data/balance/sagas'
import { parsePaymentRequest } from 'data/bitpay/sagas'
import { ModalName } from 'data/modals/types'
import profileSagas from 'data/modules/profile/sagas'
import { UserDataType } from 'data/types'
import * as C from 'services/alerts'

import { WAIT_FOR_INTEREST_PROMO_MODAL } from './model'
import { DeepLinkGoal, GoalType } from './types'

const origin = 'Goals'
const logLocation = 'goals/sagas'

export default ({ api, coreSagas, networks }) => {
  const { DOC_RESUBMISSION_REASONS, KYC_STATES, TIERS } = model.profile
  const { NONE } = KYC_STATES
  const { EXPIRED, GENERAL } = DOC_RESUBMISSION_REASONS

  const { fetchUser, waitForUserData } = profileSagas({
    api,
    coreSagas,
    networks
  })

  const isKycNotFinished = function* () {
    yield call(waitForUserData)
    return selectors.modules.profile
      .getUserKYCState(yield select())
      .map(equals(NONE))
      .getOrElse(false)
  }

  const defineLinkAccountGoal = function* (search) {
    const params = new URLSearchParams(search)
    yield put(
      actions.goals.saveGoal({
        data: {
          linkId: params.get('link_id')
        },
        name: 'linkAccount'
      })
    )
    yield delay(3000)
  }

  const defineReferralGoal = function* (search) {
    const params = new URLSearchParams(search)
    yield put(
      actions.goals.saveGoal({
        data: {
          code: params.get('campaign_code'),
          email: params.get('campaign_email'),
          name: params.get('campaign')
        },
        name: 'referral'
      })
    )
    const destination = params.get('newUser') ? '/signup' : '/login'
    yield put(actions.router.push(destination))
  }

  const defineBuySellGoal = function* (search) {
    // /#/open/simple-buy?crypto={BTC | ETH | ...}&amount={1 | 99 | 200 | ...}&email={test@blockchain.com | ...}&fiatCurrency={USD | GBP | ...}
    const params = new URLSearchParams(search)
    const amount = params.get('amount')
    const crypto = params.get('crypto')
    const email = params.get('email')
    const fiatCurrency = params.get('fiatCurrency')

    yield put(
      actions.goals.saveGoal({
        data: {
          amount,
          crypto,
          email,
          fiatCurrency
        },
        name: 'buySell'
      })
    )

    if (amount && crypto && email && fiatCurrency) {
      yield put(actions.router.push('/signup'))
    }
  }

  const defineSendCryptoGoal = function* (pathname, search) {
    // special case to handle bitcoin bip21 link integration
    const decodedPayload = decodeURIComponent(pathname + search)
    const isBchPayPro = includes('bitcoincash', decodedPayload)
    // bip21 doesnt like special chars in protocol links
    const bip21Payload = isBchPayPro
      ? bip21.decode(decodedPayload.replace('web+', ''), 'bitcoincash')
      : bip21.decode(decodedPayload)

    // check for BitPay payment protocol
    if (path(['options', 'r'], bip21Payload)) {
      const r = pathOr({}, ['options', 'r'], bip21Payload)
      const data = {
        coin: isBchPayPro ? 'BCH' : 'BTC',
        r
      }
      yield put(actions.goals.saveGoal({ data, name: 'paymentProtocol' }))
      yield put(actions.router.push('/wallet'))
      yield put(actions.alerts.displayInfo(C.PLEASE_LOGIN))
    } else {
      // BTC payments
      const { address } = bip21Payload
      const { amount, message } = bip21Payload.options || {}
      const data = { address, amount, description: message }
      yield put(actions.goals.saveGoal({ data, name: 'payment' }))
      yield put(actions.router.push('/wallet'))
      yield put(actions.alerts.displayInfo(C.PLEASE_LOGIN))
    }
  }

  const defineActionGoal = function* (pathname, search) {
    try {
      // Other scenarios with actions encoded in base64
      const decoded = JSON.parse(base64.decode(pathname + search))
      if (!prop('name', decoded) || !prop('data', decoded)) return
      const { data, name } = decoded
      yield put(actions.goals.saveGoal({ data, name }))
      yield put(actions.router.push('/wallet'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'decodeGoal', pathname + search))
    }
  }

  const defineWalletConnectGoal = function* (search) {
    // cant use URLSearchParams as it parses the oddly formed uri incorrectly
    const walletConnectURI = search.split('?uri=')[1]
    yield put(actions.goals.saveGoal({ data: walletConnectURI, name: 'walletConnect' }))
  }

  const defineDeepLinkGoals = function* (pathname, search) {
    // /#/open/wc?uri={wc_uri}
    if (startsWith(DeepLinkGoal.WALLET_CONNECT, pathname)) {
      return yield call(defineWalletConnectGoal, search)
    }

    // crypto send / bitpay links
    if (includes(DeepLinkGoal.BITCOIN, pathname)) {
      return yield call(defineSendCryptoGoal, pathname, search)
    }

    // /#/open/simple-buy
    if (startsWith(DeepLinkGoal.SIMPLE_BUY, pathname)) {
      return yield call(defineBuySellGoal, search)
    }

    if (startsWith(DeepLinkGoal.LINK_ACCOUNT, pathname)) {
      return yield call(defineLinkAccountGoal, search)
    }

    if (startsWith(DeepLinkGoal.REFERRAL, pathname)) {
      return yield call(defineReferralGoal, search)
    }

    yield call(defineActionGoal, pathname, search)
  }

  const defineGoals = function* () {
    const search = yield select(selectors.router.getSearch)
    const pathname = yield select(selectors.router.getPathname)
    yield take('@@router/LOCATION_CHANGE')
    const deepLink = prop(1, pathname.match('/open/(.*)'))
    if (deepLink) yield call(defineDeepLinkGoals, deepLink, search)
  }

  const runBuySellGoal = function* (goal: GoalType) {
    const {
      data: { amount, crypto, fiatCurrency, id }
    } = goal
    yield put(actions.goals.deleteGoal(id))

    yield put(
      actions.goals.addInitialModal({
        data: {
          amount,
          crypto,
          fiatCurrency,
          origin
        },
        key: 'buySellModal',
        name: 'SIMPLE_BUY_MODAL'
      })
    )
  }

  const runLinkAccountGoal = function* (goal: GoalType) {
    const { data, id } = goal
    yield put(actions.goals.deleteGoal(id))
    yield put(
      actions.goals.addInitialModal({
        data,
        key: 'linkAccount',
        name: 'LINK_FROM_EXCHANGE_ACCOUNT_MODAL'
      })
    )
  }

  const runReferralGoal = function* (goal) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    // use this for future airdrop referrals
  }

  const runPaymentProtocolGoal = function* (goal) {
    const { data, id } = goal
    const { coin, r } = data
    const coinRate = selectors.core.data.coins.getRates(coin, yield select())

    yield put(actions.goals.deleteGoal(id))

    if (equals('BTC', coin)) {
      yield call(getBtcBalance)
    } else {
      yield call(getBchBalance)
    }

    const invoiceId = r.split('/i/')[1]
    const currency = yield select(selectors.core.settings.getCurrency)

    try {
      const rawPaymentRequest = yield call(api.getRawPaymentRequest, invoiceId, coin)
      const paymentRequest = yield call(parsePaymentRequest, rawPaymentRequest)
      const { instructions } = paymentRequest

      if (new Date() > new Date(paymentRequest.expires)) {
        return yield put(
          actions.modals.showModal('BITPAY_INVOICE_EXPIRED_MODAL', {
            origin: 'PaymentProtocolGoal'
          })
        )
      }

      const tx = path([0, 'outputs', 0], instructions)
      // @ts-ignore
      const satoshiAmount = tx.amount
      // @ts-ignore
      const { address } = tx
      const merchant = paymentRequest.memo.split('for merchant ')[1]
      const payPro = {
        expiration: paymentRequest.expires,
        merchant,
        paymentUrl: r
      }
      const paymentCryptoAmount = Exchange.convertCoinToCoin({
        coin,
        value: satoshiAmount
      })
      const paymentFiatAmount = Exchange.convertCoinToFiat({
        coin,
        currency: currency.getOrElse(null),
        isStandard: true,
        rates: coinRate.getOrElse({} as RatesType),
        value: paymentCryptoAmount
      })

      if (equals('BTC', coin)) {
        yield put(
          actions.goals.addInitialModal({
            data: {
              amount: {
                coin: paymentCryptoAmount,
                fiat: paymentFiatAmount
              },
              description: merchant,
              origin,
              payPro,
              to: address
            },
            key: 'payment',
            name: model.components.sendBtc.MODAL
          })
        )
      } else {
        yield put(
          actions.goals.addInitialModal({
            data: {
              amount: {
                coin: paymentCryptoAmount,
                fiat: paymentFiatAmount
              },
              description: merchant,
              origin,
              payPro,
              to: address
            },
            key: 'payment',
            name: model.components.sendBch.MODAL
          })
        )
      }
    } catch (e) {
      yield put(actions.alerts.displayInfo(C.BITPAY_INVOICE_NOT_FOUND_ERROR))
      yield put(actions.logs.logErrorMessage(logLocation, 'runPaymentProtocolGoal', e))
    }
  }

  const runSendBtcGoal = function* (goal: GoalType) {
    const { data, id } = goal
    yield put(actions.goals.deleteGoal(id))

    yield call(getBtcBalance)

    const { address, amount, description } = data
    const currency = yield select(selectors.core.settings.getCurrency)
    const btcRates = selectors.core.data.coins.getRates('BTC', yield select())
    const fiat = Exchange.convertCoinToFiat({
      coin: 'BTC',
      currency: currency.getOrElse('USD'),
      isStandard: true,
      rates: btcRates.getOrElse({} as RatesType),
      value: amount
    })
    // Goal work
    yield put(
      actions.goals.addInitialModal({
        data: {
          amount: { coin: amount, fiat },
          description,
          origin,
          to: address
        },
        key: 'payment',
        name: model.components.sendBtc.MODAL
      })
    )
  }

  const runSwapUpgradeGoal = function* (goal: GoalType) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    const showSwapUpgrade = yield select(selectors.preferences.getShowSwapUpgrade)
    if (!showSwapUpgrade) return
    yield call(waitForUserData)
    const closeToTier1Limit = (yield select(selectors.modules.profile.closeToTier1Limit)).getOrElse(
      false
    )
    if (closeToTier1Limit)
      return yield put(
        actions.goals.addInitialModal({
          data: {
            currentTier: TIERS[1],
            nextTier: TIERS[2],
            origin
          },
          key: 'swapUpgrade',
          name: 'KYC_TIER_UPGRADE_MODAL'
        })
      )
  }

  const runKycDocResubmitGoal = function* (goal: GoalType) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    yield call(waitForUserData)
    // check if user needs to resubmit docs
    const showKycDocResubmitModal = (yield select(
      selectors.modules.profile.getKycDocResubmissionStatus
    ))
      .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
      .getOrElse(false)
    // check if user is under review. resubmission status sometimes only
    // is removed from user profile after they are verified
    const kycState = (yield select(selectors.modules.profile.getUserKYCState)).getOrElse('NONE')
    const isKycPending = kycState === KYC_STATES.UNDER_REVIEW || kycState === KYC_STATES.PENDING
    if (showKycDocResubmitModal && !isKycPending) {
      yield put(
        actions.goals.addInitialModal({
          data: {
            origin
          },
          key: 'kycDocResubmit',
          name: 'KYC_RESUBMIT_MODAL'
        })
      )
    }
  }

  const runWalletConnectGoal = function* (goal: GoalType) {
    try {
      const { data: uri, id } = goal
      const walletConnectEnabled = (yield select(
        selectors.core.walletOptions.getWalletConnectEnabled
      )).getOrElse(false)
      yield put(actions.goals.deleteGoal(id))
      if (walletConnectEnabled) {
        yield put(
          actions.goals.addInitialModal({
            data: {
              origin,
              uri
            },
            key: 'walletConnect',
            name: ModalName.WALLET_CONNECT_MODAL
          })
        )
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage('goals', 'runWalletConnectGoal', error))
    }
  }

  const runSyncPitGoal = function* (goal: GoalType) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    try {
      yield call(waitForUserData)
      const isExchangeRelinkRequired = selectors.modules.profile
        .isExchangeRelinkRequired(yield select())
        .getOrElse(false)
      if (isExchangeRelinkRequired) {
        yield put(actions.modules.profile.shareWalletAddressesWithExchange())
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage('goals', 'runSyncToPitGoal', error))
    }
  }

  const runWelcomeModal = function* (goal: GoalType) {
    const { data, id } = goal
    const { firstLogin } = data
    yield put(actions.goals.deleteGoal(id))
    // Check if new wallet is from regular new registration
    // or nabu account reset
    const isAccountReset: boolean = yield select(selectors.auth.getAccountReset)
    if (firstLogin && !isAccountReset) {
      yield put(
        actions.goals.addInitialModal({
          data: {
            origin
          },
          key: 'welcomeModal',
          name: ModalName.WELCOME_MODAL
        })
      )
    }
  }

  const runTransferEthGoal = function* (goal: GoalType) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    const legacyAccountR = yield select(selectors.core.kvStore.eth.getLegacyAccount)
    const legacyAccount = legacyAccountR.getOrElse(null)
    if (!legacyAccount) return

    const { addr: legacyEthAddr, correct } = legacyAccount
    const fees = yield call(api.getEthFees)
    const feeAmount = yield call(utils.eth.calculateFee, fees.regular, fees.gasLimit, true)
    // if not swept, get the legacy eth account balance and prompt sweep
    if (!correct && legacyEthAddr) {
      const ethBalances = yield call(api.getEthBalances, legacyEthAddr)
      const legacyEthBalance = path<string>([legacyEthAddr, 'balance'], ethBalances) || 0
      const legacyEthBalanceBigInt = new BigNumber(legacyEthBalance)
      const feeAmountBigInt = new BigNumber(feeAmount)
      if (legacyEthBalanceBigInt.isGreaterThan(feeAmountBigInt)) {
        yield put(
          actions.goals.addInitialModal({
            data: {
              legacyEthAddr,
              legacyEthBalance,
              origin
            },
            key: 'transferEth',
            name: 'TRANSFER_ETH_MODAL'
          })
        )
      }
    }
  }

  const runInterestPromo = function* (goal: GoalType) {
    // do not show modal immediately, wait 5 seconds
    yield delay(WAIT_FOR_INTEREST_PROMO_MODAL)
    yield call(waitForUserData)
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    const { current } = (yield select(selectors.modules.profile.getUserTiers)).getOrElse({
      current: 0
    }) || { current: 0 }

    // we show this only for tier 2 users
    if (current === TIERS[2]) {
      const currency = (yield select(selectors.core.settings.getCurrency)).getOrElse(
        'USD'
      ) as WalletFiatType
      yield put(actions.components.interest.fetchShowInterestCardAfterTransaction({ currency }))
      // make sure that fetch is done
      yield take([
        actions.components.interest.fetchShowInterestCardAfterTransactionSuccess.type,
        actions.components.interest.fetchShowInterestCardAfterTransactionFailure.type
      ])
      const afterTransactionR = yield select(selectors.components.interest.getAfterTransaction)
      const afterTransaction = afterTransactionR.getOrElse({
        show: false
      } as InterestAfterTransactionType)
      if (afterTransaction?.show) {
        yield put(
          actions.components.buySell.fetchPairs({ coin: afterTransaction.currency, currency })
        )
        yield put(
          actions.goals.addInitialModal({
            data: { origin },
            key: 'interestPromo',
            name: 'INTEREST_PROMO_MODAL'
          })
        )
      }
    }
  }

  const showInitialModal = function* () {
    const initialModals = yield select(selectors.goals.getInitialModals)
    const {
      buySellModal,
      entitiesMigration,
      interestPromo,
      kycDocResubmit,
      kycUpgradeRequiredNotice,
      linkAccount,
      payment,
      swapGetStarted,
      swapUpgrade,
      termsAndConditions,
      transferEth,
      walletConnect,
      welcomeModal
    } = initialModals

    // Order matters here
    if (linkAccount) {
      return yield put(actions.modals.showModal(linkAccount.name, linkAccount.data))
    }
    if (transferEth) {
      return yield put(actions.modals.showModal(transferEth.name, transferEth.data))
    }
    if (kycDocResubmit) {
      return yield put(
        actions.modals.showModal(kycDocResubmit.name, {
          origin: 'KycDocResubmitGoal'
        })
      )
    }
    if (walletConnect) {
      return yield put(actions.modals.showModal(ModalName.WALLET_CONNECT_MODAL, walletConnect.data))
    }
    if (payment) {
      return yield put(actions.modals.showModal(payment.name, payment.data))
    }
    if (swapGetStarted) {
      return yield put(actions.modals.showModal(swapGetStarted.name, swapGetStarted.data))
    }
    if (swapUpgrade) {
      return yield put(actions.modals.showModal(swapUpgrade.name, swapUpgrade.data))
    }
    if (entitiesMigration) {
      return yield put(actions.modals.showModal(entitiesMigration.name, entitiesMigration.data))
    }
    if (kycUpgradeRequiredNotice) {
      return yield put(
        actions.modals.showModal(kycUpgradeRequiredNotice.name, kycUpgradeRequiredNotice.data)
      )
    }
    if (termsAndConditions) {
      return yield put(actions.modals.showModal(termsAndConditions.name, termsAndConditions.data))
    }
    if (buySellModal) {
      return yield put(
        actions.components.buySell.showModal({
          cryptoCurrency: buySellModal.data.crypto,
          origin: 'BuySellLink'
        })
      )
    }
    if (interestPromo) {
      return yield put(actions.modals.showModal(interestPromo.name, interestPromo.data))
    }
    if (welcomeModal) {
      const sddEligible = yield call(api.fetchSDDEligible)
      const showCompleteYourProfile = selectors.core.walletOptions
        .getCompleteYourProfile(yield select())
        .getOrElse(null)
      // show SDD flow for eligible country
      if (sddEligible.eligible) {
        // show new complete profile modal
        if (showCompleteYourProfile) {
          return yield put(
            actions.modals.showModal(ModalName.COMPLETE_USER_PROFILE, welcomeModal.data)
          )
        }

        return yield put(actions.components.buySell.showModal({ origin: 'WelcomeModal' }))
      }
      return yield put(actions.modals.showModal(welcomeModal.name, welcomeModal.data))
    }
  }

  const runEntitiesMigrationGoal = function* (goal: GoalType) {
    yield delay(WAIT_FOR_INTEREST_PROMO_MODAL)
    yield call(fetchUser)
    yield call(waitForUserData)
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    const userData = (yield select(selectors.modules.profile.getUserData)).getOrElse({
      address: undefined,
      id: '',
      kycState: 'NONE',
      mobile: '',
      mobileVerified: false,
      state: 'NONE',
      tiers: { current: 0 }
    } as UserDataType)
    const announcementState = selectors.cache.getLastAnnouncementState(yield select())
    const showModal =
      !announcementState ||
      !announcementState['entities-migration'] ||
      (announcementState['entities-migration'] &&
        !announcementState['entities-migration'].dismissed)
    if (userData?.address?.country === 'GB' && showModal) {
      yield put(
        actions.goals.addInitialModal({
          data: { origin },
          key: 'entitiesMigration',
          name: ModalName.ENTITIES_MIGRATION_MODAL
        })
      )
    }
  }

  const runKycUpgradeRequiredNoticeGoal = function* (goal: GoalType) {
    yield delay(WAIT_FOR_INTEREST_PROMO_MODAL)
    yield call(fetchUser)
    yield call(waitForUserData)
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    const { current } = (yield select(selectors.modules.profile.getUserTiers)).getOrElse({
      current: 0
    }) || { current: 0 }

    const showKycUpgradeRequiredNotice = selectors.core.walletOptions
      .getSilverRevamp(yield select())
      .getOrElse(null)

    if (current < 2 && showKycUpgradeRequiredNotice) {
      yield put(
        actions.goals.addInitialModal({
          data: { origin },
          key: 'kycUpgradeRequiredNotice',
          name: ModalName.VERIFY_NOTICE
        })
      )
    }
  }

  const runTermsAndConditionsGoal = function* (goal: GoalType) {
    yield delay(WAIT_FOR_INTEREST_PROMO_MODAL)
    yield call(fetchUser)
    yield call(waitForUserData)
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    const showCompleteYourProfile = selectors.core.walletOptions
      .getShowTermsAndConditions(yield select())
      .getOrElse(null)

    yield put(actions.components.termsAndConditions.fetchTermsAndConditions())
    // make sure that fetch is done
    yield take([
      actions.components.termsAndConditions.fetchTermsAndConditionsSuccess.type,
      actions.components.termsAndConditions.fetchTermsAndConditionsFailure.type
    ])

    const termsAndConditionsChanged = selectors.components.termsAndConditions
      .getTermsAndConditions(yield select())
      .getOrElse({} as TermsAndConditionType)

    if (showCompleteYourProfile && termsAndConditionsChanged?.termsAndConditions) {
      yield put(
        actions.goals.addInitialModal({
          data: { origin },
          key: 'termsAndConditions',
          name: ModalName.TERMS_AND_CONDITIONS
        })
      )
    }
  }

  const runGoal = function* (goal: GoalType) {
    try {
      // Ordering doesn't matter here
      // Try to keep in alphabetical ⬆️
      switch (goal.name) {
        case 'kycDocResubmit':
          yield call(runKycDocResubmitGoal, goal)
          break
        case 'linkAccount':
          yield call(runLinkAccountGoal, goal)
          break
        case 'payment':
          yield call(runSendBtcGoal, goal)
          break
        case 'paymentProtocol':
          yield call(runPaymentProtocolGoal, goal)
          break
        case 'referral':
          yield call(runReferralGoal, goal)
          break
        case 'buySell':
          yield call(runBuySellGoal, goal)
          break
        case 'swapUpgrade':
          yield call(runSwapUpgradeGoal, goal)
          break
        case 'syncPit':
          yield call(runSyncPitGoal, goal)
          break
        case 'transferEth':
          yield call(runTransferEthGoal, goal)
          break
        case 'walletConnect':
          yield call(runWalletConnectGoal, goal)
          break
        case 'welcomeModal':
          yield call(runWelcomeModal, goal)
          break
        case 'interestPromo':
          yield call(runInterestPromo, goal)
          break
        case 'entitiesMigration':
          yield call(runEntitiesMigrationGoal, goal)
          break
        case 'termsAndConditions':
          yield call(runTermsAndConditionsGoal, goal)
          break
        case 'kycUpgradeRequiredNotice':
          yield call(runKycUpgradeRequiredNoticeGoal, goal)
          break
        default:
          break
      }
      yield put(actions.goals.initialModalDisplayed)
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'runGoal', error))
    }
  }

  const runGoals = function* () {
    const goals = yield select(selectors.goals.getGoals)
    const goalTasks = yield all(map((goal) => spawn(runGoal, goal), goals))
    yield all(map(join, goalTasks))
    yield call(showInitialModal)
  }

  const saveGoals = function* (firstLogin) {
    // only for non first login users we save goal here for first login users we do that over verify email page
    if (!firstLogin) {
      yield put(actions.goals.saveGoal({ data: {}, name: 'welcomeModal' }))
    }
    yield put(actions.goals.saveGoal({ data: {}, name: 'swapUpgrade' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'swapGetStarted' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'kycDocResubmit' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'transferEth' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'syncPit' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'interestPromo' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'entitiesMigration' }))
    yield put(actions.goals.saveGoal({ data: {}, name: 'termsAndConditions' }))
    // only for existing users
    if (!firstLogin) {
      yield put(actions.goals.saveGoal({ data: {}, name: 'kycUpgradeRequiredNotice' }))
    }
  }

  return {
    defineGoals,
    runGoal,
    runGoals,
    saveGoals
  }
}
