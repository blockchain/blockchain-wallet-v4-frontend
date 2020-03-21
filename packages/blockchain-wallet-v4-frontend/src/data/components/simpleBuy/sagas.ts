import * as A from './actions'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { APIType } from 'core/network/api'
import { call, put, select } from 'redux-saga/effects'
import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import { errorHandler } from '../helpers'
import { FiatEligibleType, SBAccountType, SBOrderType } from 'core/types'
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

  const createSBOrder = function * () {
    try {
      const values: SBCheckoutFormValuesType = yield select(
        selectors.form.getFormValues('simpleBuyCheckout')
      )
      const pair = values.pair
      const amount = convertStandardToBase('FIAT', values.amount)
      // TODO: Simple Buy - make dynamic
      const action = 'BUY'
      if (!pair) throw new Error(NO_PAIR_SELECTED)
      yield put(actions.form.startSubmit('simpleBuyCheckout'))
      const order: SBOrderType = yield call(
        api.createSBOrder,
        pair.pair,
        action,
        { amount, symbol: getFiatFromPair(pair) },
        { symbol: getCoinFromPair(pair) }
      )
      yield put(actions.form.stopSubmit('simpleBuyCheckout'))
      yield put(A.setStep({ step: 'ORDER_DETAILS', order }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('simpleBuyCheckout', { _error: error }))
    }
  }

  const fetchSBFiatEligible = function * ({
    currency
  }: ReturnType<typeof A.fetchSBFiatEligible>) {
    try {
      yield put(A.fetchSBFiatEligibleLoading())
      const fiatEligible: FiatEligibleType = yield call(
        api.getSBFiatEligible,
        currency
      )
      yield put(A.fetchSBFiatEligibleSuccess(fiatEligible))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBFiatEligibleFailure(error))
    }
  }

  const fetchSBOrders = function * () {
    try {
      yield put(A.fetchSBOrdersLoading())
      const { pairs } = yield call(api.getSBOrders, {})
      yield put(A.fetchSBOrdersSuccess(pairs))
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
      const fiatCurrency = S.getFiatCurrency(yield select())
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

  const handleSBSuggestedAmountClick = function * ({
    payload
  }: ReturnType<typeof A.handleSBSuggestedAmountClick>) {
    const { amount } = payload
    const standardAmt = convertBaseToStandard('FIAT', amount)

    yield put(actions.form.change('simpleBuyCheckout', 'amount', standardAmt))
  }

  const initializeCheckout = function * ({
    pairs
  }: ReturnType<typeof A.initializeCheckout>) {
    try {
      yield call(createUser)
      yield call(waitForUserData)

      const fiatCurrency = S.getFiatCurrency(yield select())
      if (!fiatCurrency) throw new Error('NO_FIAT_CURRENCY')
      yield put(actions.preferences.setSBFiatCurrency(fiatCurrency))

      yield put(A.fetchSBSuggestedAmountsLoading())
      const amounts = yield call(api.getSBSuggestedAmounts, fiatCurrency)
      yield put(A.fetchSBSuggestedAmountsSuccess(amounts))
      yield put(
        actions.form.initialize('simpleBuyCheckout', { pair: pairs[0] })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBSuggestedAmountsFailure(error))
    }
  }

  const showModal = function * () {
    yield put(actions.modals.showModal('SIMPLE_BUY_MODAL'))
    const fiatCurrency = selectors.preferences.getSBFiatCurrency(yield select())

    if (!fiatCurrency) {
      yield put(A.setStep({ step: 'CURRENCY_SELECTION' }))
    } else {
      yield put(A.setStep({ step: 'ENTER_AMOUNT', fiatCurrency }))
    }
  }

  return {
    createSBOrder,
    fetchSBOrders,
    fetchSBPairs,
    fetchSBPaymentAccount,
    fetchSBFiatEligible,
    handleSBSuggestedAmountClick,
    initializeCheckout,
    showModal
  }
}
