import { call, delay, put, select, take } from 'redux-saga/effects'
import { FormAction, initialize } from 'redux-form'
import { nth } from 'ramda'
import BigNumber from 'bignumber.js'

import { actions, model, selectors } from 'data'
import { APIType } from 'core/network/api'
import { convertStandardToBase } from '../exchange/services'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import {
  InterestTransactionResponseType,
  PaymentType,
  PaymentValue
} from 'core/types'

import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import { DEFAULT_INTEREST_BALANCE } from './model'
import { InterestDepositFormType } from './types'
import exchangeSagaUtils from '../exchange/sagas.utils'
import profileSagas from '../../modules/profile/sagas'
import utils from './sagas.utils'

const { INTEREST_EVENTS } = model.analytics

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const calculateProvisionalPayment = exchangeSagaUtils({ coreSagas, networks })
    .calculateProvisionalPayment
  const { isTier2 } = profileSagas({ api, coreSagas, networks })
  const {
    buildAndPublishPayment,
    createLimits,
    createPayment,
    paymentGetOrElse
  } = utils({
    coreSagas,
    networks
  })

  const fetchInterestBalance = function * () {
    try {
      yield put(A.fetchInterestBalanceLoading())
      if (!(yield call(isTier2)))
        return yield put(
          A.fetchInterestBalanceSuccess(DEFAULT_INTEREST_BALANCE)
        )
      const response: ReturnType<typeof api.getInterestAccountBalance> = yield call(
        api.getInterestAccountBalance
      )
      yield put(A.fetchInterestBalanceSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestBalanceFailure(error))
    }
  }
  const fetchInterestEligible = function * () {
    try {
      yield put(A.fetchInterestEligibleLoading())
      const response: ReturnType<typeof api.getInterestEligible> = yield call(
        api.getInterestEligible
      )
      yield put(A.fetchInterestEligibleSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestEligibleFailure(error))
    }
  }

  const fetchInterestInstruments = function * () {
    try {
      yield put(A.fetchInterestInstrumentsLoading())
      const response: ReturnType<typeof api.getInterestInstruments> = yield call(
        api.getInterestInstruments
      )
      yield put(A.fetchInterestInstrumentsSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestInstrumentsFailure(error))
    }
  }

  const fetchInterestLimits = function * () {
    try {
      yield put(A.fetchInterestLimitsLoading())
      const response: ReturnType<typeof api.getInterestLimits> = yield call(
        api.getInterestLimits
      )
      yield put(A.fetchInterestLimitsSuccess(response.limits))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestLimitsFailure(error))
    }
  }

  const fetchInterestAccount = function * (coin) {
    try {
      yield put(A.fetchInterestAccountLoading())
      const paymentAccount = yield call(api.getInterestAccount, coin)
      yield put(A.fetchInterestAccountSuccess(paymentAccount))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestAccountFailure(error))
    }
  }

  const fetchInterestRate = function * () {
    try {
      yield put(A.fetchInterestRateLoading())
      const response: ReturnType<typeof api.getInterestSavingsRate> = yield call(
        api.getInterestSavingsRate
      )
      yield put(A.fetchInterestRateSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestRateFailure(error))
    }
  }

  const fetchInterestTransactions = function * () {
    try {
      yield put(A.fetchInterestTransactionsLoading())
      const transactions: InterestTransactionResponseType = yield call(
        api.getInterestTransactions
      )
      yield put(A.fetchInterestTransactionsSuccess(transactions))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestTransactionsFailure(error))
    }
  }

  const formChanged = function * (action: FormAction) {
    const form = action.meta.form
    if (form !== 'interestDepositForm') return

    const coin = S.getCoinType(yield select())
    const ratesR = S.getRates(yield select())
    const userCurrency = (yield select(
      selectors.core.settings.getCurrency
    )).getOrFail('Failed to get user currency')
    const rates = ratesR.getOrElse({})
    const rate = rates[userCurrency].last
    const paymentR = S.getPayment(yield select())
    let payment = paymentGetOrElse(coin, paymentR)
    const values: InterestDepositFormType = yield select(
      selectors.form.getFormValues('interestDepositForm')
    )

    switch (action.meta.field) {
      case 'depositAmount':
        const value = new BigNumber(action.payload).dividedBy(rate).toNumber()
        let provisionalPayment: PaymentValue = yield call(
          calculateProvisionalPayment,
          {
            ...values.interestDepositAccount,
            address: values.interestDepositAccount.index
          },
          value
        )
        yield put(A.setPaymentSuccess(provisionalPayment))
        break
      case 'interestDepositAccount':
        yield put(A.setPaymentLoading())
        payment = yield call(createPayment, action.payload.index)
        yield call(createLimits, payment)
        yield put(A.setPaymentSuccess(payment.value()))
    }
  }

  const initializeDepositForm = function * ({
    payload
  }: ReturnType<typeof A.initializeDepositForm>) {
    let defaultAccountR
    let payment: PaymentType = <PaymentType>{}

    yield put(A.setPaymentLoading())
    yield put(A.fetchInterestLimits())
    yield take([
      AT.FETCH_INTEREST_LIMITS_SUCCESS,
      AT.FETCH_INTEREST_LIMITS_FAILURE
    ])

    switch (payload.coin) {
      case 'BTC':
        const accountsR = yield select(
          selectors.core.common.btc.getAccountsBalances
        )
        const defaultIndex = yield select(
          selectors.core.wallet.getDefaultAccountIndex
        )
        defaultAccountR = accountsR.map(nth(defaultIndex))
        payment = yield call(createPayment, defaultIndex)
        break
      default:
        break
    }

    yield call(createLimits, payment)
    yield put(A.setPaymentSuccess(payment.value()))
    yield put(
      initialize('interestDepositForm', {
        interestDepositAccount: defaultAccountR.getOrElse()
      })
    )
  }

  const initializeWithdrawalForm = function * ({
    // eslint-disable-next-line
    payload
  }: ReturnType<typeof A.initializeWithdrawalForm>) {
    try {
      // TODO: fetch available to withdrawal balance
      yield put(initialize('interestWithdrawalForm', {})) // init form for analytics
    } catch (e) {
      // TODO?
    }
  }

  const routeToTxHash = function * ({
    payload
  }: ReturnType<typeof A.routeToTxHash>) {
    const { coin, txHash } = payload
    yield put(actions.router.push(`/${coin}/transactions`))
    yield delay(1000)
    yield put(actions.form.change('walletTxSearch', 'search', txHash))
  }

  const sendDeposit = function * () {
    const FORM = 'interestDepositForm'
    try {
      yield put(actions.form.startSubmit(FORM))

      const coin = S.getCoinType(yield select())
      yield call(fetchInterestAccount, coin)
      const depositAddress = yield select(S.getDepositAddress)
      const paymentR = S.getPayment(yield select())
      let payment = paymentGetOrElse(coin, paymentR)

      // build and publish payment to network
      yield call(buildAndPublishPayment, coin, payment, depositAddress)
      // notify success
      yield put(actions.form.stopSubmit(FORM))
      yield put(A.setInterestStep('ACCOUNT_SUMMARY', { depositSuccess: true }))
      yield put(
        actions.analytics.logEvent(INTEREST_EVENTS.DEPOSIT.SEND_SUCCESS)
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(FORM, { _error: error }))
      yield put(
        A.setInterestStep('ACCOUNT_SUMMARY', { depositSuccess: false, error })
      )
      yield put(
        actions.analytics.logEvent(INTEREST_EVENTS.DEPOSIT.SEND_FAILURE)
      )
    }
  }

  const requestWithdrawal = function * ({
    payload
  }: ReturnType<typeof A.requestWithdrawal>) {
    const { coin, withdrawalAmountCrypto } = payload
    const FORM = 'interestWithdrawalForm'
    try {
      yield put(actions.form.startSubmit(FORM))
      yield delay(3000)
      const withdrawalAmountSats = convertStandardToBase(
        coin,
        withdrawalAmountCrypto
      )
      const receiveAddress = selectors.core.common.btc
        .getNextAvailableReceiveAddress(
          networks.btc,
          yield select(selectors.core.wallet.getDefaultAccountIndex),
          yield select()
        )
        .getOrFail('Failed to get BTC receive address')
      // initiate withdrawal request
      yield call(
        api.initiateInterestWithdrawal,
        Number(withdrawalAmountSats),
        coin,
        receiveAddress
      )
      // notify success
      yield put(actions.form.stopSubmit(FORM))
      yield put(A.setInterestStep('ACCOUNT_SUMMARY', { withdrawSuccess: true }))
      yield put(
        actions.analytics.logEvent(INTEREST_EVENTS.WITHDRAWAL.REQUEST_SUCCESS)
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(FORM, { _error: error }))
      yield put(
        A.setInterestStep('ACCOUNT_SUMMARY', { withdrawSuccess: false, error })
      )
      yield put(
        actions.analytics.logEvent(INTEREST_EVENTS.WITHDRAWAL.REQUEST_FAILURE)
      )
    }
  }

  const showInterestModal = function * ({
    payload
  }: ReturnType<typeof A.showInterestModal>) {
    yield put(A.setInterestStep(payload.step))
    yield put(
      actions.modals.showModal('INTEREST_MODAL', { origin: 'InterestPage' })
    )
  }

  return {
    fetchInterestBalance,
    fetchInterestEligible,
    fetchInterestInstruments,
    fetchInterestLimits,
    fetchInterestAccount,
    fetchInterestRate,
    fetchInterestTransactions,
    formChanged,
    initializeDepositForm,
    initializeWithdrawalForm,
    requestWithdrawal,
    routeToTxHash,
    sendDeposit,
    showInterestModal
  }
}
