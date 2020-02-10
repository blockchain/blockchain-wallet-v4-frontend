import * as A from './actions'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { BorrowFormValuesType, PaymentType } from './types'
import { call, put, select, take } from 'redux-saga/effects'
import { Exchange } from 'blockchain-wallet-v4/src'
import { fiatDisplayName, getAmount, NO_OFFER_EXISTS } from './model'
import { FormAction, initialize } from 'redux-form'
import { LoanType } from 'core/types'
import { nth } from 'ramda'
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

  const createBorrow = function * () {
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

      const amount = getAmount(values.collateralCryptoAmt || 0, coin)

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

      payment = yield payment.amount(amount, ADDRESS_TYPES.ADDRESS)
      payment = yield payment.to(loan.collateral.depositAddresses[coin])

      payment = yield payment.build()
      // ask for second password
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
      yield put(actions.form.stopSubmit('borrowForm'))
    } catch (e) {
      yield put(actions.form.stopSubmit('borrowForm'))
    }
  }

  const _createLimits = function * (payment: PaymentType) {
    try {
      const coin = S.getCoinType(yield select())
      const offer = S.getOffer(yield select())
      const ratesR = yield select(S.getRates)
      const rates = ratesR.getOrElse({})
      const balance = payment.value().effectiveBalance

      if (!offer) throw new Error(NO_OFFER_EXISTS)

      let adjustedBalance = new BigNumber(balance)
        .dividedBy(offer.terms.collateralRatio)
        .toNumber()

      let maxFiat
      let maxCrypto
      switch (coin) {
        case 'BTC':
          maxFiat = Exchange.convertBtcToFiat({
            value: adjustedBalance,
            fromUnit: 'SAT',
            toCurrency: 'USD',
            rates: rates
          }).value
          maxCrypto = Exchange.convertBtcToBtc({
            value: adjustedBalance,
            fromUnit: 'SAT',
            toUnit: 'SAT',
            rates: rates
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
        const maxCollateralCounter = yield call(_createLimits, payment)

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
    yield put(A.setOffer(payload.offer))

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

      const maxCollateralCounter = yield call(_createLimits, payment)

      const initialValues = {
        collateral: defaultAccountR.getOrElse(),
        maxCollateralCounter
      }

      yield put(initialize('borrowForm', initialValues))
      yield put(A.setPaymentSuccess(payment.value()))
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const maxCollateralClick = function * () {
    const limits = S.getLimits(yield select())

    yield put(actions.form.change('borrowForm', 'principal', limits.maxFiat))
  }

  return {
    createBorrow,
    fetchBorrowOffers,
    fetchUserBorrowHistory,
    formChanged,
    initializeBorrow,
    maxCollateralClick
  }
}
