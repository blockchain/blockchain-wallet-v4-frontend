import { call, delay, put, select } from 'redux-saga/effects'
import { initialize } from 'redux-form'
import { nth } from 'ramda'
import BigNumber from 'bignumber.js'

import { actions, selectors } from 'data'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { APIType } from 'core/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { Exchange } from 'blockchain-wallet-v4/src'
import { InterestTransactionResponseType } from 'core/types'
import { promptForSecondPassword } from 'services/SagaService'

import * as A from './actions'
import * as S from './selectors'

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const fetchInterestBalance = function * () {
    try {
      yield put(A.fetchInterestBalanceLoading())
      const response: ReturnType<
        typeof api.getInterestAccountBalance
      > = yield call(api.getInterestAccountBalance)
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
      const response: ReturnType<
        typeof api.getInterestInstruments
      > = yield call(api.getInterestInstruments)
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
      const response: ReturnType<
        typeof api.getInterestSavingsRate
      > = yield call(api.getInterestSavingsRate)
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

  const initializeDepositForm = function * ({
    payload
  }: ReturnType<typeof A.initializeDepositForm>) {
    let defaultAccountR

    yield call(fetchInterestLimits)

    switch (payload.coin) {
      case 'BTC':
        const accountsR = yield select(
          selectors.core.common.btc.getAccountsBalances
        )
        const defaultIndex = yield select(
          selectors.core.wallet.getDefaultAccountIndex
        )
        defaultAccountR = accountsR.map(nth(defaultIndex))
        break
      default:
        break
    }
    const initialValues = {
      interestDepositAccount: defaultAccountR.getOrElse()
    }

    yield put(initialize('interestDepositForm', initialValues))
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
    const COIN = 'BTC'
    try {
      yield put(actions.form.startSubmit(FORM))
      // get deposit address
      yield call(fetchInterestAccount, COIN)
      const depositAddress = yield select(S.getDepositAddress)
      // get user currency
      const userCurrency = (yield select(
        selectors.core.settings.getCurrency
      )).getOrFail('Failed to get user currency')
      // get form values
      const formValues = yield select(selectors.form.getFormValues(FORM))
      // get btc rates
      const btcRates = (yield select(
        selectors.core.data.btc.getRates
      )).getOrFail('Failed to get BTC rates.')
      // convert deposit fiat amount to sats
      const depositAmountSats = Exchange.convertFiatToBtc({
        value: parseFloat(formValues.depositAmount),
        fromCurrency: userCurrency,
        toUnit: 'SAT',
        rates: btcRates
      }).value
      // ask for second password
      const password = yield call(promptForSecondPassword)
      // build and publish payment to network
      const payment = (yield coreSagas.payment.btc
        .create({ network: networks.btc })
        .chain()
        .init()
        .from(formValues.interestDepositAccount.index, ADDRESS_TYPES.ACCOUNT)
        .to(depositAddress, ADDRESS_TYPES.ADDRESS)
        .amount(new BigNumber(depositAmountSats).toNumber())
        .fee('priority')
        .build()
        .sign(password)
        .publish()
        .done()).value()
      // notify success
      yield put(actions.form.stopSubmit(FORM))
      yield put(
        A.setInterestStep('ACCOUNT_SUMMARY', {
          sendSuccess: true,
          depositTxHash: payment.txId
        })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(FORM, { _error: error }))
      yield put(
        A.setInterestStep('ACCOUNT_SUMMARY', { sendSuccess: false, error })
      )
    }
  }

  const showInterestModal = function * ({
    payload
  }: ReturnType<typeof A.showInterestModal>) {
    yield put(A.setInterestStep(payload.step))
    yield put(actions.modals.showModal('INTEREST_MODAL'))
  }

  return {
    fetchInterestBalance,
    fetchInterestEligible,
    fetchInterestInstruments,
    fetchInterestLimits,
    fetchInterestAccount,
    fetchInterestRate,
    fetchInterestTransactions,
    initializeDepositForm,
    routeToTxHash,
    sendDeposit,
    showInterestModal
  }
}
