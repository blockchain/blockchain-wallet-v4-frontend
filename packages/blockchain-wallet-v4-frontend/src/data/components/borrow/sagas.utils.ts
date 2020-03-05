import * as A from './actions'
import * as S from './selectors'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { APIType } from 'core/network/api'
import { CoinType, RemoteDataType } from 'core/types'
import { Exchange } from 'blockchain-wallet-v4/src'
import { NO_OFFER_EXISTS } from './model'
import { PaymentType, PaymentValue } from './types'
import { put, select } from 'redux-saga/effects'
import BigNumber from 'bignumber.js'

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
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
    }

    return payment
  }

  const paymentGetOrElse = (
    coin: CoinType,
    paymentR: RemoteDataType<string | Error, PaymentValue>
  ): PaymentType => {
    switch (coin) {
      case 'ETH':
        return coreSagas.payment.eth.create({
          payment: paymentR.getOrElse(<PaymentType>{}),
          network: networks.eth
        })
      default: {
        return coreSagas.payment.btc.create({
          payment: paymentR.getOrElse(<PaymentType>{}),
          network: networks.btc
        })
      }
    }
  }

  return {
    createLimits,
    createPayment,
    paymentGetOrElse
  }
}
