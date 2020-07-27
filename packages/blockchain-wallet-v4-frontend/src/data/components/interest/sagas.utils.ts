import { call, CallEffect, put, select } from 'redux-saga/effects'
import { includes } from 'ramda'

import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import {
  CoinType,
  FiatType,
  PaymentType,
  PaymentValue,
  RemoteDataType
} from 'core/types'
import { Exchange } from 'blockchain-wallet-v4/src'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import { promptForSecondPassword } from 'services/SagaService'
import { selectors } from 'data'

import * as A from './actions'
import * as S from './selectors'
import { convertBaseToStandard } from '../exchange/services'
import { RatesType } from '../borrow/types'

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
      const walletCurrencyR = S.getWalletCurrency(yield select())
      const walletCurrency = walletCurrencyR.getOrElse({} as FiatType)

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
        case 'ETH':
          maxFiat = Exchange.convertEthToFiat({
            value: balance,
            fromUnit: 'WEI',
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
        case 'USDT':
          maxFiat = Exchange.convertUsdtToFiat({
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

      const maxCoin = Exchange.convertCoinToCoin({
        value: balance,
        coin,
        baseToStandard: true
      }).value

      const minCoin = Exchange.convertFiatToCoin(
        Number(convertBaseToStandard('FIAT', minFiat)),
        coin,
        walletCurrency,
        rates
      )

      yield put(
        A.setDepositLimits({
          maxFiat: maxFiat,
          minFiat: Number(convertBaseToStandard('FIAT', minFiat)), // default unit is cents, convert to standard
          maxCoin: maxCoin,
          minCoin: minCoin
        })
      )
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const createPayment = function * (accountIndex?: number) {
    let payment
    const coin = S.getCoinType(yield select())
    const erc20List = (yield select(
      selectors.core.walletOptions.getErc20CoinList
    )).getOrElse([])
    const isErc20 = includes(coin, erc20List)

    switch (coin) {
      case 'BTC':
        payment = coreSagas.payment.btc.create({
          network: networks.btc
        })
        payment = yield payment.init()
        payment = yield payment.from(accountIndex, ADDRESS_TYPES.ACCOUNT)
        payment = yield payment.fee('regular')
        break
      case 'ETH':
      case 'USDT':
      case 'PAX':
        payment = coreSagas.payment.eth.create({
          network: networks.eth
        })
        payment = yield payment.init({ isErc20, coin })
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
      case 'USDT':
      case 'PAX':
      case 'ETH':
        return coreSagas.payment.eth.create({
          payment: paymentR.getOrElse(<PaymentValue>{}),
          network: networks.eth
        })
      case 'BTC':
        return coreSagas.payment.btc.create({
          payment: paymentR.getOrElse(<PaymentValue>{}),
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
