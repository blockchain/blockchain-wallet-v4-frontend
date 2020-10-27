import { call, CallEffect, put, select } from 'redux-saga/effects'

import {
  AccountTypes,
  CoinType,
  FiatType,
  PaymentType,
  PaymentValue,
  RatesType,
  RemoteDataType,
  SBBalancesType
} from 'core/types'
import { Exchange } from 'blockchain-wallet-v4/src'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import { promptForSecondPassword } from 'services/SagaService'
import { selectors } from 'data'

import * as A from './actions'
import * as S from './selectors'
import { convertBaseToStandard } from '../exchange/services'
import exchangeSagaUtils from '../exchange/sagas.utils'

export default ({ coreSagas, networks }: { coreSagas: any; networks: any }) => {
  const { calculateProvisionalPayment } = exchangeSagaUtils({
    coreSagas,
    networks
  })

  const buildAndPublishPayment = function * (
    coin: CoinType,
    payment: PaymentType,
    destination: string
  ): Generator<PaymentType | CallEffect, PaymentValue, any> {
    try {
      if (coin === 'XLM') {
        // separate out addresses and memo
        const depositAddressMemo = destination.split(':')
        payment = yield payment.to(depositAddressMemo[0], 'CUSTODIAL')
        // @ts-ignore
        payment = yield payment.memo(depositAddressMemo[1])
        // @ts-ignore
        payment = yield payment.memoType('text')
        // @ts-ignore
        payment = yield payment.setDestinationAccountExists(true)
      } else {
        payment = yield payment.to(destination, 'CUSTODIAL')
      }
      payment = yield payment.build()
      // ask for second password
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
    } catch (e) {
      throw e
    }

    return payment.value()
  }

  const createLimits = function * (
    payment: PaymentValue,
    custodialBalances?: SBBalancesType
  ) {
    try {
      const coin = S.getCoinType(yield select())
      const limitsR = S.getInterestLimits(yield select())
      const limits = limitsR.getOrFail('NO_LIMITS_AVAILABLE')
      const balance = payment && payment.effectiveBalance
      const custodialBalance =
        custodialBalances && custodialBalances[coin]?.available
      const ratesR = S.getRates(yield select())
      const rates = ratesR.getOrElse({} as RatesType)
      const userCurrency = (yield select(
        selectors.core.settings.getCurrency
      )).getOrFail('Failed to get user currency')
      const walletCurrencyR = S.getWalletCurrency(yield select())
      const walletCurrency = walletCurrencyR.getOrElse({} as FiatType)
      let maxFiat
      switch (coin) {
        case 'BCH':
          maxFiat = Exchange.convertBchToFiat({
            value: custodialBalance || balance || 0,
            fromUnit: 'SAT',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'BTC':
          maxFiat = Exchange.convertBtcToFiat({
            value: custodialBalance || balance || 0,
            fromUnit: 'SAT',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'ETH':
          maxFiat = Exchange.convertEthToFiat({
            value: custodialBalance || balance || 0,
            fromUnit: 'WEI',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'PAX':
          maxFiat = Exchange.convertPaxToFiat({
            value: custodialBalance || balance || 0,
            fromUnit: 'WEI',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'USDT':
          maxFiat = Exchange.convertUsdtToFiat({
            value: custodialBalance || balance || 0,
            fromUnit: 'WEI',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'XLM':
          maxFiat = Exchange.convertXlmToFiat({
            value: custodialBalance || balance || 0,
            fromUnit: 'STROOP',
            toCurrency: userCurrency,
            rates
          }).value
          break
        default:
          throw new Error(INVALID_COIN_TYPE)
      }
      const minFiat = limits[coin]?.minDepositAmount || 100

      const maxCoin = Exchange.convertCoinToCoin({
        value: balance || custodialBalance || 0,
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

  const createPayment = function * (source: AccountTypes) {
    const coin = S.getCoinType(yield select())

    const payment: PaymentValue = yield call(
      calculateProvisionalPayment,
      source,
      0,
      coin === 'BTC' ? 'regular' : 'priority'
    )

    return payment
  }

  const paymentGetOrElse = (
    coin: CoinType,
    paymentR: RemoteDataType<string | Error, PaymentValue | undefined>
  ): PaymentType => {
    switch (coin) {
      case 'BCH':
        return coreSagas.payment.bch.create({
          payment: paymentR.getOrElse(<PaymentValue>{}),
          network: networks.bch
        })
      case 'BTC':
        return coreSagas.payment.btc.create({
          payment: paymentR.getOrElse(<PaymentValue>{}),
          network: networks.btc
        })
      case 'ETH':
      case 'PAX':
      case 'USDT':
        return coreSagas.payment.eth.create({
          payment: paymentR.getOrElse(<PaymentValue>{}),
          network: networks.eth
        })
      case 'XLM':
        return coreSagas.payment.xlm.create({
          payment: paymentR.getOrElse(<PaymentValue>{})
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
