import BigNumber from 'bignumber.js'
import { concat, isEmpty, isNil, last, prop } from 'ramda'
import { FormAction, initialize } from 'redux-form'
import { call, delay, put, select, take } from 'redux-saga/effects'

import { Exchange, Remote } from 'blockchain-wallet-v4/src'
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
      if (!(yield call(isTier2))) return yield put(A.fetchInterestBalanceSuccess({}))
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
      const userCurrency = (yield select(selectors.core.settings.getCurrency)).getOrFail(
        'Failed to get user currency'
      )
      const coin = S.getCoinType(yield select())
      const rates = S.getRates(yield select()).getOrElse(0)
      const rate = rates[userCurrency].last
      const isCustodialAccountSelected =
        prop('type', formValues.interestDepositAccount) === 'CUSTODIAL'

      switch (action.meta.field) {
        case 'depositAmount':
          if (isCustodialAccountSelected) {
            return yield put(A.setPaymentSuccess())
          }
          const isAmountDisplayedInCrypto = S.getIsAmountDisplayedInCrypto(yield select())
          const value = isAmountDisplayedInCrypto
            ? new BigNumber(action.payload).toNumber()
            : new BigNumber(action.payload).dividedBy(rate).toNumber()
          const paymentR = S.getPayment(yield select())
          if (paymentR) {
            let payment = yield getOrUpdateProvisionalPaymentForCoin(coin, paymentR)
            const paymentAmount = generateProvisionalPaymentAmount(coin, value)
            payment = yield payment.amount(paymentAmount || 0)
            if (formValues.interestDepositAccount.balance > 0) {
              payment = yield payment.build()
              yield put(A.setPaymentSuccess(payment.value()))
            } else {
              yield put(A.setPaymentSuccess(payment.value()))
            }
          }
          break
        case 'interestDepositAccount':
          // focus amount to ensure deposit amount validation will be triggered
          yield put(actions.form.focus(DEPOSIT_FORM, 'depositAmount'))

          // custodial account selected
          if (isCustodialAccountSelected) {
            const custodialBalances: SBBalancesType = (yield select(
              selectors.components.simpleBuy.getSBBalances
            )).getOrFail('Failed to get balance')

            yield call(createLimits, undefined, custodialBalances)
            yield put(A.setPaymentSuccess())
          } else {
            // noncustodial account selected
            const depositPayment: PaymentValue = yield call(createPayment, {
              ...formValues.interestDepositAccount,
              address: getAccountIndexOrAccount(coin, formValues.interestDepositAccount)
            })
            yield call(createLimits, depositPayment)
            yield put(A.setPaymentSuccess(depositPayment))
          }
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

  const initializeCustodialAccountForm = function* (coin) {
    // re-fetch the custodial balances to ensure we have the latest for proper form initialization
    yield put(actions.components.simpleBuy.fetchSBBalances(undefined, true))
    // wait until balances are loaded we must have deep equal objects to initialize form correctly
    yield take([
      actionTypes.components.simpleBuy.FETCH_SB_BALANCES_SUCCESS,
      actionTypes.components.simpleBuy.FETCH_SB_BALANCES_FAILURE
    ])
    const custodialBalances = (yield select(
      selectors.components.simpleBuy.getSBBalances
    )).getOrFail('Failed to get balances')
    const custodialAccount = (yield call(getCustodialAccountForCoin, coin)).getOrFail(
      'Failed to fetch account'
    )
    yield call(createLimits, undefined, custodialBalances)
    yield put(A.setPaymentSuccess())

    return custodialAccount
  }

  const initializeNonCustodialAccountForm = function* (coin) {
    // fetch deposit address to build provisional payment
    const depositAddr = yield select(S.getDepositAddress)
    // abort if deposit address missing
    if (isEmpty(depositAddr) || isNil(depositAddr)) {
      throw new Error('Missing deposit address')
    }
    const depositAddress = depositAddr.split(':')[0]
    // fetch default account
    const noncustodialAccount = yield call(getDefaultAccountForCoin, coin)
    // create provisional payment
    const payment: PaymentValue = yield call(createPayment, {
      ...noncustodialAccount,
      address: getAccountIndexOrAccount(coin, noncustodialAccount)
    })
    let newPayment = yield getOrUpdateProvisionalPaymentForCoin(coin, Remote.of(payment))
    newPayment = yield newPayment.to(depositAddress, 'ADDRESS')
    newPayment = yield newPayment.value()
    yield call(createLimits, newPayment)
    yield put(A.setPaymentSuccess(newPayment))

    return noncustodialAccount
  }

  const initializeDepositForm = function* ({
    payload
  }: ReturnType<typeof A.initializeDepositForm>) {
    const { coin, currency } = payload
    const { coinfig } = window.coins[coin]
    let initialAccount

    try {
      yield put(A.fetchInterestAccount(coin))
      yield take([
        AT.FETCH_INTEREST_PAYMENT_ACCOUNT_SUCCESS,
        AT.FETCH_INTEREST_PAYMENT_ACCOUNT_FAILURE
      ])
      yield put(A.setPaymentLoading())
      yield put(A.fetchInterestLimits(coin, currency))
      yield take([AT.FETCH_INTEREST_LIMITS_SUCCESS, AT.FETCH_INTEREST_LIMITS_FAILURE])

      // initialize the form depending upon account types for coin
      if (coinfig.products.includes('PrivateKey')) {
        initialAccount = yield call(initializeNonCustodialAccountForm, coin)
      } else {
        initialAccount = yield call(initializeCustodialAccountForm, coin)
      }

      // finally, initialize the form
      yield put(
        initialize(DEPOSIT_FORM, {
          coin,
          currency,
          interestDepositAccount: initialAccount
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
    yield put(actions.router.push(`/${coin}/transactions`))
    yield delay(1000)
    yield put(actions.form.change('walletTxSearch', 'search', txHash))
  }

  const sendDeposit = function* () {
    try {
      yield put(actions.form.startSubmit(DEPOSIT_FORM))
      const formValues: InterestDepositFormType = yield select(
        selectors.form.getFormValues(DEPOSIT_FORM)
      )
      const isCustodialDeposit = formValues.interestDepositAccount.type === 'CUSTODIAL'
      const coin = S.getCoinType(yield select())

      // custodial account deposit
      if (isCustodialDeposit) {
        const { depositAmount } = formValues
        const isAmountDisplayedInCrypto = S.getIsAmountDisplayedInCrypto(yield select())
        const userCurrency = (yield select(selectors.core.settings.getCurrency)).getOrFail(
          'Failed to get user currency'
        )
        const rates = S.getRates(yield select()).getOrElse(0)
        const rate = rates[userCurrency].last
        const baseCrypto = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin,
          value: isAmountDisplayedInCrypto
            ? new BigNumber(depositAmount).toNumber()
            : new BigNumber(depositAmount).dividedBy(rate).toNumber()
        })

        yield call(api.initiateCustodialTransfer, {
          amount: new BigNumber(baseCrypto).integerValue(BigNumber.ROUND_DOWN).toString(),
          currency: coin,
          destination: 'SAVINGS',
          origin: 'SIMPLEBUY'
        })
      } else {
        // non-custodial account deposit
        // get payment
        const paymentR = S.getPayment(yield select())
        const payment = yield getOrUpdateProvisionalPaymentForCoin(
          coin,
          paymentR as RemoteDataType<string, any>
        )
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
