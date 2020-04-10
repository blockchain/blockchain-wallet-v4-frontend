import * as A from './actions'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { APIType } from 'core/network/api'
import { call, put, select } from 'redux-saga/effects'
import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import {
  FiatEligibleType,
  FiatType,
  SBAccountType,
  SBOrderType,
  SBQuoteType
} from 'core/types'
import { getCoinFromPair, getFiatFromPair, NO_PAIR_SELECTED } from './model'
import { SBCheckoutFormValuesType } from './types'
import profileSagas from '../../modules/profile/sagas'

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const { createUser, waitForUserData } = profileSagas({
    api,
    coreSagas,
    networks
  })

  const isTier2 = function * () {
    yield call(waitForUserData)
    const userDataR = selectors.modules.profile.getUserData(yield select())
    const userData = userDataR.getOrElse({ tiers: { current: 0 } })
    return userData.tiers && userData.tiers.current >= 2
  }

  const cancelSBOrder = function * ({
    order
  }: ReturnType<typeof A.cancelSBOrder>) {
    try {
      const { state } = order
      const fiatCurrency = S.getFiatCurrency(yield select())
      yield put(actions.form.startSubmit('cancelSBOrderForm'))
      yield call(api.cancelSBOrder, order)
      yield put(actions.form.stopSubmit('cancelSBOrderForm'))
      yield put(A.fetchSBOrders())
      if (state === 'PENDING_CONFIRMATION' && fiatCurrency) {
        yield put(
          A.setStep({
            step: 'ENTER_AMOUNT',
            fiatCurrency
          })
        )
      } else {
        yield put(actions.modals.closeAllModals())
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('cancelSBOrderForm', { _error: error }))
    }
  }

  const createSBOrder = function * () {
    try {
      const values: SBCheckoutFormValuesType = yield select(
        selectors.form.getFormValues('simpleBuyCheckout')
      )
      const pair = values.pair
      const amount = convertStandardToBase('FIAT', values.amount)
      if (!pair) throw new Error(NO_PAIR_SELECTED)
      // TODO: Simple Buy - make dynamic
      const action = 'BUY'
      yield put(actions.form.startSubmit('simpleBuyCheckout'))
      const order: SBOrderType = yield call(
        api.createSBOrder,
        pair.pair,
        action,
        true,
        { amount, symbol: getFiatFromPair(pair.pair) },
        { symbol: getCoinFromPair(pair.pair) }
      )
      yield put(actions.form.stopSubmit('simpleBuyCheckout'))
      yield put(A.setStep({ step: 'CHECKOUT_CONFIRM', order }))
      yield put(A.fetchSBOrders())
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('simpleBuyCheckout', { _error: error }))
    }
  }

  const confirmSBOrder = function * () {
    try {
      const order = S.getSBOrder(yield select())
      if (!order) throw new Error('NO_ORDER_EXISTS_TO_CONFIRM')
      yield put(actions.form.startSubmit('sbCheckoutConfirm'))
      const confirmedOrder: SBOrderType = yield call(api.confirmSBOrder, order)
      yield put(actions.form.stopSubmit('sbCheckoutConfirm'))
      yield put(A.setStep({ step: 'TRANSFER_DETAILS', order: confirmedOrder }))
      yield put(A.fetchSBOrders())
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('sbCheckoutConfirm', { _error: error }))
    }
  }

  const fetchSBBalances = function * ({
    currency
  }: ReturnType<typeof A.fetchSBBalances>) {
    try {
      if (!(yield call(isTier2))) return

      // yield put(A.fetchSBBalancesLoading())
      const orders = yield call(api.getSBBalances, currency)
      yield put(A.fetchSBBalancesSuccess(orders))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBBalancesFailure(error))
    }
  }

  const fetchSBFiatEligible = function * ({
    currency
  }: ReturnType<typeof A.fetchSBFiatEligible>) {
    try {
      let fiatEligible: FiatEligibleType
      yield put(A.fetchSBFiatEligibleLoading())
      // If user is not tier 2 fake eligible check to allow KYC
      if (!(yield call(isTier2))) {
        fiatEligible = {
          eligible: true,
          paymentAccountEligible: true,
          simpleBuyTradingEligible: true
        }
      } else {
        fiatEligible = yield call(api.getSBFiatEligible, currency)
      }
      yield put(A.fetchSBFiatEligibleSuccess(fiatEligible))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBFiatEligibleFailure(error))
    }
  }

  const fetchSBOrders = function * () {
    try {
      if (!(yield call(isTier2))) return

      yield put(A.fetchSBOrdersLoading())
      const orders = yield call(api.getSBOrders, {})
      yield put(A.fetchSBOrdersSuccess(orders))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBOrdersFailure(error))
    }
  }

  const fetchSBPairs = function * ({
    currency
  }: ReturnType<typeof A.fetchSBPairs>) {
    try {
      yield put(A.fetchSBPairsLoading())
      yield put(actions.preferences.setSBFiatCurrency(currency))
      const { pairs } = yield call(api.getSBPairs, currency)
      yield put(A.fetchSBPairsSuccess(pairs))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBPairsFailure(error))
    }
  }

  const fetchSBPaymentAccount = function * () {
    try {
      yield put(A.fetchSBPaymentAccountLoading())
      const order = S.getSBOrder(yield select())
      const fiatCurrency: FiatType | false = order
        ? (order.pair.split('-')[1] as FiatType)
        : false
      if (!fiatCurrency) throw new Error('NO_FIAT_CURRENCY')
      const account: SBAccountType = yield call(
        api.getSBPaymentAccount,
        fiatCurrency
      )
      yield put(A.fetchSBPaymentAccountSuccess(account))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBPaymentAccountFailure(error))
    }
  }

  const fetchSBQuote = function * () {
    try {
      yield put(A.fetchSBQuoteLoading())
      const order = S.getSBOrder(yield select())
      if (!order) throw new Error('NO_ORDER')
      // TODO: Simple Buy - make dynamic
      const quote: SBQuoteType = yield call(
        api.getSBQuote,
        order.pair,
        'BUY',
        order.inputQuantity
      )
      yield put(A.fetchSBQuoteSuccess(quote))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBQuoteFailure(error))
    }
  }

  const handleSBSuggestedAmountClick = function * ({
    payload
  }: ReturnType<typeof A.handleSBSuggestedAmountClick>) {
    const { amount } = payload
    const standardAmt = convertBaseToStandard('FIAT', amount)

    yield put(actions.form.change('simpleBuyCheckout', 'amount', standardAmt))
  }

  const initializeCheckout = function * ({
    pairs,
    orderType
  }: ReturnType<typeof A.initializeCheckout>) {
    try {
      yield call(createUser)
      yield call(waitForUserData)

      const fiatCurrency = S.getFiatCurrency(yield select())
      const cryptoCurrency = S.getCryptoCurrency(yield select())
      if (!fiatCurrency) throw new Error('NO_FIAT_CURRENCY')

      yield put(A.fetchSBSuggestedAmountsLoading())
      const amounts = yield call(api.getSBSuggestedAmounts, fiatCurrency)
      yield put(A.fetchSBSuggestedAmountsSuccess(amounts))

      const pair = pairs.find(
        pair => getCoinFromPair(pair.pair) === cryptoCurrency
      )

      yield put(
        actions.form.initialize('simpleBuyCheckout', {
          pair: pair || pairs[0],
          orderType
        })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBSuggestedAmountsFailure(error))
    }
  }

  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { origin, cryptoCurrency } = payload
    yield put(
      actions.modals.showModal('SIMPLE_BUY_MODAL', { origin, cryptoCurrency })
    )
    const fiatCurrency = selectors.preferences.getSBFiatCurrency(yield select())

    if (!fiatCurrency) {
      yield put(A.setStep({ step: 'CURRENCY_SELECTION' }))
    } else {
      yield put(
        A.setStep({ step: 'ENTER_AMOUNT', cryptoCurrency, fiatCurrency })
      )
    }
  }

  return {
    cancelSBOrder,
    createSBOrder,
    confirmSBOrder,
    fetchSBBalances,
    fetchSBOrders,
    fetchSBPairs,
    fetchSBPaymentAccount,
    fetchSBQuote,
    fetchSBFiatEligible,
    handleSBSuggestedAmountClick,
    initializeCheckout,
    showModal
  }
}
