import BigNumber from 'bignumber.js'
import { call, CallEffect, put, select } from 'redux-saga/effects'

import { Exchange } from 'blockchain-wallet-v4/src'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import {
  CoinType,
  PaymentType,
  PaymentValue,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'
import { generateProvisionalPaymentAmount } from 'data/coins/utils'
import { promptForSecondPassword } from 'services/sagas'

import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import * as A from './actions'
import { NO_OFFER_EXISTS } from './model'
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
  const buildAndPublishPayment = function * (
    coin: CoinType,
    payment: PaymentType,
    amount: number,
    destination: string
  ): Generator<PaymentType | CallEffect, boolean, any> {
    let paymentError
    const paymentAmount = generateProvisionalPaymentAmount(payment.coin, amount)
    payment = yield payment.amount(paymentAmount)
    try {
      payment = yield payment.to(destination, 'ADDRESS')
      payment = yield payment.build()
      // ask for second password
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
    } catch (e) {
      paymentError = e
    }

    return !paymentError
  }

  const createLimits = function * (payment: PaymentType) {
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
      let offerMax = Number(
        convertBaseToStandard(
          offer.terms.maxPrincipalAmount.currency,
          offer.terms.maxPrincipalAmount.amount
        )
      )
      let offerMin = Number(
        convertBaseToStandard(
          offer.terms.minPrincipalAmount.currency,
          offer.terms.minPrincipalAmount.amount
        )
      )
      switch (coin) {
        case 'BTC':
          maxFiat = Exchange.convertBtcToFiat({
            value,
            fromUnit: 'SAT',
            toCurrency: 'USD',
            rates
          }).value
          break
        case 'PAX':
          maxFiat = Exchange.convertPaxToFiat({
            value,
            fromUnit: 'WEI',
            toCurrency: 'USD',
            rates
          }).value
          break
        default:
          throw new Error(INVALID_COIN_TYPE)
      }

      yield put(
        A.setLimits({
          maxFiat: Math.min(Number(maxFiat), offerMax),
          minFiat: offerMin
        })
      )
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const createPayment = function * (index?: number) {
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
        payment = yield payment.fee('priority')
        break
      default:
        throw new Error(INVALID_COIN_TYPE)
    }

    return payment
  }

  const notifyDeposit = function * (
    coin: CoinType,
    loanId: string,
    amount: number,
    destination: string,
    paymentSuccess: boolean,
    depositType: 'DEPOSIT_COLLATERAL' | 'DEPOSIT_PRINCIPAL_AND_INTEREST'
  ) {
    try {
      // notifyDeposit if payment from wallet succeeds or fails
      yield call(
        api.notifyLoanDeposit,
        loanId,
        {
          currency: coin,
          amount: convertStandardToBase(coin, amount)
        },
        destination,
        paymentSuccess ? 'REQUESTED' : 'FAILED',
        depositType
      )
    } catch (e) {
      // notifyDeposit endpoint failed, do nothing and continue
    }
  }

  const paymentGetOrElse = (
    coin: CoinType,
    paymentR: RemoteDataType<string | Error, PaymentValue>
  ): PaymentType => {
    switch (coin) {
      case 'PAX':
      case 'ETH':
        return coreSagas.payment.eth.create({
          payment: paymentR.getOrElse(<PaymentValue>{}),
          network: networks.eth
        })
      default: {
        return coreSagas.payment.btc.create({
          payment: paymentR.getOrElse(<PaymentValue>{}),
          network: networks.btc
        })
      }
    }
  }

  return {
    buildAndPublishPayment,
    createLimits,
    createPayment,
    paymentGetOrElse,
    notifyDeposit
  }
}
