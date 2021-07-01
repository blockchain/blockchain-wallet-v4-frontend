import BigNumber from 'bignumber.js'
import { concat, isEmpty, isNil, last, prop } from 'ramda'
import { FormAction, initialize } from 'redux-form'
import { call, delay, put, select, take } from 'redux-saga/effects'

import { Remote } from 'blockchain-wallet-v4/src'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import {
  AccountTypes,
  CoinType,
  InterestAfterTransactionType,
  PaymentValue,
  RatesType,
  RemoteDataType,
  SBBalancesType
} from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { actions, actionTypes, model, selectors } from 'data'
import coinSagas from 'data/coins/sagas'
import { generateProvisionalPaymentAmount } from 'data/coins/utils'

import profileSagas from '../../modules/profile/sagas'
import { convertStandardToBase } from '../exchange/services'
import * as A from './actions'
import * as AT from './actionTypes'
import { DEFAULT_INTEREST_BALANCES } from './model'
import utils from './sagas.utils'
import * as S from './selectors'
import { InterestDepositFormType, InterestWithdrawalFormType } from './types'

const { INTEREST_EVENTS } = model.analytics
const DEPOSIT_FORM = 'interestDepositForm'
const WITHDRAWAL_FORM = 'interestWithdrawalForm'

export const logLocation = 'components/interest/sagas'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const { isTier2 } = profileSagas({ api, coreSagas, networks })
  const { buildAndPublishPayment, createLimits, createPayment, getCustodialAccountForCoin } = utils(
    {
      coreSagas,
      networks
    }
  )

  const {
    getDefaultAccountForCoin,
    getNextReceiveAddressForCoin,
    getOrUpdateProvisionalPaymentForCoin
  } = coinSagas({
    coreSagas,
    networks
  })

  const getAccountIndexOrAccount = (coin: CoinType, account: AccountTypes) => {
    if (coin === 'BTC' || coin === 'BCH') {
      return account.index
    }
    return account.address
  }

  const fetchInterestBalance = function* () {
    try {
      yield put(A.fetchInterestBalanceLoading())
      if (!(yield call(isTier2))) {
        yield put(A.fetchInterestBalanceSuccess(DEFAULT_INTEREST_BALANCES))
        return
      }
      const response: ReturnType<typeof api.getInterestAccountBalance> = yield call(
        api.getInterestAccountBalance
      )
      yield put(A.fetchInterestBalanceSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestBalanceFailure(error))
    }
  }

  const fetchInterestEligible = function* () {
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

  const fetchInterestInstruments = function* () {
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

  const fetchInterestLimits = function* ({
    coin,
    currency
  }: ReturnType<typeof A.fetchInterestLimits>) {
    try {
      yield put(A.fetchInterestLimitsLoading())
      const response: ReturnType<typeof api.getInterestLimits> = yield call(
        api.getInterestLimits,
        coin,
        currency
      )
      yield put(A.fetchInterestLimitsSuccess(response.limits))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestLimitsFailure(error))
    }
  }

  const fetchInterestAccount = function* ({ coin }: ReturnType<typeof A.fetchInterestAccount>) {
    try {
      yield put(A.fetchInterestAccountLoading())
      const paymentAccount: ReturnType<typeof api.getInterestAccount> = yield call(
        api.getInterestAccount,
        coin as CoinType
      )
      yield put(A.fetchInterestAccountSuccess(paymentAccount))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestAccountFailure(error))
    }
  }

  const fetchInterestRate = function* () {
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
  const fetchInterestTransactionsReport = function* () {
    const reportHeaders = [['Date', 'Type', 'Asset', 'Amount', 'Tx Hash']]
    const formatTxData = (d) => [d.insertedAt, d.type, d.amount?.symbol, d.amount?.value, d.txHash]
    let txList = []
    let hasNext = true
    let nextPageUrl
    const { coin } = yield select(selectors.form.getFormValues('interestHistoryCoin'))
    yield put(A.fetchInterestTransactionsReportLoading())
    try {
      while (hasNext) {
        const { items, next } = yield call(
          api.getInterestTransactions,
          coin === 'ALL' ? undefined : coin,
          nextPageUrl
        )
        txList = concat(txList, items.map(formatTxData))
        hasNext = next
        nextPageUrl = next
      }
      const report = concat(reportHeaders, txList)
      yield put(A.fetchInterestTransactionsReportSuccess(report))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestTransactionsReportFailure(error))
    }
  }
  const fetchInterestTransactions = function* ({
    payload
  }: ReturnType<typeof A.fetchInterestTransactions>) {
    const { coin, reset } = payload

    try {
      const nextPage = !reset ? yield select(S.getTransactionsNextPage) : undefined
      // check if invoked from continuous scroll
      if (!reset) {
        const txList = yield select(S.getInterestTransactions)
        // return if next page is already being fetched or there is no next page
        if (Remote.Loading.is(last(txList)) || !nextPage) return
      }
      yield put(A.fetchInterestTransactionsLoading(reset))
      const response = yield call(api.getInterestTransactions, coin, nextPage)
      yield put(A.fetchInterestTransactionsSuccess(response.items, reset))
      yield put(A.setTransactionsNextPage(response.next))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestTransactionsFailure(error))
    }
  }

  const formChanged = function* (action: FormAction) {
    const { form } = action.meta
    if (form !== DEPOSIT_FORM) return

    try {
      const formValues: InterestDepositFormType = yield select(
        selectors.form.getFormValues(DEPOSIT_FORM)
      )
      const coin = S.getCoinType(yield select())
      const ratesR = S.getRates(yield select())
      const userCurrency = (yield select(selectors.core.settings.getCurrency)).getOrFail(
        'Failed to get user currency'
      )
      const rates = ratesR.getOrElse({} as RatesType)
      const rate = rates[userCurrency].last
      const isDisplayed = S.getCoinDisplay(yield select())
      const isCustodialDeposit = prop('type', formValues.interestDepositAccount) === 'CUSTODIAL'
      const accountBalance = prop('balance', formValues.interestDepositAccount)
      switch (action.meta.field) {
        case 'depositAmount':
          const value = isDisplayed
            ? new BigNumber(action.payload).toNumber()
            : new BigNumber(action.payload).dividedBy(rate).toNumber()
          const paymentR = S.getPayment(yield select())
          if (paymentR) {
            let payment = yield getOrUpdateProvisionalPaymentForCoin(coin, paymentR)
            const paymentAmount = generateProvisionalPaymentAmount(coin, value)
            payment = yield payment.amount(paymentAmount)
            if (!isCustodialDeposit && accountBalance > 0) {
              payment = yield payment.build()
              yield put(A.setPaymentSuccess(payment.value()))
            } else {
              yield put(A.setPaymentSuccess(payment.value()))
            }
          }
          break
        case 'interestDepositAccount':
          let custodialBalances: SBBalancesType | undefined

          yield put(A.setPaymentLoading())
          yield put(actions.form.change(DEPOSIT_FORM, 'depositAmount', undefined))
          yield put(actions.form.focus(DEPOSIT_FORM, 'depositAmount'))

          if (isCustodialDeposit) {
            custodialBalances = (yield select(
              selectors.components.simpleBuy.getSBBalances
            )).getOrFail('Failed to get balance')
          }

          const depositPayment: PaymentValue = yield call(createPayment, {
            ...formValues.interestDepositAccount,
            address: getAccountIndexOrAccount(coin, formValues.interestDepositAccount)
          })

          yield call(createLimits, depositPayment, custodialBalances)
          yield put(A.setPaymentSuccess(depositPayment))
          break
        default:
        // do nothing
      }
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const handleTransferMaxAmountClick = function* ({
    payload: { amount }
  }: ReturnType<typeof A.handleTransferMaxAmountClick>) {
    yield put(actions.form.change('interestDepositForm', 'depositAmount', amount))
  }

  const handleTransferMinAmountClick = function* ({
    payload: { amount }
  }: ReturnType<typeof A.handleTransferMinAmountClick>) {
    yield put(actions.form.change('interestDepositForm', 'depositAmount', amount))
  }

  const initializeDepositForm = function* ({
    payload
  }: ReturnType<typeof A.initializeDepositForm>) {
    const { coin, currency } = payload

    const isFromBuySell = S.getIsFromBuySell(yield select())
    try {
      if (isFromBuySell) {
        // re-fetch the custodial balances to ensure we have the latest for proper form initialization
        yield put(actions.components.simpleBuy.fetchSBBalances(undefined, true))
        // wait until balances are loaded super important to have deep equal object on form
        yield take([
          actionTypes.components.simpleBuy.FETCH_SB_BALANCES_SUCCESS,
          actionTypes.components.simpleBuy.FETCH_SB_BALANCES_FAILURE
        ])
      }
      // non-custodial deposit
      // fetch deposit address to build provisional payment
      yield put(A.fetchInterestAccount(coin))
      yield take([
        AT.FETCH_INTEREST_PAYMENT_ACCOUNT_SUCCESS,
        AT.FETCH_INTEREST_PAYMENT_ACCOUNT_FAILURE
      ])
      const depositAddr = yield select(S.getDepositAddress)
      // abort if deposit address missing
      if (isEmpty(depositAddr) || isNil(depositAddr)) {
        throw new Error('Missing deposit address')
      }
      const depositAddress = depositAddr.split(':')[0]
      yield put(A.setPaymentLoading())
      yield put(A.fetchInterestLimits(coin, currency))
      yield take([AT.FETCH_INTEREST_LIMITS_SUCCESS, AT.FETCH_INTEREST_LIMITS_FAILURE])

      const defaultAccount = isFromBuySell
        ? yield call(getCustodialAccountForCoin, coin)
        : yield call(getDefaultAccountForCoin, coin)

      const payment: PaymentValue = yield call(createPayment, {
        ...defaultAccount,
        address: getAccountIndexOrAccount(coin, defaultAccount)
      })

      let newPayment = yield getOrUpdateProvisionalPaymentForCoin(coin, Remote.of(payment))

      newPayment = yield newPayment.to(depositAddress, 'ADDRESS')
      newPayment = yield newPayment.value()
      const custodialBalances = isFromBuySell
        ? (yield select(selectors.components.simpleBuy.getSBBalances)).getOrFail(
            'Failed to get balance'
          )
        : null

      yield call(createLimits, newPayment, custodialBalances)
      yield put(A.setPaymentSuccess(newPayment))
      let additionalParameters = {}
      if (isFromBuySell) {
        yield put(A.setCoinDisplay(true))
        const afterTransactionR = yield select(selectors.components.interest.getAfterTransaction)
        const afterTransaction = afterTransactionR.getOrElse({
          show: false
        } as InterestAfterTransactionType)
        additionalParameters = {
          depositAmount: afterTransaction.amount || 0
        }

        // update payment since initial one was with 0
        const value = new BigNumber(afterTransaction.amount).toNumber()
        const paymentR = S.getPayment(yield select())
        if (paymentR) {
          let payment = yield getOrUpdateProvisionalPaymentForCoin(coin, paymentR)
          const paymentAmount = generateProvisionalPaymentAmount(coin, value)
          payment = yield payment.amount(paymentAmount)
          yield put(A.setPaymentSuccess(payment.value()))
        }
        yield put(actions.modals.closeModal('SIMPLE_BUY_MODAL'))
      }
      yield put(
        initialize(DEPOSIT_FORM, {
          coin,
          currency,
          interestDepositAccount: defaultAccount,
          ...additionalParameters
        })
      )
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const initializeWithdrawalForm = function* ({
    payload
  }: ReturnType<typeof A.initializeWithdrawalForm>) {
    const { coin, walletCurrency } = payload
    try {
      yield put(A.setWithdrawalMinimumsLoading())
      const response: ReturnType<typeof api.getWithdrawalMinsAndFees> = yield call(
        api.getWithdrawalMinsAndFees
      )
      const defaultAccount = yield call(getDefaultAccountForCoin, coin)
      yield put(
        initialize(WITHDRAWAL_FORM, {
          coin,
          currency: walletCurrency,
          interestWithdrawalAccount: defaultAccount
        })
      )
      yield put(A.setWithdrawalMinimumsSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.setWithdrawalMinimumsFailure(error))
    }
  }

  const routeToTxHash = function* ({ payload }: ReturnType<typeof A.routeToTxHash>) {
    const { coin, txHash } = payload
    if (coin === 'PAX') {
      yield put(actions.router.push(`/usd-d/transactions`))
    } else {
      yield put(actions.router.push(`/${coin}/transactions`))
    }
    yield delay(1000)
    yield put(actions.form.change('walletTxSearch', 'search', txHash))
  }

  const sendDeposit = function* () {
    try {
      yield put(actions.form.startSubmit(DEPOSIT_FORM))
      const formValues: InterestDepositFormType = yield select(
        selectors.form.getFormValues(DEPOSIT_FORM)
      )
      const isCustodialDeposit = prop('type', formValues.interestDepositAccount) === 'CUSTODIAL'
      const coin = S.getCoinType(yield select())
      const paymentR = S.getPayment(yield select())
      const payment = yield getOrUpdateProvisionalPaymentForCoin(
        coin,
        paymentR as RemoteDataType<string, any>
      )

      if (isCustodialDeposit) {
        const { amount } = payment.value()
        if (amount === null || amount === undefined) {
          throw Error('Deposit amount unknown')
        }
        // BTC/BCH amounts from payments are returned as objects
        const amountString = typeof amount === 'object' ? amount[0].toString() : amount.toString()

        // custodial deposit
        yield call(api.initiateCustodialTransfer, {
          amount: amountString as string,
          currency: coin,
          destination: 'SAVINGS',
          origin: 'SIMPLEBUY'
        })
      } else {
        // non-custodial deposit
        // fetch deposit address
        yield put(A.fetchInterestAccount(coin))
        yield take([
          AT.FETCH_INTEREST_PAYMENT_ACCOUNT_SUCCESS,
          AT.FETCH_INTEREST_PAYMENT_ACCOUNT_FAILURE
        ])
        const depositAddress = yield select(S.getDepositAddress)

        // abort if deposit address missing
        if (isEmpty(depositAddress) || isNil(depositAddress)) {
          throw new Error('Missing deposit address')
        }

        // build and publish payment to network
        const transaction = yield call(buildAndPublishPayment, coin, payment, depositAddress)
        // notify backend of incoming non-custodial deposit
        yield put(
          actions.components.send.notifyNonCustodialToCustodialTransfer(
            { ...transaction, fromType: 'ADDRESS' },
            'SAVINGS'
          )
        )
      }

      // notify UI of success
      yield put(actions.form.stopSubmit(DEPOSIT_FORM))
      yield put(A.setInterestStep('ACCOUNT_SUMMARY', { depositSuccess: true }))
      yield put(actions.analytics.logEvent(INTEREST_EVENTS.DEPOSIT.SEND_SUCCESS))

      const afterTransactionR = yield select(selectors.components.interest.getAfterTransaction)
      const afterTransaction = afterTransactionR.getOrElse({
        show: false
      } as InterestAfterTransactionType)
      if (afterTransaction?.show) {
        yield put(actions.analytics.logEvent(INTEREST_EVENTS.DEPOSIT.SEND_ONE_CLICK))
        yield put(actions.components.interest.resetShowInterestCardAfterTransaction())
      }

      yield delay(3000)
      yield put(A.fetchInterestBalance())
      yield put(A.fetchEDDStatus())
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(DEPOSIT_FORM, { _error: error }))
      yield put(
        A.setInterestStep('ACCOUNT_SUMMARY', {
          depositSuccess: false,
          error
        })
      )
      yield put(actions.analytics.logEvent(INTEREST_EVENTS.DEPOSIT.SEND_FAILURE))
    }
  }

  const requestWithdrawal = function* ({ payload }: ReturnType<typeof A.requestWithdrawal>) {
    const { coin, withdrawalAmount } = payload
    try {
      yield put(actions.form.startSubmit(WITHDRAWAL_FORM))

      const formValues: InterestWithdrawalFormType = yield select(
        selectors.form.getFormValues(WITHDRAWAL_FORM)
      )
      const isCustodialWithdrawal =
        prop('type', formValues.interestWithdrawalAccount) === 'CUSTODIAL'
      const withdrawalAmountBase = convertStandardToBase(coin, withdrawalAmount)

      if (isCustodialWithdrawal) {
        yield call(api.initiateCustodialTransfer, {
          amount: withdrawalAmountBase,
          currency: coin,
          destination: 'SIMPLEBUY',
          origin: 'SAVINGS'
        })
      } else {
        const receiveAddress = yield call(getNextReceiveAddressForCoin, coin)
        yield call(api.initiateInterestWithdrawal, withdrawalAmountBase, coin, receiveAddress)
      }

      // notify success
      yield put(actions.form.stopSubmit(WITHDRAWAL_FORM))
      yield put(A.setInterestStep('ACCOUNT_SUMMARY', { withdrawSuccess: true }))
      yield put(actions.analytics.logEvent(INTEREST_EVENTS.WITHDRAWAL.REQUEST_SUCCESS))
      yield delay(3000)
      yield put(A.fetchInterestBalance())
      yield put(A.fetchEDDStatus())
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(WITHDRAWAL_FORM, { _error: error }))
      yield put(A.setInterestStep('ACCOUNT_SUMMARY', { error, withdrawSuccess: false }))
      yield put(actions.analytics.logEvent(INTEREST_EVENTS.WITHDRAWAL.REQUEST_FAILURE))
    }
  }

  const showInterestModal = function* ({ payload }: ReturnType<typeof A.showInterestModal>) {
    const { coin, step } = payload
    yield put(A.setInterestStep(step))
    yield put(
      actions.modals.showModal('INTEREST_MODAL', {
        coin,
        origin: 'InterestPage'
      })
    )
  }

  const fetchShowInterestCardAfterTransaction = function* ({
    payload
  }: ReturnType<typeof A.fetchShowInterestCardAfterTransaction>) {
    try {
      yield put(A.fetchShowInterestCardAfterTransactionLoading())
      const response: InterestAfterTransactionType = yield call(
        api.getInterestCtaAfterTransaction,
        payload.currency
      )
      yield put(A.fetchShowInterestCardAfterTransactionSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchShowInterestCardAfterTransactionFailure(error))
    }
  }

  const stopShowingInterestModal = function* () {
    try {
      yield call(api.stopInterestCtaAfterTransaction, false)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'INTEREST_PROMO_MODAL', e))
    }
    yield put(actions.modals.closeModal('INTEREST_PROMO_MODAL'))
  }

  const fetchEDDStatus = function* () {
    try {
      yield put(A.fetchEDDStatusLoading())
      const response: ReturnType<typeof api.getSavingsEDDStatus> = yield call(
        api.getSavingsEDDStatus
      )
      yield put(A.fetchEDDStatusSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchEDDStatusFailure(error))
    }
  }
  const fetchEDDWithdrawLimits = function* ({
    payload
  }: ReturnType<typeof A.fetchEddWithdrawLimits>) {
    try {
      yield put(A.fetchEddWithdrawLimitsLoading())
      const response: ReturnType<typeof api.getSavingsEDDWithdrawLimits> = yield call(
        api.getSavingsEDDWithdrawLimits,
        payload.currency
      )
      yield put(A.fetchEddWithdrawLimitsSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchEddWithdrawLimitsFailure(error))
    }
  }

  return {
    fetchEDDStatus,
    fetchEDDWithdrawLimits,
    fetchInterestAccount,
    fetchInterestBalance,
    fetchInterestEligible,
    fetchInterestInstruments,
    fetchInterestLimits,
    fetchInterestRate,
    fetchInterestTransactions,
    fetchInterestTransactionsReport,
    fetchShowInterestCardAfterTransaction,
    formChanged,
    handleTransferMaxAmountClick,
    handleTransferMinAmountClick,
    initializeDepositForm,
    initializeWithdrawalForm,
    requestWithdrawal,
    routeToTxHash,
    sendDeposit,
    showInterestModal,
    stopShowingInterestModal
  }
}
