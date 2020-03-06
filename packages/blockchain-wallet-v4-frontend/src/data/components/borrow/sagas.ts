import * as A from './actions'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { all, call, put, select } from 'redux-saga/effects'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import {
  BorrowFormValuesType,
  PaymentType,
  PaymentValue,
  RepayLoanFormType
} from './types'
import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import {
  fiatDisplayName,
  getCollateralAmtRequired,
  NO_LOAN_EXISTS,
  NO_OFFER_EXISTS
} from './model'
import { FormAction, initialize, touch } from 'redux-form'
import { head, nth } from 'ramda'
import { LoanFinancialsType, LoanType } from 'core/types'
import BigNumber from 'bignumber.js'
import exchangeSagaUtils from '../exchange/sagas.utils'
import profileSagas from '../../../data/modules/profile/sagas'
import utils from './sagas.utils'

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
  const calculateProvisionalPayment = exchangeSagaUtils({ coreSagas, networks })
    .calculateProvisionalPayment
  const {
    buildAndPublishPayment,
    createPayment,
    createLimits,
    paymentGetOrElse,
    notifyDeposit
  } = utils({
    api,
    coreSagas,
    networks
  })

  const errorHandler = e => {
    return typeof e === 'object'
      ? e.description
        ? e.description
        : e.message
        ? e.message
        : JSON.stringify(e)
      : e
  }

  const addCollateral = function * () {
    try {
      yield put(actions.form.startSubmit('borrowForm'))
      const paymentR = S.getPayment(yield select())

      const coin = S.getCoinType(yield select())
      let payment = paymentGetOrElse(coin, paymentR)
      const values: BorrowFormValuesType = yield select(
        selectors.form.getFormValues('borrowForm')
      )

      const loan = S.getLoan(yield select())
      const offer = S.getOffer(yield select())

      if (!offer) throw new Error(NO_OFFER_EXISTS)
      if (!loan) throw new Error(NO_LOAN_EXISTS)

      const ratesR = S.getRates(yield select())
      const rates = ratesR.getOrElse({})
      const rate = rates[fiatDisplayName(offer.terms.principalCcy)].last

      const cryptoAmt = Number(values.additionalCollateral) / rate
      const destination = loan.collateral.depositAddresses[coin]

      const paymentSuccess: boolean = yield call(
        buildAndPublishPayment,
        coin,
        payment,
        cryptoAmt,
        destination
      )

      yield call(
        notifyDeposit,
        offer.terms.collateralCcy,
        loan.loanId,
        cryptoAmt,
        destination,
        paymentSuccess,
        'DEPOSIT_COLLATERAL'
      )

      yield put(actions.form.stopSubmit('borrowForm'))
      yield put(A.setStep({ step: 'DETAILS', loan, offer }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('borrowForm', { _error: error }))
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
      const coin = S.getCoinType(yield select())
      const paymentR = S.getPayment(yield select())
      let payment = paymentGetOrElse(coin, paymentR)
      const values: BorrowFormValuesType = yield select(
        selectors.form.getFormValues('borrowForm')
      )

      const offer = S.getOffer(yield select())

      if (!offer) throw new Error(NO_OFFER_EXISTS)

      // TODO: Borrow - make dynamic
      const principalWithdrawAddressR = yield select(
        selectors.core.data.eth.getDefaultAddress
      )
      const principalWithdrawAddress = principalWithdrawAddressR.getOrFail(
        'NO_PRINCIPAL_WITHDRAW_ADDRESS'
      )

      const { loan }: { loan: LoanType } = yield call(
        api.createLoan,
        offer.id,
        {
          currency: offer.terms.principalCcy,
          amount: convertStandardToBase(
            offer.terms.principalCcy,
            values.principal
          )
        },
        {
          PAX: principalWithdrawAddress
        }
      )

      const destination = loan.collateral.depositAddresses[coin]

      const paymentSuccess: boolean = yield call(
        buildAndPublishPayment,
        coin,
        payment,
        values.collateralCryptoAmt || 0,
        destination
      )

      yield call(
        notifyDeposit,
        offer.terms.collateralCcy,
        loan.loanId,
        values.collateralCryptoAmt || 0,
        destination,
        paymentSuccess,
        'DEPOSIT_COLLATERAL'
      )

      yield put(actions.form.stopSubmit('borrowForm'))
      yield put(A.setStep({ step: 'DETAILS', loan, offer }))
      yield put(A.fetchUserBorrowHistory())
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('borrowForm', { _error: error }))
    }
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
      let loans: Array<LoanType> = yield call(api.getUserBorrowHistory)
      loans = yield all(
        loans.map(function * (loan) {
          const financials: LoanFinancialsType = yield call(
            api.getLoanFinancials,
            loan.loanId
          )

          return {
            ...loan,
            financials
          }
        })
      )
      yield put(A.fetchUserBorrowHistorySuccess(loans))
    } catch (e) {
      yield put(A.fetchUserBorrowHistoryFailure(e))
    }
  }

  const formChanged = function * (action: FormAction) {
    const form = action.meta.form
    if (form !== 'borrowForm') return
    const offer = S.getOffer(yield select())
    if (!offer) return
    const coin = S.getCoinType(yield select())
    const ratesR = S.getRates(yield select())
    const rates = ratesR.getOrElse({})
    const rate = rates[fiatDisplayName(offer.terms.principalCcy)].last
    const paymentR = S.getPayment(yield select())
    let payment = paymentGetOrElse(coin, paymentR)
    const values: BorrowFormValuesType = yield select(
      selectors.form.getFormValues('borrowForm')
    )

    switch (action.meta.field) {
      case 'principal':
        const principal = new BigNumber(action.payload)
        const collateralAmt = +principal
          .dividedBy(rate)
          .multipliedBy(offer.terms.collateralRatio)
          .toFixed(8)
        yield put(
          actions.form.change(
            'borrowForm',
            'collateralCryptoAmt',
            collateralAmt
          )
        )
        let provisionalPayment: PaymentValue = yield call(
          calculateProvisionalPayment,
          values.collateral,
          collateralAmt
        )
        yield put(A.setPaymentSuccess(provisionalPayment))
        break
      case 'collateral':
        yield put(A.setPaymentLoading())
        payment = yield call(createPayment, action.payload.index)
        yield call(createLimits, payment)
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
          payment = yield call(createPayment, defaultIndex)
          break
      }

      yield call(createLimits, payment)

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
      const loan = S.getLoan(yield select())
      if (!loan) throw NO_LOAN_EXISTS
      switch (payload.coin) {
        case 'PAX':
          const erc20AccountR = yield select(
            selectors.core.common.eth.getErc20AccountBalances,
            'PAX'
          )
          defaultAccountR = erc20AccountR.map(head)
          payment = yield call(createPayment)
          break
      }

      yield call(createLimits, payment)

      const initialValues = {
        amount: convertBaseToStandard(
          loan.principal.amount[0].currency,
          loan.principal.amount[0].amount
        ),
        'repay-principal': defaultAccountR.getOrElse(),
        'repay-method': 'principal',
        'repay-type': 'full'
      }

      yield put(initialize('repayLoanForm', initialValues))
      // Touch field for validation
      yield put(touch('repayLoanForm', 'amount'))
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
      const values: RepayLoanFormType = yield select(
        selectors.form.getFormValues('repayLoanForm')
      )
      const loan = S.getLoan(yield select())
      const offer = S.getOffer(yield select())
      const coin = S.getCoinType(yield select())
      if (!loan) throw NO_LOAN_EXISTS
      if (!offer) throw NO_OFFER_EXISTS

      // TODO: Borrow - make dynamic
      const collateralWithdrawAddressR = selectors.core.common.btc.getNextAvailableReceiveAddress(
        networks.btc,
        yield select(selectors.core.wallet.getDefaultAccountIndex),
        yield select()
      )
      const collateralWithdrawAddress = collateralWithdrawAddressR.getOrFail(
        'NO_COLLATERAL_WITHDRAW_ADDRESS'
      )

      const destination = loan.principal.depositAddresses[coin]

      const paymentSuccess = yield call(
        buildAndPublishPayment,
        coin,
        payment,
        Number(values.amount) || 0,
        destination
      )

      // do not close loan with backend if collateral payment failed
      if (!paymentSuccess) return

      let response: { loan: LoanType } = yield call(
        api.closeLoanWithPrincipal,
        loan,
        {
          BTC: collateralWithdrawAddress
        }
      )

      yield call(
        notifyDeposit,
        offer.terms.principalCcy,
        loan.loanId,
        Number(values.amount) || 0,
        destination,
        paymentSuccess,
        'DEPOSIT_PRINCIPAL_AND_INTEREST'
      )

      yield put(actions.form.stopSubmit('repayLoanForm'))
      yield put(A.setStep({ step: 'DETAILS', loan: response.loan, offer }))
      yield put(A.fetchUserBorrowHistory())
    } catch (e) {
      const error = errorHandler(e)
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
