import * as A from './actions'
import * as S from './selectors'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { call, CallEffect, put, select } from 'redux-saga/effects'
import { CoinType, PaymentType, PaymentValue, RemoteDataType } from 'core/types'
import { convertBaseToStandard } from '../exchange/services'
import { Exchange } from 'blockchain-wallet-v4/src'
import { INVALID_COIN_TYPE } from './model'
import { promptForSecondPassword } from 'services/SagaService'
import { RatesType } from '../borrow/types'
import { selectors } from 'data'

export default ({ coreSagas, networks }: { coreSagas: any; networks: any }) => {
  const buildAndPublishPayment = function * (
    coin: CoinType,
    payment: PaymentType,
    destination: string
  ): Generator<PaymentType | CallEffect, boolean, any> {
    let paymentError
    try {
      payment = yield payment.to(destination, ADDRESS_TYPES.ADDRESS)
      payment = yield payment.build()
      // ask for second password
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
    } catch (e) {
      throw e
    }

    return !paymentError
  }

  const createLimits = function * (payment: PaymentType) {
    try {
      const coin = S.getCoinType(yield select())
      const limitsR = S.getInterestLimits(yield select())
      const limits = limitsR.getOrFail('NO_LIMITS_AVAILABLE')
      const balance = payment.value().effectiveBalance
      const ratesR = S.getRates(yield select())
      const rates = ratesR.getOrElse({} as RatesType)
      const userCurrency = (yield select(
        selectors.core.settings.getCurrency
      )).getOrFail('Failed to get user currency')

      let maxFiat
      switch (coin) {
        case 'BTC':
          maxFiat = Exchange.convertBtcToFiat({
            value: balance,
            fromUnit: 'SAT',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'PAX':
          maxFiat = Exchange.convertPaxToFiat({
            value: balance,
            fromUnit: 'WEI',
            toCurrency: userCurrency,
            rates
          }).value
          break
        default:
          throw new Error(INVALID_COIN_TYPE)
      }

      const minFiat = limits[coin]?.minDepositAmount || 100

      yield put(
        A.setDepositLimits({
          maxFiat: maxFiat,
          minFiat: Number(convertBaseToStandard('FIAT', minFiat)) // default unit is cents, convert to standard
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
        payment = yield payment.fee('regular')
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

  const paymentGetOrElse = (
    coin: CoinType,
    paymentR: RemoteDataType<string | Error, PaymentValue>
  ): PaymentType => {
    switch (coin) {
      case 'PAX':
      case 'ETH':
        return coreSagas.payment.eth.create({
          payment: paymentR.getOrElse(<PaymentType>{}),
          network: networks.eth
        })
      case 'BTC':
        return coreSagas.payment.btc.create({
          payment: paymentR.getOrElse(<PaymentType>{}),
          network: networks.btc
        })
      default:
        throw new Error(INVALID_COIN_TYPE)
    }
  }

  return {
    buildAndPublishPayment,
    createLimits,
    createPayment,
    paymentGetOrElse
  }
}
