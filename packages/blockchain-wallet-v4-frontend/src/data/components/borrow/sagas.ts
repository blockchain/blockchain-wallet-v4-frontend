import * as A from './actions'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { BorrowFormValuesType, PaymentType, RepayLoanForm } from './types'
import { call, put, select, take } from 'redux-saga/effects'
import { Exchange } from 'blockchain-wallet-v4/src'
import {
  fiatDisplayName,
  getAmount,
  getCollateralAmtRequired,
  NO_LOAN_EXISTS,
  NO_OFFER_EXISTS
} from './model'
import { FormAction, initialize } from 'redux-form'
import { head, nth } from 'ramda'
import { LoanType } from 'core/types'

import { promptForSecondPassword } from 'services/SagaService'
import BigNumber from 'bignumber.js'
import profileSagas from '../../../data/modules/profile/sagas'

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const waitForUserData = profileSagas({ api, coreSagas, networks })
    .waitForUserData

  const addCollateral = function * () {
    try {
      yield put(actions.form.startSubmit('borrowForm'))
      const paymentR = S.getPayment(yield select())
      let payment: PaymentType = coreSagas.payment.btc.create({
        payment: paymentR.getOrElse(<PaymentType>{}),
        network: networks.btc
      })
      const values: BorrowFormValuesType = yield select(
        selectors.form.getFormValues('borrowForm')
      )

      const loan = S.getLoan(yield select())
      const offer = S.getOffer(yield select())
      const coin = S.getCoinType(yield select())

      if (!offer) throw new Error(NO_OFFER_EXISTS)
      if (!loan) throw new Error(NO_LOAN_EXISTS)

      const ratesR = S.getRates(yield select())
      const rates = ratesR.getOrElse({})
      const rate = rates[fiatDisplayName(offer.terms.principalCcy)].last

      const cryptoAmt = Number(values.additionalCollateral) / rate
      const amount: string = getAmount(cryptoAmt || 0, coin)

      payment = yield payment.amount(Number(amount))
      payment = yield payment.to(
        loan.collateral.depositAddresses[coin],
        ADDRESS_TYPES.ADDRESS
      )

      payment = yield payment.build()
      // ask for second password
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
      yield put(actions.form.stopSubmit('borrowForm'))
      yield put(A.setStep({ step: 'DETAILS', loan, offer }))
    } catch (e) {
      yield put(actions.form.stopSubmit('borrowForm', { _error: e }))
    }
  }

  const amtCollateralRequiredClick = function * () {
    const offer = S.getOffer(yield select())
    const loan = S.getLoan(yield select())
    if (!loan || !offer) return
    const amt = getCollateralAmtRequired(loan, offer)

    yield put(actions.form.change('borrowForm', 'principal', amt))
  }

  const createBorrow = function * () {
    try {
      yield put(actions.form.startSubmit('borrowForm'))
      const paymentR = S.getPayment(yield select())
      // TODO: Borrow - make dynamic
      let payment: PaymentType = coreSagas.payment.btc.create({
        payment: paymentR.getOrElse(<PaymentType>{}),
        network: networks.btc
      })
      const values: BorrowFormValuesType = yield select(
        selectors.form.getFormValues('borrowForm')
      )

      const offer = S.getOffer(yield select())
      const coin = S.getCoinType(yield select())
      if (!offer) throw new Error(NO_OFFER_EXISTS)

      // TODO: Borrow - make dynamic
      const principalWithdrawAddressR = yield select(
        selectors.core.data.eth.getDefaultAddress
      )
      const principalWithdrawAddress = principalWithdrawAddressR.getOrFail(
        'NO_PRINCIPAL_WITHDRAW_ADDRESS'
      )

      // TODO: Borrow - make dynamic
      const collateralWithdrawAddressR = selectors.core.common.btc.getNextAvailableReceiveAddress(
        networks.btc,
        payment.value().fromAccountIdx,
        yield select()
      )
      const collateralWithdrawAddress = collateralWithdrawAddressR.getOrFail(
        'NO_COLLATERAL_WITHDRAW_ADDRESS'
      )

      const amount: string = getAmount(values.collateralCryptoAmt || 0, coin)

      const loan: LoanType = yield call(
        api.createLoan,
        collateralWithdrawAddress,
        offer.id,
        {
          symbol: offer.terms.principalCcy,
          value: values.principal
        },
        {
          PAX: principalWithdrawAddress
        }
      )

      payment = yield payment.amount(Number(amount))
      payment = yield payment.to(
        loan.collateral.depositAddresses[coin],
        ADDRESS_TYPES.ADDRESS
      )

      payment = yield payment.build()
      // ask for second password
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
      yield put(actions.form.stopSubmit('borrowForm'))
      yield put(A.setStep({ step: 'DETAILS', loan, offer }))
    } catch (e) {
      const error = typeof e === 'object' ? e.description : e
      yield put(actions.form.stopSubmit('borrowForm', { _error: error }))
    }
  }

  const _createLimits = function * (payment: PaymentType) {
    try {
      const coin = S.getCoinType(yield select())
      const offer = S.getOffer(yield select())
      const ratesR = yield select(S.getRates)
      const rates = ratesR.getOrElse({})
      const balance = payment.value().effectiveBalance
      const step = S.getStep(yield select())

      if (!offer) throw new Error(NO_OFFER_EXISTS)

      let adjustedBalance = new BigNumber(balance)
        .dividedBy(offer.terms.collateralRatio)
        .toNumber()
      const value = step === 'CHECKOUT' ? adjustedBalance : balance

      let maxFiat
      let maxCrypto
      switch (coin) {
        case 'BTC':
          maxFiat = Exchange.convertBtcToFiat({
            value,
            fromUnit: 'SAT',
            toCurrency: 'USD',
            rates
          }).value
          maxCrypto = Exchange.convertBtcToBtc({
            value,
            fromUnit: 'SAT',
            toUnit: 'SAT'
          }).value
          break
        case 'PAX':
          maxFiat = Exchange.convertPaxToFiat({
            value,
            fromUnit: 'WEI',
            toCurrency: 'USD',
            rates
          }).value
          maxCrypto = Exchange.convertPaxToPax({
            value,
            fromUnit: 'WEI',
            toUnit: 'PAX'
          }).value
      }

      yield put(
        A.setLimits({
          maxFiat: Number(maxFiat),
          maxCrypto: Number(maxCrypto),
          minFiat: 0,
          minCrypto: 0
        })
      )
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const _createPayment = function * (index?: number) {
    let payment
    const coin = S.getCoinType(yield select())

    switch (coin) {
      case 'BTC':
        payment = coreSagas.payment.btc.create({
          network: networks.btc
        })
        payment = yield payment.init()
        payment = yield payment.from(index, ADDRESS_TYPES.ACCOUNT)
        payment = yield payment.fee('priority')
        break
      case 'PAX':
        payment = coreSagas.payment.eth.create({
          network: networks.eth
        })
        payment = yield payment.init({ isErc20: true, coin })
        payment = yield payment.from()
    }

    return payment
  }

  const destroyBorrow = function * () {
    yield put(actions.form.destroy('borrowForm'))
  }

  const fetchBorrowOffers = function * () {
    try {
      yield put(A.fetchBorrowOffersLoading())
      const offers = yield call(api.getOffers)
      yield put(A.fetchBorrowOffersSuccess(offers))
    } catch (e) {
      yield put(A.fetchBorrowOffersFailure(e))
    }
  }

  const fetchUserBorrowHistory = function * () {
    try {
      yield put(A.fetchUserBorrowHistoryLoading())
      yield call(waitForUserData)
      const offers = yield call(api.getUserBorrowHistory)
      yield put(A.fetchUserBorrowHistorySuccess(offers))
    } catch (e) {
      yield put(A.fetchUserBorrowHistoryFailure(e))
    }
  }

  const formChanged = function * (action: FormAction) {
    const form = action.meta.form
    if (form !== 'borrowForm') return
    const coin = S.getCoinType(yield select())
    const offer = S.getOffer(yield select())
    if (!offer) return
    const ratesR = S.getRates(yield select())
    const rates = ratesR.getOrElse({})
    const rate = rates[fiatDisplayName(offer.terms.principalCcy)].last
    let payment

    switch (action.meta.field) {
      case 'principal':
        const principal = Number(action.payload)
        const c = (principal / rate) * offer.terms.collateralRatio
        yield put(actions.form.change('borrowForm', 'collateralCryptoAmt', c))
        break
      case 'collateral':
        yield put(A.setPaymentLoading())
        switch (coin) {
          case 'BTC':
            payment = yield call(_createPayment, action.payload.index)
        }
        yield call(_createLimits, payment)

        yield put(A.setPaymentSuccess(payment.value()))
    }
  }

  const initializeBorrow = function * ({
    payload
  }: ReturnType<typeof A.initializeBorrow>) {
    let defaultAccountR
    let payment: PaymentType = <PaymentType>{}
    yield put(A.setPaymentLoading())

    try {
      switch (payload.coin) {
        case 'BTC':
          const accountsR = yield select(
            selectors.core.common.btc.getAccountsBalances
          )
          const defaultIndex = yield select(
            selectors.core.wallet.getDefaultAccountIndex
          )
          defaultAccountR = accountsR.map(nth(defaultIndex))
          payment = yield call(_createPayment, defaultIndex)
          break
      }

      yield call(_createLimits, payment)

      const initialValues = {
        collateral: defaultAccountR.getOrElse()
      }

      yield put(initialize('borrowForm', initialValues))
      yield put(A.setPaymentSuccess(payment.value()))
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const initializeRepayLoan = function * ({
    payload
  }: ReturnType<typeof A.initializeRepayLoan>) {
    let defaultAccountR
    let payment: PaymentType = <PaymentType>{}
    yield put(A.setPaymentLoading())

    try {
      switch (payload.coin) {
        case 'PAX':
          const erc20AccountR = yield select(
            selectors.core.common.eth.getErc20AccountBalances,
            'PAX'
          )
          defaultAccountR = erc20AccountR.map(head)
          payment = yield call(_createPayment)
          break
      }

      yield call(_createLimits, payment)

      const initialValues = {
        'repay-principal': defaultAccountR.getOrElse()
      }

      yield put(initialize('repayLoanForm', initialValues))
      yield put(A.setPaymentSuccess(payment.value()))
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const maxCollateralClick = function * () {
    const limits = S.getLimits(yield select())

    yield put(actions.form.change('borrowForm', 'principal', limits.maxFiat))
  }

  const repayLoan = function * () {
    try {
      yield put(actions.form.startSubmit('repayLoanForm'))
      const paymentR = S.getPayment(yield select())
      // TODO: Borrow - make dynamic
      let payment: PaymentType = coreSagas.payment.eth.create({
        payment: paymentR.getOrElse(<PaymentType>{}),
        network: networks.eth
      })
      const values: RepayLoanForm = yield select(
        selectors.form.getFormValues('repayLoanForm')
      )
      const loan = S.getLoan(yield select())
      const coin = S.getCoinType(yield select())
      if (!loan) throw NO_LOAN_EXISTS

      const amount: string = getAmount(Number(values.amount) || 0, coin)

      payment = yield payment.amount(Number(amount))
      payment = yield payment.to(loan.principal.depositAddresses[coin])
      // sign payment
      yield put(
        actions.form.stopSubmit('repayLoanForm', {
          _error: 'Payment not signed'
        })
      )
    } catch (e) {
      const error = typeof e === 'object' ? e.description : e
      yield put(actions.form.stopSubmit('repayLoanForm', { _error: error }))
    }
  }

  return {
    addCollateral,
    amtCollateralRequiredClick,
    createBorrow,
    destroyBorrow,
    fetchBorrowOffers,
    fetchUserBorrowHistory,
    formChanged,
    initializeBorrow,
    initializeRepayLoan,
    maxCollateralClick,
    repayLoan
  }
}
