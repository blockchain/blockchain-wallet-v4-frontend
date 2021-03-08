import base64 from 'base-64'
import BigNumber from 'bignumber.js'
import bip21 from 'bip21'
import { Exchange, utils } from 'blockchain-wallet-v4/src'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import {
  anyPass,
  equals,
  includes,
  map,
  path,
  pathOr,
  prop,
  startsWith,
  sum,
  values
} from 'ramda'
import {
  all,
  call,
  delay,
  join,
  put,
  select,
  spawn,
  take
} from 'redux-saga/effects'

import { actions, model, selectors } from 'data'
import {
  getBchBalance,
  getBtcBalance,
  getXlmBalance,
  waitForAllBalances
} from 'data/balance/sagas'
import { parsePaymentRequest } from 'data/bitpay/sagas'
import profileSagas from 'data/modules/profile/sagas'
import * as C from 'services/alerts'
import { GoalsType } from './types'

const { TRANSACTION_EVENTS } = model.analytics

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

  const isKycNotFinished = function * () {
    yield call(waitForUserData)
    return (yield select(selectors.modules.profile.getUserKYCState))
      .map(equals(NONE))
      .getOrElse(false)
  }

  const defineLinkAccountGoal = function * (search) {
    const params = new URLSearchParams(search)
    yield put(
      actions.goals.saveGoal('linkAccount', {
        linkId: params.get('link_id')
      })
    )
    yield delay(3000)
  }

  const defineReferralGoal = function * (search) {
    const params = new URLSearchParams(search)
    yield put(
      actions.goals.saveGoal('referral', {
        name: params.get('campaign'),
        code: params.get('campaign_code'),
        email: params.get('campaign_email')
      })
    )
    const destination = params.get('newUser') ? '/signup' : '/login'
    yield put(actions.router.push(destination))
  }

  const defineKycGoal = function * (search) {
    const params = new URLSearchParams(search)
    yield put(actions.goals.saveGoal('kyc', { tier: params.get('tier') }))
    yield put(actions.router.push('/login'))
  }

  const defineSendXlmGoal = function * (pathname, search) {
    // /#/open/xlm?address={address}&amount={amount}
    const params = new URLSearchParams(search)
    const address = params.get('address')
    const amount = params.get('amount')
    const memo = params.get('memo')

    yield put(actions.goals.saveGoal('xlmPayment', { address, amount, memo }))
    yield put(actions.router.push('/wallet'))
    yield put(actions.alerts.displayInfo(C.PLEASE_LOGIN))
  }

  const defineSimpleBuyGoal = function * (search) {
    // /#/open/simple-buy?crypto={crypto}&amount={amount}&email={email}
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

    yield put(actions.router.push('/signup'))
  }

  const defineSendCryptoGoal = function * (pathname, search) {
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
      // TODO: BCH payments?
      const { address } = bip21Payload
      const { amount, message } = bip21Payload.options || {}
      const data = { address, amount, description: message }
      yield put(actions.goals.saveGoal('payment', data))
      yield put(actions.router.push('/wallet'))
      yield put(actions.alerts.displayInfo(C.PLEASE_LOGIN))
    }
  }

  const defineLogLevel = function * (search) {
    const params = new URLSearchParams(search)
    const level = params.get('level')
    // @ts-ignore
    window.logLevel = level
    yield put(actions.logs.setLogLevel(level))
  }

  const defineActionGoal = function * (pathname, search) {
    try {
      // Other scenarios with actions encoded in base64
      const decoded = JSON.parse(base64.decode(pathname + search))
      if (!prop('name', decoded) || !prop('data', decoded)) return
      const { data, name } = decoded
      yield put(actions.goals.saveGoal(name, data))
      yield put(actions.router.push('/wallet'))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'decodeGoal',
          pathname + search
        )
      )
    }
  }

  const defineDeepLinkGoals = function * (pathname, search) {
    if (startsWith('xlm', pathname))
      return yield call(defineSendXlmGoal, pathname, search)
    if (startsWith('link-account', pathname))
      return yield call(defineLinkAccountGoal, search)
    if (startsWith('referral', pathname))
      return yield call(defineReferralGoal, search)
    if (startsWith('kyc', pathname)) return yield call(defineKycGoal, search)
    // crypto send / bitpay links
    if (includes('bitcoin', pathname))
      return yield call(defineSendCryptoGoal, pathname, search)
    if (startsWith('log-level', pathname))
      return yield call(defineLogLevel, search)
    // simple-buy widget
    if (startsWith('simple-buy', pathname))
      return yield call(defineSimpleBuyGoal, search)
    yield call(defineActionGoal, pathname, search)
  }

  const defineGoals = function * () {
    const search = yield select(selectors.router.getSearch)
    const pathname = yield select(selectors.router.getPathname)
    yield take('@@router/LOCATION_CHANGE')
    const deepLink = prop(1, pathname.match('/open/(.*)'))
    if (deepLink) yield call(defineDeepLinkGoals, deepLink, search)
  }

  const runAirdropClaimGoal = function * (goal) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    const showAirdropClaimModal = yield select(
      selectors.preferences.getShowAirdropClaimModal
    )
    if (!showAirdropClaimModal) return

    yield call(waitForUserData)
    const { current } = (yield select(
      selectors.modules.profile.getUserTiers
    )).getOrElse({ current: 0 }) || { current: 0 }
    const blockstackTag = (yield select(
      selectors.modules.profile.getBlockstackTag
    )).getOrElse(false)
    if (current === TIERS[2] && !blockstackTag) {
      yield put(actions.goals.addInitialModal('airdropClaim', 'AirdropClaim'))
    }
  }

  const runKycGoal = function * (goal) {
    try {
      const { data, id } = goal
      const { tier = TIERS[2] } = data
      yield put(actions.goals.deleteGoal(id))
      yield call(waitForUserData)
      const { current } = (yield select(
        selectors.modules.profile.getUserTiers
      )).getOrElse({ current: 0 }) || { current: 0 }
      if (current >= Number(tier)) return
      yield put(
        actions.components.identityVerification.verifyIdentity(tier, false)
      )
    } catch (err) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'runKycGoal', err.message)
      )
    }
  }

  const runSimpleBuyGoal = function * (goal) {
    const {
      data: { amount, crypto, fiatCurrency }
    } = goal

    yield put(
      actions.goals.addInitialModal('simpleBuyModal', 'SIMPLE_BUY_MODAL', {
        amount,
        crypto,
        fiatCurrency
      })
    )
  }

  const runLinkAccountGoal = function * (goal) {
    const { data, id } = goal
    yield put(actions.goals.deleteGoal(id))
    yield put(
      actions.goals.addInitialModal(
        'linkAccount',
        'LinkFromExchangeAccount',
        data
      )
    )
  }

  const runReferralGoal = function * (goal) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    // use this for future airdrop referrals
  }

  const runPaymentProtocolGoal = function * (goal) {
    const { data, id } = goal
    const { coin, r } = data
    let coinRate, paymentCryptoAmount, paymentFiatAmount

    yield put(actions.goals.deleteGoal(id))
    yield put(
      actions.analytics.logEvent([
        ...TRANSACTION_EVENTS.BITPAY_URL_DEEPLINK,
        coin
      ])
    )

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
      const rawPaymentRequest = yield call(
        api.getRawPaymentRequest,
        invoiceId,
        coin
      )
      const paymentRequest = yield call(parsePaymentRequest, rawPaymentRequest)
      const { instructions } = paymentRequest

      if (new Date() > new Date(paymentRequest.expires)) {
        return yield put(
          actions.modals.showModal('BitPayInvoiceExpired', {
            origin: 'PaymentProtocolGoal'
          })
        )
      }

      const tx = path([0, 'outputs', 0], instructions)
      // @ts-ignore
      const satoshiAmount = tx.amount
      // @ts-ignore
      const address = tx.address
      const merchant = paymentRequest.memo.split('for merchant ')[1]
      const payPro = {
        expiration: paymentRequest.expires,
        paymentUrl: r,
        merchant
      }

      if (equals('BTC', coin)) {
        paymentCryptoAmount = Exchange.convertBtcToBtc({
          value: satoshiAmount,
          fromUnit: 'SAT',
          toUnit: 'BTC'
        }).value
        paymentFiatAmount = Exchange.convertBtcToFiat({
          value: paymentCryptoAmount,
          fromUnit: 'BTC',
          toCurrency: currency.getOrElse(null),
          rates: coinRate.getOrElse(null)
        }).value
        yield put(
          actions.goals.addInitialModal(
            'payment',
            model.components.sendBtc.MODAL,
            {
              to: address,
              amount: {
                coin: paymentCryptoAmount,
                fiat: paymentFiatAmount
              },
              description: merchant,
              payPro
            }
          )
        )
      } else {
        paymentCryptoAmount = Exchange.convertBchToBch({
          value: satoshiAmount,
          fromUnit: 'SAT',
          toUnit: 'BCH'
        }).value
        paymentFiatAmount = Exchange.convertBchToFiat({
          value: paymentCryptoAmount,
          fromUnit: 'BCH',
          toCurrency: currency.getOrElse(null),
          rates: coinRate.getOrElse(null)
        }).value
        yield put(
          actions.goals.addInitialModal(
            'payment',
            model.components.sendBch.MODAL,
            {
              to: address,
              amount: {
                coin: paymentCryptoAmount,
                fiat: paymentFiatAmount
              },
              description: merchant,
              payPro
            }
          )
        )
      }
    } catch (e) {
      yield put(actions.alerts.displayInfo(C.BITPAY_INVOICE_NOT_FOUND_ERROR))
      yield put(
        actions.analytics.logEvent([
          ...TRANSACTION_EVENTS.BITPAY_FAILURE,
          'invoice not found'
        ])
      )
      yield put(
        actions.logs.logErrorMessage(logLocation, 'runPaymentProtocolGoal', e)
      )
    }
  }

  const runSendBtcGoal = function * (goal) {
    const { data, id } = goal
    yield put(actions.goals.deleteGoal(id))

    yield call(getBtcBalance)

    const { address, amount, description } = data
    const currency = yield select(selectors.core.settings.getCurrency)
    const btcRates = yield select(selectors.core.data.btc.getRates)
    const fiat = Exchange.convertBtcToFiat({
      value: amount,
      fromUnit: 'BTC',
      toCurrency: currency.getOrElse(null),
      rates: btcRates.getOrElse(null)
    }).value
    // Goal work
    yield put(
      actions.goals.addInitialModal('payment', model.components.sendBtc.MODAL, {
        to: address,
        description,
        amount: { coin: amount, fiat }
      })
    )
  }

  const runSendXlmGoal = function * (goal) {
    const { data, id } = goal
    yield put(actions.goals.deleteGoal(id))

    yield call(getXlmBalance)

    const { address, amount, memo } = data
    const currency = yield select(selectors.core.settings.getCurrency)
    const xlmRates = yield select(selectors.core.data.xlm.getRates)
    const fiat = Exchange.convertXlmToFiat({
      value: amount,
      fromUnit: 'XLM',
      toCurrency: currency.getOrElse(null),
      rates: xlmRates.getOrElse(null)
    }).value
    // Goal work
    yield put(
      actions.goals.addInitialModal(
        'xlmPayment',
        model.components.sendXlm.MODAL,
        {
          to: address,
          amount: { coin: amount, fiat },
          memo
        }
      )
    )
  }

  const runUpgradeForAirdropGoal = function * (goal) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    const showUpgradeForAirdropModal = yield select(
      selectors.preferences.getShowUpgradeForStxAirdropModal
    )
    if (!showUpgradeForAirdropModal) return
    yield call(waitForUserData)
    const kycNotFinished = yield call(isKycNotFinished)
    const isRegistered = (yield select(
      selectors.modules.profile.getBlockstackTag
    )).getOrElse(false)

    if (kycNotFinished && !isRegistered) {
      return yield put(
        actions.goals.addInitialModal(
          'upgradeForAirdrop',
          'UpgradeForAirdrop',
          {
            campaign: 'BLOCKSTACK'
          }
        )
      )
    }
  }

  const runSwapUpgradeGoal = function * (goal) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    const showSwapUpgrade = yield select(
      selectors.preferences.getShowSwapUpgrade
    )
    if (!showSwapUpgrade) return
    yield call(waitForUserData)
    const closeToTier1Limit = (yield select(
      selectors.modules.profile.closeToTier1Limit
    )).getOrElse(false)
    if (closeToTier1Limit)
      return yield put(
        actions.goals.addInitialModal('swapUpgrade', 'KycTierUpgrade', {
          nextTier: TIERS[2],
          currentTier: TIERS[1]
        })
      )
  }

  const runKycDocResubmitGoal = function * (goal) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    yield call(waitForUserData)
    // check if user needs to resubmit docs
    const showKycDocResubmitModal = (yield select(
      selectors.modules.profile.getKycDocResubmissionStatus
    ))
      .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
      .getOrElse(false)

    if (showKycDocResubmitModal) {
      yield put(
        actions.goals.addInitialModal('kycDocResubmit', 'KycDocResubmit')
      )
    }
  }

  const runSwapGetStartedGoal = function * (goal) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    // check if user has already seen kyc modal
    const showKycGetStarted = yield select(
      selectors.preferences.getShowKycGetStarted
    )
    if (!showKycGetStarted) return
    // check/wait for balances to be available
    const balances = yield call(waitForAllBalances)
    const isFunded = sum(values(balances)) !== 0
    if (!isFunded) return
    yield call(waitForUserData)
    const kycNotFinished = yield call(isKycNotFinished)
    if (kycNotFinished)
      yield put(
        actions.goals.addInitialModal('swapGetStarted', 'SwapGetStarted')
      )
  }

  const runSyncPitGoal = function * (goal) {
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
      yield put(
        actions.logs.logErrorMessage('goals', 'runSyncToPitGoal', error)
      )
    }
  }

  const runWelcomeModal = function * (goal) {
    const { data, id } = goal
    const { firstLogin } = data
    yield put(actions.goals.deleteGoal(id))

    if (firstLogin) {
      yield put(actions.goals.addInitialModal('welcomeModal', 'WELCOME_MODAL'))
    }
  }

  const runTransferEthGoal = function * (goal) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))
    const legacyAccountR = yield select(
      selectors.core.kvStore.eth.getLegacyAccount
    )
    const legacyAccount = legacyAccountR.getOrElse(null)
    if (!legacyAccount) return

    const { addr: legacyEthAddr, correct } = legacyAccount
    const fees = yield call(api.getEthFees)
    const feeAmount = yield call(
      utils.eth.calculateFee,
      fees.regular,
      fees.gasLimit,
      true
    )
    // if not swept, get the legacy eth account balance and prompt sweep
    if (!correct && legacyEthAddr) {
      const ethBalances = yield call(api.getEthBalances, legacyEthAddr)
      const legacyEthBalance =
        path<string>([legacyEthAddr, 'balance'], ethBalances) || 0
      const legacyEthBalanceBigInt = new BigNumber(legacyEthBalance)
      const feeAmountBigInt = new BigNumber(feeAmount)
      if (legacyEthBalanceBigInt.isGreaterThan(feeAmountBigInt)) {
        yield put(
          actions.goals.addInitialModal('transferEth', 'TransferEth', {
            legacyEthBalance,
            legacyEthAddr
          })
        )
      }
    }
  }

  const showInitialModal = function * () {
    const initialModals = yield select(selectors.goals.getInitialModals)
    const {
      airdropClaim,
      kycDocResubmit,
      linkAccount,
      payment,
      simpleBuyModal,
      swapGetStarted,
      swapUpgrade,
      transferEth,
      upgradeForAirdrop,
      welcomeModal,
      xlmPayment
    } = initialModals

    // Order matters here
    if (linkAccount) {
      return yield put(
        actions.modals.showModal(linkAccount.name, linkAccount.data)
      )
    }
    if (transferEth) {
      return yield put(
        actions.modals.showModal(transferEth.name, transferEth.data)
      )
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
    if (xlmPayment) {
      return yield put(
        actions.modals.showModal(xlmPayment.name, xlmPayment.data)
      )
    }
    if (upgradeForAirdrop) {
      return yield put(
        actions.modals.showModal(upgradeForAirdrop.name, upgradeForAirdrop.data)
      )
    }
    if (swapGetStarted) {
      return yield put(
        actions.modals.showModal(swapGetStarted.name, swapGetStarted.data)
      )
    }
    if (swapUpgrade) {
      return yield put(
        actions.modals.showModal(swapUpgrade.name, swapUpgrade.data)
      )
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
        actions.components.simpleBuy.showModal(
          'SimpleBuyLink',
          simpleBuyModal.data.crypto
        )
      )
    }
    if (welcomeModal) {
      yield put(actions.modals.showModal(welcomeModal.name, welcomeModal.data))
    }
  }

  const runGoal = function * (goal: { data: any; id: string; name: GoalsType }) {
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
        case 'swapGetStarted':
          yield call(runSwapGetStartedGoal, goal)
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
        case 'xlmPayment':
          yield call(runSendXlmGoal, goal)
          break
        case 'welcomeModal':
          yield call(runWelcomeModal, goal)
          break
      }
      yield put(actions.goals.initialModalDisplayed)
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'runGoal', error))
    }
  }

  const runGoals = function * () {
    const goals = yield select(selectors.goals.getGoals)
    const goalTasks = yield all(map(goal => spawn(runGoal, goal), goals))
    yield all(map(join, goalTasks))
    yield call(showInitialModal)
  }

  return {
    defineGoals,
    runGoal,
    runGoals
  }
}
