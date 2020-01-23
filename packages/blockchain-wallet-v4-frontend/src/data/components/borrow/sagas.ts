import * as A from './actions'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { BorrowFormValuesType, PaymentType } from './types'
import { call, put, select } from 'redux-saga/effects'
import { Exchange } from 'blockchain-wallet-v4/src'
import { FormAction, initialize } from 'redux-form'
import { NO_OFFER_EXISTS } from './model'
import { nth } from 'ramda'
import { promptForSecondPassword } from 'services/SagaService'

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const createBorrow = function * () {
    try {
      yield put(actions.form.startSubmit('borrowForm'))
      const paymentR = S.getPayment(yield select())
      let payment = coreSagas.payment.btc.create({
        payment: paymentR.getOrElse(<PaymentType>{}),
        network: networks.btc
      })
      const values: BorrowFormValuesType = yield select(
        selectors.form.getFormValues('borrowForm')
      )

      const offersR = S.getOffers(yield select())
      const offers = offersR.getOrFail(NO_OFFER_EXISTS)
      const offer = offers[0]

      const loan = yield call(api.createLoan, offer.id, {
        symbol: offer.terms.principalCcy,
        value: '100.00'
      })

      // console.log(loan)

      // const request = {
      //  offerId: offer.offerId,
      //  principalAmount: offer.principalAmount
      // }

      // const loan = yield call(api.createLoan, request)
      // payment = yield payment.amount(convert loan amount to rate from offer)
      // payment = yield payment.to(loan.depositAddresses)
      payment = yield payment.amount(546, ADDRESS_TYPES.ADDRESS)
      payment = yield payment.to('1PEP3UNaohnHqVbUNLFFycUJ3ShQxa5NbD')

      payment = yield payment.build()
      // ask for second password
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      // sign and publish payment
      // console.log(values)
      // console.log(payment)
      yield put(actions.form.stopSubmit('borrowForm'))
    } catch (e) {
      // console.log(e)
      yield put(actions.form.stopSubmit('borrowForm'))
    }
  }

  const _createMaxCounter = function * (payment: PaymentType) {
    const coin = S.getCoinType(yield select())
    const ratesR = yield select(S.getRates)
    const rates = ratesR.getOrElse({})
    const balance = payment.value().effectiveBalance

    switch (coin) {
      case 'BTC':
        return Exchange.convertBtcToFiat({
          value: balance,
          fromUnit: 'SAT',
          toCurrency: 'USD',
          rates: rates
        }).value
    }
  }

  const _createPayment = function * (index: number) {
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
    }

    return payment
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

  const formChanged = function * (action: FormAction) {
    const form = action.meta.form
    if (form !== 'borrowForm') return
    const coin = S.getCoinType(yield select())

    let payment

    switch (action.meta.field) {
      case 'collateral':
        yield put(A.setPaymentLoading())
        switch (coin) {
          case 'BTC':
            payment = yield call(_createPayment, action.payload.index)
        }
        const maxCollateralCounter = yield call(_createMaxCounter, payment)

        yield put(
          actions.form.change(
            'borrowForm',
            'maxCollateralCounter',
            maxCollateralCounter
          )
        )
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

      const maxCollateralCounter = yield call(_createMaxCounter, payment)
      const offersR = S.getOffers(yield select())
      const offers = offersR.getOrFail(NO_OFFER_EXISTS)

      const initialValues = {
        collateral: defaultAccountR.getOrElse(),
        maxCollateralCounter,
        offer: offers[0]
      }

      yield put(initialize('borrowForm', initialValues))
      yield put(A.setPaymentSuccess(payment.value()))
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const maxCollateralClick = function * () {
    const values: BorrowFormValuesType = yield select(
      selectors.form.getFormValues('borrowForm')
    )

    yield put(
      actions.form.change(
        'borrowForm',
        'principal',
        values.maxCollateralCounter
      )
    )
  }

  return {
    createBorrow,
    fetchBorrowOffers,
    formChanged,
    initializeBorrow,
    maxCollateralClick
  }
}
