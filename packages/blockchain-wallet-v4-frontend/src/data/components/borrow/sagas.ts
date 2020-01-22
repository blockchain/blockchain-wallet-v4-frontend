import * as A from './actions'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { BorrowFormValuesType } from './types'
import { call, put, select } from 'redux-saga/effects'
import { Exchange } from 'blockchain-wallet-v4/src'
import { initialize } from 'redux-form'
import { nth } from 'ramda'

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
    const paymentR = S.getPayment(yield select())
    const payment = paymentR.getOrElse({})

    // const offerR = S.getOffer(yield select())
    // const offer = offerR.getOrFail(NO_OFFER_EXISTS)

    // const request = {
    //  offerId: offer.offerId,
    //  principalAmount: offer.principalAmount
    // }

    // const loan = yield call(api.createLoan, request)
    // payment = yield payment.amount(convert loan amount)

    // ask for second password
    // sign and publish payment
  }

  const fetchBorrowOffers = function * () {
    try {
      yield put(A.fetchBorrowOffersLoading())
      const offers = yield call(api.getOffers)
      // yield put(A.fetchBorrowOffersSuccess(offers))
    } catch (e) {
      yield put(A.fetchBorrowOffersFailure(e))
    }
  }

  const initializeBorrow = function * ({
    payload
  }: ReturnType<typeof A.initializeBorrow>) {
    let defaultAccountR
    let payment
    let rates

    switch (payload.coin) {
      case 'BTC':
        payment = coreSagas.payment.btc.create({
          network: networks.btc
        })
        payment = yield payment.init()
        const accountsR = yield select(
          selectors.core.common.btc.getAccountsBalances
        )
        const defaultIndex = yield select(
          selectors.core.wallet.getDefaultAccountIndex
        )
        defaultAccountR = accountsR.map(nth(defaultIndex))
        payment = yield payment.from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
        payment = yield payment.fee('priority')
        // TODO: Borrow - get rates from nabu?
        const ratesR = yield select(selectors.core.data.btc.getRates)
        rates = ratesR.getOrElse({})
        break
    }

    const maxCollateral = payment.value().effectiveBalance
    const maxCollateralCounter = Exchange.convertBtcToFiat({
      value: maxCollateral,
      fromUnit: 'SAT',
      toCurrency: 'USD',
      rates: rates
    }).value

    const initialValues = {
      collateral: defaultAccountR.getOrElse(),
      maxCollateralCounter
    }

    yield put(initialize('borrowForm', initialValues))
    yield put(A.setPaymentSuccess(payment.value()))
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
    fetchBorrowOffers,
    initializeBorrow,
    maxCollateralClick
  }
}
