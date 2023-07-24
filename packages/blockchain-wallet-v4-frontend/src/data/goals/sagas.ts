import base64 from 'base-64'
import BigNumber from 'bignumber.js'
import bip21 from 'bip21'
import * as lz from 'lz-string'
import { anyPass, equals, includes, map, path, pathOr, prop, startsWith } from 'ramda'
import { all, call, delay, join, put, select, spawn, take } from 'redux-saga/effects'

import { Exchange, utils } from '@core'
import {
  EarnAfterTransactionType,
  RatesType,
  TermsAndConditionType,
  WalletFiatType
} from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, actionTypes, model, selectors } from 'data'
import { getBchBalance, getBtcBalance } from 'data/balances/sagas'
import { parsePaymentRequest } from 'data/bitpay/sagas'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { ModalName } from 'data/modals/types'
import profileSagas from 'data/modules/profile/sagas'
import { ProductEligibilityForUser } from 'data/types'
import * as C from 'services/alerts'

import { WAIT_FOR_INTEREST_PROMO_MODAL } from './model'
import { DeepLinkGoal, GeneralRedirectType, GoalType, UnifiedAccountRedirectType } from './types'

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
    return selectors.modules.profile
      .getUserKYCState(yield select())
      .map(equals(NONE))
      .getOrElse(false)
  }

  // TODO: use new world deeplinking once merged
  const defineExchangeSettingsGoal = function* (search) {
    const params = new URLSearchParams(search)
    const guid = params.get('guid')
    const settingsChange = params.get('change')
    const email = decodeURIComponent(params.get('email') as string)
    yield put(actions.cache.removeStoredLogin())
    // after clearing cache in case previous wallet is
    // not the same one for exchange settings
    // repopulate cache
    yield put(actions.cache.guidStored(guid))
    yield put(actions.cache.exchangeWalletGuid(guid))
    yield put(actions.cache.exchangeEmail(email))
    yield put(actions.cache.emailStored(email))
    yield put(actions.cache.setUnifiedAccount(true))
    yield put(
      actions.goals.saveGoal({
        data: {
          email,
          guid,
          settingsChange
        },
        name: 'settings'
      })
    )
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

  const defineKycGoal = function* (search) {
    // /#/open/kyc?tier={1, 2, ...}
    const params = new URLSearchParams(search)

    const tier = params.get('tier') || TIERS[2]

    yield put(actions.goals.saveGoal({ data: { tier }, name: 'kyc' }))
  }

  const defineMakeOfferNftGoal = function* (search) {
    // /#/open/make-offer-nft?contract_address=0x123&token_id=456
    const params = new URLSearchParams(search)

    const contract_address = params.get('contract_address')
    const token_id = params.get('token_id')

    yield put(
      actions.goals.saveGoal({
        data: { contract_address, token_id },
        name: DeepLinkGoal.MAKE_OFFER_NFT
      })
    )
  }

  const defineBuyNftGoal = function* (search) {
    // /#/open/buy-nft?contract_address=0x123&token_id=456&order={order}
    const params = new URLSearchParams(search)

    const contract_address = params.get('contract_address')
    const token_id = params.get('token_id')
    const order = JSON.parse(lz.decompressFromEncodedURIComponent(params.get('order')))

    yield put(
      actions.goals.saveGoal({
        data: { contract_address, order, token_id },
        name: DeepLinkGoal.BUY_NFT
      })
    )
  }

  const defineDeeplinkNftsGoal = function* (pathname) {
    yield put(
      actions.goals.saveGoal({
        data: { pathname },
        name: DeepLinkGoal.NFTS
      })
    )
  }

  const defineDeeplinkDexGoal = function* (pathname) {
    yield put(
      actions.goals.saveGoal({
        data: { pathname },
        name: DeepLinkGoal.NFTS
      })
    )
  }

  const defineSwapGoal = function* () {
    yield put(actions.goals.saveGoal({ data: {}, name: 'swap' }))
  }

  const defineInterestGoal = function* () {
    yield put(actions.goals.saveGoal({ data: {}, name: 'interest' }))
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
      // because of react router 'isFirstRendering' check
      // push to /signup won't be saved on state, app
      // will reroute to /login, skipping buy goal

      // waiting for the firstRender of app before pushing
      // route to signup
      yield take(actionTypes.router.LOCATION_CHANGE)
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
      yield put(actions.goals.saveGoal({ data, name }))
      yield put(actions.router.push('/wallet'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'decodeGoal', pathname + search))
    }
  }

  const defineSignupGoal = function* (email) {
    // // ?showWallet&email=someone@blockchain.com

    yield put(
      actions.goals.saveGoal({
        data: { email },
        name: 'signup'
      })
    )
  }

  const defineDeepLinkGoals = function* (pathname, search) {
    if (startsWith(DeepLinkGoal.MAKE_OFFER_NFT, pathname)) {
      return yield call(defineMakeOfferNftGoal, search)
    }

    if (startsWith(DeepLinkGoal.BUY_NFT, pathname)) {
      return yield call(defineBuyNftGoal, search)
    }

    if (startsWith(DeepLinkGoal.NFTS, pathname)) {
      return yield call(defineDeeplinkNftsGoal, pathname)
    }

    if (startsWith(DeepLinkGoal.DEX, pathname)) {
      return yield call(defineDeeplinkDexGoal, pathname)
    }

    // exchange deeplink to change password /#/open/change-password
    if (startsWith(DeepLinkGoal.SETTINGS, pathname)) {
      return yield call(defineExchangeSettingsGoal, search)
    }
    // /#/open/kyc?tier={0 | 1 | 2 | ...} tier is optional
    if (startsWith(DeepLinkGoal.KYC, pathname)) {
      return yield call(defineKycGoal, search)
    }

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
      return yield call(defineBuySellGoal, search)
    }

    // /#/open/swap
    if (startsWith(DeepLinkGoal.SWAP, pathname)) {
      return yield call(defineSwapGoal)
    }

    // /#/open/earn /#/open/rewards /#/open/interest
    if (
      startsWith(DeepLinkGoal.EARN, pathname) ||
      startsWith(DeepLinkGoal.REWARDS, pathname) ||
      startsWith(DeepLinkGoal.INTEREST, pathname)
    ) {
      return yield call(defineInterestGoal)
    }

    if (startsWith(DeepLinkGoal.LINK_ACCOUNT, pathname)) {
      return yield call(defineLinkAccountGoal, search)
    }

    // /#/open/referral
    if (startsWith(DeepLinkGoal.REFERRAL, pathname)) {
      return yield call(defineReferralGoal, search)
    }

    yield call(defineActionGoal, pathname, search)
  }

  const defineSignUpLinkGoals = function* (search) {
    const params = new URLSearchParams(search)

    const email = params.get('email')
    if (email && email !== '') {
      yield call(defineSignupGoal, email)
    }
  }

  const defineGoals = function* () {
    const search = yield select(selectors.router.getSearch)
    const pathname = yield select(selectors.router.getPathname)
    const deepLink = prop(1, pathname.match('/open/(.*)'))
    if (deepLink) yield call(defineDeepLinkGoals, deepLink, search)
    const signUpLink = prop(0, pathname.match('/signup'))
    if (signUpLink) yield call(defineSignUpLinkGoals, search)
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
        actions.goals.addInitialModal({
          data: {
            origin
          },
          key: 'airdropClaim',
          name: 'AIRDROP_CLAIM_MODAL'
        })
      )
    }
  }

  // TODO: use new world deeplinking once merged
  const runSettingsDeeplinkRedirect = function* (goal: GoalType) {
    const { data, id } = goal
    const { settingsChange } = data
    yield put(actions.goals.deleteGoal(id))
    switch (settingsChange) {
      case 'password':
        yield put(actions.goals.addInitialRedirect(UnifiedAccountRedirectType.CHANGE_PASSWORD))
        break
      case 'email':
        yield put(actions.goals.addInitialRedirect(UnifiedAccountRedirectType.CHANGE_EMAIL))
        break
      case '2fa':
        yield put(actions.goals.addInitialRedirect(UnifiedAccountRedirectType.CHANGE_2FA))
        break
      default:
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

  const runCowboys2022Goal = function* (goal: GoalType) {
    const {
      data: { id }
    } = goal
    const { firstLogin } = goal.data
    yield put(actions.goals.deleteGoal(id))

    if (!firstLogin) return

    yield put(
      actions.goals.addInitialModal({
        data: {
          origin,
          step: 'signup'
        },
        key: 'cowboys2022',
        name: ModalName.COWBOYS_PROMO
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

  const runReferralGoal = function* (goal: GoalType) {
    yield delay(WAIT_FOR_INTEREST_PROMO_MODAL)
    yield call(waitForUserData)
    const { data, id } = goal
    yield put(actions.goals.deleteGoal(id))
    yield put(
      actions.goals.addInitialModal({
        data,
        key: 'referralLanding',
        name: ModalName.REFERRAL_LANDING_MODAL
      })
    )
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
          actions.modals.showModal(ModalName.BITPAY_INVOICE_EXPIRED_MODAL, {
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
        actions.goals.addInitialModal({
          data: {
            campaign: 'BLOCKSTACK',
            origin
          },
          key: 'upgradeForAirdrop',
          name: 'UPGRADE_FOR_AIRDROP_MODAL'
        })
      )
    }
  }

  const runSwapModal = function* (goal: GoalType) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    yield put(actions.goals.addInitialModal({ data: { origin }, key: 'swap', name: 'SWAP_MODAL' }))
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
    const kycState = (yield select(selectors.modules.profile.getUserKYCState)).getOrElse(
      KYC_STATES.NONE
    )
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
    const isAccountReset: boolean = yield select(selectors.signup.getAccountReset)
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

  const runMakeOfferNftGoal = function* (goal: GoalType) {
    yield take(actions.auth.loginSuccess)
    yield put(
      actions.router.push(`/nfts/assets/${goal.data.contract_address}/${goal.data.token_id}`)
    )
    yield put(
      actions.components.nfts.nftOrderFlowOpen({
        asset_contract_address: goal.data.contract_address,
        step: NftOrderStepEnum.MAKE_OFFER,
        token_id: goal.data.token_id
      })
    )
  }

  const runBuyNftGoal = function* (goal: GoalType) {
    yield take(actions.auth.loginSuccess)
    yield put(
      actions.router.push(`/nfts/assets/${goal.data.contract_address}/${goal.data.token_id}`)
    )
    yield put(
      actions.components.nfts.nftOrderFlowOpen({
        asset_contract_address: goal.data.contract_address,
        seaportOrder: goal.data.order,
        step: NftOrderStepEnum.BUY,
        token_id: goal.data.token_id
      })
    )
  }

  const runDeeplinkNftGoal = function* (goal: GoalType) {
    yield take(actions.auth.loginSuccess)
    yield put(actions.router.push(`/${goal.data.pathname}`))
  }

  const runDeeplinkDexGoal = function* (goal: GoalType) {
    yield take(actions.auth.loginSuccess)
    yield put(actions.router.push(`/${goal.data.pathname}`))
  }

  const runInterestRedirect = function* (goal: GoalType) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    yield put(actions.goals.addInitialRedirect(GeneralRedirectType.EARN))
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
      } as EarnAfterTransactionType)
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

  const runSignupGoal = function* (goal: GoalType) {
    const {
      data: { id }
    } = goal
    yield put(actions.goals.deleteGoal(id))
  }

  const runInitialRedirect = function* () {
    const initialRedirect = yield select(selectors.goals.getInitialRedirect)

    if (initialRedirect === GeneralRedirectType.EARN) {
      return yield put(actions.router.push(`/earn`))
    }
    if (
      initialRedirect === UnifiedAccountRedirectType.CHANGE_EMAIL ||
      initialRedirect === UnifiedAccountRedirectType.CHANGE_2FA
    ) {
      return yield put(actions.router.push(`/security-center/basic`))
    }
    if (initialRedirect === UnifiedAccountRedirectType.CHANGE_PASSWORD) {
      return yield put(actions.router.push(`/security-center/advanced`))
    }
  }

  const showInitialModal = function* () {
    const initialModals = yield select(selectors.goals.getInitialModals)
    const {
      airdropClaim,
      buySellModal,
      cowboys2022,
      interestPromo,
      kycDocResubmit,
      kycUpgradeRequiredNotice,
      linkAccount,
      payment,
      referralLanding,
      sanctionsNotice,
      swap,
      swapGetStarted,
      swapUpgrade,
      termsAndConditions,
      transferEth,
      upgradeForAirdrop,
      welcomeModal
    } = initialModals

    // Order matters here
    if (cowboys2022) {
      const hasCowboysTag = selectors.modules.profile.getCowboysTag(yield select()).getOrElse(false)
      if (hasCowboysTag) {
        return yield put(actions.modals.showModal(cowboys2022.name, cowboys2022.data))
      }
    }
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
    if (kycUpgradeRequiredNotice) {
      return yield put(
        actions.modals.showModal(kycUpgradeRequiredNotice.name, kycUpgradeRequiredNotice.data)
      )
    }
    if (sanctionsNotice) {
      return yield put(actions.modals.showModal(sanctionsNotice.name, sanctionsNotice.data))
    }
    if (termsAndConditions) {
      return yield put(actions.modals.showModal(termsAndConditions.name, termsAndConditions.data))
    }
    if (referralLanding) {
      return yield put(actions.modals.showModal(referralLanding.name, referralLanding.data))
    }
    if (airdropClaim) {
      return yield put(
        actions.modals.showModal(airdropClaim.name, {
          origin: 'AirdropClaimGoal'
        })
      )
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
      const showCompleteYourProfile = selectors.core.walletOptions
        .getCompleteYourProfile(yield select())
        .getOrElse(null)
      if (showCompleteYourProfile) {
        return yield put(
          actions.modals.showModal(ModalName.COMPLETE_USER_PROFILE, welcomeModal.data)
        )
      }
      return yield put(actions.modals.showModal(welcomeModal.name, welcomeModal.data))
    }
  }

  const runKycUpgradeRequiredNoticeGoal = function* (goal: GoalType) {
    yield delay(WAIT_FOR_INTEREST_PROMO_MODAL)
    yield call(waitForUserData)
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    const { current } = (yield select(selectors.modules.profile.getUserTiers)).getOrElse({
      current: 0
    }) || { current: 0 }
    const kycState = (yield select(selectors.modules.profile.getUserKYCState)).getOrElse(
      KYC_STATES.NONE
    )
    // If the user is tagged with the COWBOYS_2022 promo tag don't show them the typical verify notice modal
    const hasCowboysTag = selectors.modules.profile.getCowboysTag(yield select()).getOrElse(false)

    yield put(actions.custodial.fetchProductEligibilityForUser())
    yield take([
      actions.custodial.fetchProductEligibilityForUserSuccess.type,
      actions.custodial.fetchProductEligibilityForUserFailure.type
    ])

    const products = selectors.custodial.getProductEligibilityForUser(yield select()).getOrElse({
      kycVerification: { enabled: false }
    } as ProductEligibilityForUser)

    if (
      current < 2 &&
      !hasCowboysTag &&
      products?.kycVerification?.enabled &&
      kycState !== KYC_STATES.REJECTED
    ) {
      yield put(
        actions.goals.addInitialModal({
          data: { origin },
          key: 'kycUpgradeRequiredNotice',
          name: ModalName.VERIFY_NOTICE_MODAL
        })
      )
    }
  }

  const runSanctionsNoticeGoal = function* (goal: GoalType) {
    yield delay(WAIT_FOR_INTEREST_PROMO_MODAL)
    yield call(waitForUserData)
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    yield put(actions.custodial.fetchProductEligibilityForUser())
    yield take([
      actions.custodial.fetchProductEligibilityForUserSuccess.type,
      actions.custodial.fetchProductEligibilityForUserFailure.type
    ])

    const products = selectors.custodial.getProductEligibilityForUser(yield select()).getOrElse({
      notifications: []
    } as ProductEligibilityForUser)

    if (products?.notifications?.length > 0) {
      yield put(
        actions.goals.addInitialModal({
          data: { origin },
          key: 'sanctionsNotice',
          name: ModalName.SANCTIONS_INFO_MODAL
        })
      )
    }
  }

  const runTermsAndConditionsGoal = function* (goal: GoalType) {
    yield delay(WAIT_FOR_INTEREST_PROMO_MODAL)
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
          name: ModalName.TERMS_AND_CONDITIONS_MODAL
        })
      )
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
        case 'buy-nft':
          yield call(runBuyNftGoal, goal)
          break
        case 'buySell':
          yield call(runBuySellGoal, goal)
          break
        case 'cowboys2022':
          yield call(runCowboys2022Goal, goal)
          break
        case 'dex':
          yield call(runDeeplinkDexGoal, goal)
          break
        case 'kyc':
          yield call(runKycGoal, goal)
          break
        case 'kycDocResubmit':
          yield call(runKycDocResubmitGoal, goal)
          break
        case 'kycUpgradeRequiredNotice':
          yield call(runKycUpgradeRequiredNoticeGoal, goal)
          break
        case 'interest':
          yield call(runInterestRedirect, goal)
          break
        case 'interestPromo':
          yield call(runInterestPromo, goal)
          break
        case 'linkAccount':
          yield call(runLinkAccountGoal, goal)
          break
        case 'make-offer-nft':
          yield call(runMakeOfferNftGoal, goal)
          break
        case 'nfts':
          yield call(runDeeplinkNftGoal, goal)
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
        case 'rewards':
          yield call(runInterestRedirect, goal)
          break
        case 'sanctionsNotice':
          yield call(runSanctionsNoticeGoal, goal)
          break
        case 'settings':
          yield call(runSettingsDeeplinkRedirect, goal)
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
        case 'termsAndConditions':
          yield call(runTermsAndConditionsGoal, goal)
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
        case 'signup':
          yield call(runSignupGoal, goal)
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
    yield put(actions.goals.saveGoal({ data: {}, name: 'termsAndConditions' }))
    // only for existing users
    if (!firstLogin) {
      yield put(actions.goals.saveGoal({ data: {}, name: 'kycUpgradeRequiredNotice' }))
      yield put(actions.goals.saveGoal({ data: {}, name: 'sanctionsNotice' }))
    }
    // when airdrops are running
    // yield put(actions.goals.saveGoal('upgradeForAirdrop'))
    // yield put(actions.goals.saveGoal('airdropClaim'))
  }

  // watch for /open/nft calls and run the goals
  const routerChanged = function* (action) {
    if (action?.payload?.location?.pathname?.includes('open')) {
      yield call(defineGoals)
      yield call(runGoals)
    }
  }

  return {
    defineGoals,
    routerChanged,
    runGoal,
    runGoals,
    saveGoals
  }
}
