import { equals, map, prop, startsWith, sum, values } from 'ramda'
import { all, call, join, put, select, spawn, take } from 'redux-saga/effects'
import base64 from 'base-64'
import bip21 from 'bip21'

import { actions, model, selectors } from 'data'
import { Exchange } from 'blockchain-wallet-v4/src'
import * as C from 'services/AlertService'
import { getBtcBalance, getAllBalances } from 'data/balance/sagas'

export default ({ api }) => {
  const { TIERS, KYC_STATES } = model.profile
  const { NONE } = KYC_STATES

  const logLocation = 'goals/sagas'

  const defineReferralGoal = function*(search) {
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

  const defineSendBtcGoal = function*(pathname, search) {
    // Special case to handle bitcoin bip21 link integration
    const decodedPayload = decodeURIComponent(pathname + search)
    const bip21Payload = bip21.decode(decodedPayload)
    const { address } = bip21Payload
    const { amount, message } = bip21Payload.options || {}
    const data = { address, amount, description: message }
    yield put(actions.goals.saveGoal('payment', data))
    yield put(actions.router.push('/wallet'))
    yield put(actions.alerts.displayInfo(C.PLEASE_LOGIN))
  }

  const defineActionGoal = function*(pathname, search) {
    // Other scenarios with actions encoded in base64
    const decoded = JSON.parse(base64.decode(pathname + search))
    if (!prop('name', decoded) || !prop('data', decoded)) return
    const { name, data } = decoded
    yield put(actions.goals.saveGoal(name, data))
    yield put(actions.router.push('/wallet'))
  }

  const defineDeepLinkGoals = function*(pathname, search) {
    if (startsWith('referral', pathname))
      return yield call(defineReferralGoal, search)
    if (startsWith('bitcoin', pathname))
      return yield call(defineSendBtcGoal, pathname, search)
    yield call(defineActionGoal, pathname, search)
  }

  const defineGoals = function*() {
    const search = yield select(selectors.router.getSearch)
    const pathname = yield select(selectors.router.getPathname)
    yield take('@@router/LOCATION_CHANGE')
    const deepLink = prop(1, pathname.match('/open/(.*)'))
    if (deepLink) yield call(defineDeepLinkGoals, deepLink, search)
  }

  const runSendBtcGoal = function*(goal) {
    const { id, data } = goal
    yield put(actions.goals.deleteGoal(id))

    yield call(getBtcBalance)

    const { amount, address, description } = data
    const currency = yield select(selectors.core.settings.getCurrency)
    const btcRates = yield select(selectors.core.data.bitcoin.getRates)
    const fiat = Exchange.convertBitcoinToFiat({
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

  const runReferralGoal = function*(goal) {
    const { id, data } = goal
    yield put(actions.goals.deleteGoal(id))

    switch (data.name) {
      case 'sunriver':
        yield put(actions.goals.addInitialModal('sunriver', 'SunRiverWelcome'))
        yield put(actions.modules.profile.setCampaign(data))
        break
      default:
        break
    }
  }

  const runSwapUpgradeGoal = function*(goal) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    const showSwapUpgrade = yield select(
      selectors.preferences.getShowSwapUpgrade
    )
    if (!showSwapUpgrade) return
    const closeToTier1Limit = (yield select(
      selectors.modules.profile.closeToTier1Limit
    )).getOrElse(false)
    if (closeToTier1Limit)
      return yield put(
        actions.goals.addInitialModal('swapUpgrade', 'SwapUpgrade', {
          nextTier: TIERS[2],
          currentTier: TIERS[1]
        })
      )
  }

  const runKycGoal = function*(goal) {
    const { id } = goal
    yield put(actions.goals.deleteGoal(id))

    // check if user has already seen kyc modal
    const showKycGetStarted = yield select(
      selectors.preferences.getShowKycGetStarted
    )
    if (!showKycGetStarted) return
    // check/wait for balances to be available
    const balances = yield call(getAllBalances)
    const isFunded = sum(values(balances)) !== 0
    const kycNotFinished = (yield select(
      selectors.modules.profile.getUserKYCState
    ))
      .map(equals(NONE))
      .getOrElse(false)
    if (isFunded && kycNotFinished)
      yield put(actions.goals.addInitialModal('swap', 'SwapGetStarted'))
  }

  const runWelcomeGoal = function*(goal) {
    const { id, data } = goal
    yield put(actions.goals.deleteGoal(id))

    const { firstLogin } = data
    if (firstLogin) {
      const walletNUsers = yield call(api.getWalletNUsers)
      const walletMillions = Math.floor(
        walletNUsers.values[walletNUsers.values.length - 1].y / 1e6
      )
      yield put(
        actions.goals.addInitialModal('welcome', 'Welcome', { walletMillions })
      )
    } else {
      yield put(
        actions.logs.logInfoMessage(
          logLocation,
          'runWelcomeGoal',
          'login success'
        )
      )
      yield put(actions.alerts.displaySuccess(C.LOGIN_SUCCESS))
    }
  }

  const showInitialModal = function*() {
    const initialModals = yield select(selectors.goals.getInitialModals)
    const { sunriver, payment, swap, swapUpgrade, welcome } = initialModals
    if (sunriver)
      return yield put(actions.modals.showModal(sunriver.name, sunriver.data))
    if (payment)
      return yield put(actions.modals.showModal(payment.name, payment.data))
    if (swap) return yield put(actions.modals.showModal(swap.name, swap.data))
    if (swapUpgrade)
      return yield put(
        actions.modals.showModal(swapUpgrade.name, swapUpgrade.data)
      )
    if (welcome)
      return yield put(actions.modals.showModal(welcome.name, welcome.data))
  }

  const runGoal = function*(goal) {
    try {
      switch (goal.name) {
        case 'payment':
          yield call(runSendBtcGoal, goal)
          break
        case 'referral':
          yield call(runReferralGoal, goal)
          break
        case 'welcome':
          yield call(runWelcomeGoal, goal)
          break
        case 'swapUpgrade':
          yield call(runSwapUpgradeGoal, goal)
          break
        case 'kyc':
          yield call(runKycGoal, goal)
          break
      }
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'runGoal', error))
    }
  }

  const runGoals = function*() {
    const goals = yield select(selectors.goals.getGoals)
    const goalTasks = yield all(map(goal => spawn(runGoal, goal), goals))
    yield all(map(join, goalTasks))
    yield call(showInitialModal)
  }

  return {
    defineActionGoal,
    defineSendBtcGoal,
    defineReferralGoal,
    defineDeepLinkGoals,
    defineGoals,
    runGoal,
    runGoals,
    runKycGoal,
    runSwapUpgradeGoal,
    runWelcomeGoal,
    runReferralGoal,
    runSendBtcGoal,
    showInitialModal
  }
}
