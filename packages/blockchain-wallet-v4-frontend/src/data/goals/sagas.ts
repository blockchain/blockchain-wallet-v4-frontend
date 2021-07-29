import base64 from 'base-64'
import BigNumber from 'bignumber.js'
import bip21 from 'bip21'
import { anyPass, equals, includes, map, path, pathOr, prop, startsWith, sum, values } from 'ramda'
import { all, call, delay, join, put, select, spawn, take } from 'redux-saga/effects'

import { Exchange, utils } from 'blockchain-wallet-v4/src'
import { InterestAfterTransactionType, WalletFiatType } from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { actions, actionTypes, model, selectors } from 'data'
import { getBchBalance, getBtcBalance } from 'data/balance/sagas'
import { parsePaymentRequest } from 'data/bitpay/sagas'
import { ModalName } from 'data/modals/types'
import profileSagas from 'data/modules/profile/sagas'
import * as C from 'services/alerts'

import { WAIT_FOR_INTEREST_PROMO_MODAL } from './model'
import { DeepLinkGoal, GoalType } from './types'

const { TRANSACTION_EVENTS } = model.analytics

const origin = 'Goals'

export default ({ api, coreSagas, networks }) => {
  const { DOC_RESUBMISSION_REASONS, KYC_STATES, TIERS } = model.profile
  const { NONE } = KYC_STATES
  const { EXPIRED, GENERAL } = DOC_RESUBMISSION_REASONS

  const { waitForUserData } = profileSagas({
    api,
    coreSagas,
    networks
  })

  const logLocation = 'goals/sagas'

  const isKycNotFinished = function* () {
    yield call(waitForUserData)
    return (yield select(selectors.modules.profile.getUserKYCState))
      .map(equals(NONE))
      .getOrElse(false)
  }

  const defineLinkAccountGoal = function* (search) {
    const params = new URLSearchParams(search)
    yield put(
      actions.goals.saveGoal('linkAccount', {
        linkId: params.get('link_id')
      })
    )
    yield delay(3000)
  }

  const defineReferralGoal = function* (search) {
    const params = new URLSearchParams(search)
    yield put(
      actions.goals.saveGoal('referral', {
        code: params.get('campaign_code'),
        email: params.get('campaign_email'),
        name: params.get('campaign')
      })
    )
    const destination = params.get('newUser') ? '/signup' : '/login'
    yield put(actions.router.push(destination))
  }

  const defineKycGoal = function* (search) {
    // /#/open/kyc?tier={1, 2, ...}
    const params = new URLSearchParams(search)

    const tier = params.get('tier') || TIERS[2]

    yield put(actions.goals.saveGoal('kyc', { tier }))
  }

  const defineSwapGoal = function* () {
    yield put(actions.goals.saveGoal('swap', {}))
  }

  const defineInterestGoal = function* () {
    yield put(actions.goals.saveGoal('interest', {}))
  }

  const defineSimpleBuyGoal = function* (search) {
    // /#/open/simple-buy?crypto={BTC | ETH | ...}&amount={1 | 99 | 200 | ...}&email={test@blockchain.com | ...}&fiatCurrency={USD | GBP | ...}
    const params = new URLSearchParams(search)
    const amount = params.get('amount')
    const crypto = params.get('crypto')
    const email = params.get('email')
    const fiatCurrency = params.get('fiatCurrency')

    yield put(
      actions.goals.saveGoal('simpleBuy', {
        amount,
        crypto,
        email,
        fiatCurrency
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
      yield put(actions.goals.saveGoal('paymentProtocol', data))
      yield put(actions.router.push('/wallet'))
      yield put(actions.alerts.displayInfo(C.PLEASE_LOGIN))
    } else {
      // BTC payments
      const { address } = bip21Payload
      const { amount, message } = bip21Payload.options || {}
      const data = { address, amount, description: message }
      yield put(actions.goals.saveGoal('payment', data))
      yield put(actions.router.push('/wallet'))
      yield put(actions.alerts.displayInfo(C.PLEASE_LOGIN))
    }
  }

  const defineLogLevel = function* (search) {
    const params = new URLSearchParams(search)
    const level = params.get('level')
    // @ts-ignore
    window.logLevel = level
    yield put(actions.logs.setLogLevel(level))
  }

  const defineActionGoal = function* (pathname, search) {
    try {
      // Other scenarios with actions encoded in base64
      const decoded = JSON.parse(base64.decode(pathname + search))
      if (!prop('name', decoded) || !prop('data', decoded)) return
      const { data, name } = decoded
      yield put(actions.goals.saveGoal(name, data))
      yield put(actions.router.push('/wallet'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'decodeGoal', pathname + search))
    }
  }

  const defineDeepLinkGoals = function* (pathname, search) {
    if (startsWith(DeepLinkGoal.LINK_ACCOUNT, pathname)) {
      return yield call(defineLinkAccountGoal, search)
    }

    if (startsWith(DeepLinkGoal.REFERRAL, pathname)) {
      return yield call(defineReferralGoal, search)
    }

    // /#/open/kyc?tier={0 | 1 | 2 | ...} tier is optional
    if (startsWith(DeepLinkGoal.KYC, pathname)) {
      return yield call(defineKycGoal, search)
    }

    // TODO check why it uses includes
    // crypto send / bitpay links
    if (includes(DeepLinkGoal.BITCOIN, pathname)) {
      return yield call(defineSendCryptoGoal, pathname, search)
    }

    // /#/log-level?level=verbose
    if (startsWith(DeepLinkGoal.LOG_LEVEL, pathname)) {
      return yield call(defineLogLevel, search)
    }

    // /#/open/simple-buy
    if (startsWith(DeepLinkGoal.SIMPLE_BUY, pathname)) {
      return yield call(defineSimpleBuyGoal, search)
    }

    // /#/open/swap
    if (startsWith(DeepLinkGoal.SWAP, pathname)) {
      return yield call(defineSwapGoal)
    }

    // /#/open/interest
    if (startsWith(DeepLinkGoal.INTEREST, pathname)) {
      return yield call(defineInterestGoal)
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

  const runAirdropClaimGoal = function* (goal: GoalType) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    const showAirdropClaimModal = yield select(selectors.preferences.getShowAirdropClaimModal)
    if (!showAirdropClaimModal) return

    yield call(waitForUserData)
    const { current } = (yield select(selectors.modules.profile.getUserTiers)).getOrElse({
      current: 0
    }) || { current: 0 }
    const blockstackTag = (yield select(selectors.modules.profile.getBlockstackTag)).getOrElse(
      false
    )
    if (current === TIERS[2] && !blockstackTag) {
      yield put(
        actions.goals.addInitialModal('airdropClaim', 'AIRDROP_CLAIM_MODAL', {
          origin
        })
      )
    }
  }

  const runKycGoal = function* (goal: GoalType) {
    try {
      const { data, id } = goal
      const { tier = TIERS[2] } = data
      yield put(actions.goals.deleteGoal(id))
      yield call(waitForUserData)
      const { current } = (yield select(selectors.modules.profile.getUserTiers)).getOrElse({
        current: 0
      }) || { current: 0 }
      if (current >= Number(tier)) return
      yield put(
        actions.components.identityVerification.verifyIdentity({
          needMoreInfo: false,
          origin,
          tier
        })
      )
    } catch (err) {
      yield put(actions.logs.logErrorMessage(logLocation, 'runKycGoal', err.message))
    }
  }

  const runSimpleBuyGoal = function* (goal: GoalType) {
    const {
      data: { amount, crypto, fiatCurrency, id }
    } = goal
    yield put(actions.goals.deleteGoal(id))

    yield put(
      actions.goals.addInitialModal('simpleBuyModal', 'SIMPLE_BUY_MODAL', {
        amount,
        crypto,
        fiatCurrency,
        origin
      })
    )
  }

  const runLinkAccountGoal = function* (goal: GoalType) {
    const { data, id } = goal
    yield put(actions.goals.deleteGoal(id))
    yield put(
      actions.goals.addInitialModal('linkAccount', 'LINK_FROM_EXCHANGE_ACCOUNT_MODAL', data)
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
    let coinRate

    yield put(actions.goals.deleteGoal(id))
    yield put(actions.analytics.logEvent([...TRANSACTION_EVENTS.BITPAY_URL_DEEPLINK, coin]))

    if (equals('BTC', coin)) {
      yield call(getBtcBalance)
      coinRate = yield select(selectors.core.data.btc.getRates)
    } else {
      yield call(getBchBalance)
      coinRate = yield select(selectors.core.data.bch.getRates)
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
        rates: coinRate.getOrElse(null),
        value: paymentCryptoAmount
      })

      if (equals('BTC', coin)) {
        yield put(
          actions.goals.addInitialModal('payment', model.components.sendBtc.MODAL, {
            amount: {
              coin: paymentCryptoAmount,
              fiat: paymentFiatAmount
            },
            description: merchant,
            origin,
            payPro,
            to: address
          })
        )
      } else {
        yield put(
          actions.goals.addInitialModal('payment', model.components.sendBch.MODAL, {
            amount: {
              coin: paymentCryptoAmount,
              fiat: paymentFiatAmount
            },
            description: merchant,
            origin,
            payPro,
            to: address
          })
        )
      }
    } catch (e) {
      yield put(actions.alerts.displayInfo(C.BITPAY_INVOICE_NOT_FOUND_ERROR))
      yield put(
        actions.analytics.logEvent([...TRANSACTION_EVENTS.BITPAY_FAILURE, 'invoice not found'])
      )
      yield put(actions.logs.logErrorMessage(logLocation, 'runPaymentProtocolGoal', e))
    }
  }

  const runSendBtcGoal = function* (goal: GoalType) {
    const { data, id } = goal
    yield put(actions.goals.deleteGoal(id))

    yield call(getBtcBalance)

    const { address, amount, description } = data
    const currency = yield select(selectors.core.settings.getCurrency)
    const btcRates = yield select(selectors.core.data.btc.getRates)
    const fiat = Exchange.convertCoinToFiat({
      coin: 'BTC',
      currency: currency.getOrElse('USD'),
      isStandard: true,
      rates: btcRates.getOrElse(null),
      value: amount
    })
    // Goal work
    yield put(
      actions.goals.addInitialModal('payment', model.components.sendBtc.MODAL, {
        amount: { coin: amount, fiat },
        description,
        origin,
        to: address
      })
    )
  }

  const runUpgradeForAirdropGoal = function* (goal: GoalType) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    const showUpgradeForAirdropModal = yield select(
      selectors.preferences.getShowUpgradeForStxAirdropModal
    )
    if (!showUpgradeForAirdropModal) return
    yield call(waitForUserData)
    const kycNotFinished = yield call(isKycNotFinished)
    const isRegistered = (yield select(selectors.modules.profile.getBlockstackTag)).getOrElse(false)

    if (kycNotFinished && !isRegistered) {
      return yield put(
        actions.goals.addInitialModal('upgradeForAirdrop', 'UPGRADE_FOR_AIRDROP_MODAL', {
          campaign: 'BLOCKSTACK',
          origin
        })
      )
    }
  }

  const runSwapModal = function* (goal: GoalType) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    yield put(actions.goals.addInitialModal('swap', 'SWAP_MODAL', { origin }))
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
        actions.goals.addInitialModal('swapUpgrade', 'KYC_TIER_UPGRADE_MODAL', {
          currentTier: TIERS[1],
          nextTier: TIERS[2],
          origin
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
        actions.goals.addInitialModal('kycDocResubmit', 'KYC_RESUBMIT_MODAL', {
          origin
        })
      )
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

    if (firstLogin) {
      yield put(
        actions.goals.addInitialModal('welcomeModal', ModalName.WELCOME_MODAL, {
          origin
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
          actions.goals.addInitialModal('transferEth', 'TRANSFER_ETH_MODAL', {
            legacyEthAddr,
            legacyEthBalance,
            origin
          })
        )
      }
    }
  }

  const runInterestRedirect = function* (goal: GoalType) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    yield put(actions.goals.addInitialRedirect('interest'))
  }
  const runInterestPromo = function* (goal: GoalType) {
    // do not show imediately modal, wait 5 seconds
    yield delay(WAIT_FOR_INTEREST_PROMO_MODAL)
    yield call(waitForUserData)
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    const { current } = (yield select(selectors.modules.profile.getUserTiers)).getOrElse({
      current: 0
    }) || { current: 0 }

    // we show this only for tier 2 users
    if (current === TIERS[2]) {
      const currency = (yield select(selectors.core.settings.getCurrency)).getOrElse('USD')
      yield put(
        actions.components.interest.fetchShowInterestCardAfterTransaction(
          currency as WalletFiatType
        )
      )
      // make sure that fetch is done
      yield take([
        actionTypes.components.interest.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_SUCCESS,
        actionTypes.components.interest.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_FAILURE
      ])
      const afterTransactionR = yield select(selectors.components.interest.getAfterTransaction)
      const afterTransaction = afterTransactionR.getOrElse({
        show: false
      } as InterestAfterTransactionType)
      if (afterTransaction?.show) {
        yield put(actions.components.simpleBuy.fetchSBPairs(currency, afterTransaction.currency))
        yield put(
          actions.goals.addInitialModal('interestPromo', 'INTEREST_PROMO_MODAL', { origin })
        )
      }
    }
  }

  const runInitialRedirect = function* () {
    const initialRedirect = yield select(selectors.goals.getInitialRedirect)

    if (initialRedirect === 'interest') {
      return yield put(actions.router.push(`/${initialRedirect}`))
    }
  }

  const showInitialModal = function* () {
    const initialModals = yield select(selectors.goals.getInitialModals)
    const {
      airdropClaim,
      interestPromo,
      kycDocResubmit,
      linkAccount,
      payment,
      simpleBuyModal,
      swap,
      swapGetStarted,
      swapUpgrade,
      transferEth,
      upgradeForAirdrop,
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
    if (payment) {
      return yield put(actions.modals.showModal(payment.name, payment.data))
    }
    if (upgradeForAirdrop) {
      return yield put(actions.modals.showModal(upgradeForAirdrop.name, upgradeForAirdrop.data))
    }
    if (swap) {
      return yield put(actions.modals.showModal(swap.name, swap.data))
    }
    if (swapGetStarted) {
      return yield put(actions.modals.showModal(swapGetStarted.name, swapGetStarted.data))
    }
    if (swapUpgrade) {
      return yield put(actions.modals.showModal(swapUpgrade.name, swapUpgrade.data))
    }
    if (airdropClaim) {
      return yield put(
        actions.modals.showModal(airdropClaim.name, {
          origin: 'AirdropClaimGoal'
        })
      )
    }
    if (simpleBuyModal) {
      return yield put(
        actions.components.simpleBuy.showModal('SimpleBuyLink', simpleBuyModal.data.crypto)
      )
    }
    if (interestPromo) {
      return yield put(actions.modals.showModal(interestPromo.name, interestPromo.data))
    }
    if (welcomeModal) {
      const sddEligible = yield call(api.fetchSDDEligible)
      // show SDD flow for eligible country
      if (sddEligible.eligible) {
        return yield put(actions.components.simpleBuy.showModal('WelcomeModal'))
      }
      return yield put(actions.modals.showModal(welcomeModal.name, welcomeModal.data))
    }
  }

  const runGoal = function* (goal: GoalType) {
    try {
      // Ordering doesn't matter here
      // Try to keep in alphabetical ⬆️
      switch (goal.name) {
        case 'airdropClaim':
          yield call(runAirdropClaimGoal, goal)
          break
        case 'kyc':
          yield call(runKycGoal, goal)
          break
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
        case 'simpleBuy':
          yield call(runSimpleBuyGoal, goal)
          break
        case 'swap':
          yield call(runSwapModal, goal)
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
        case 'upgradeForAirdrop':
          yield call(runUpgradeForAirdropGoal, goal)
          break
        case 'welcomeModal':
          yield call(runWelcomeModal, goal)
          break
        case 'interest':
          yield call(runInterestRedirect, goal)
          break
        case 'interestPromo':
          yield call(runInterestPromo, goal)
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
    yield call(runInitialRedirect)
    yield call(showInitialModal)
  }

  return {
    defineGoals,
    runGoal,
    runGoals
  }
}
