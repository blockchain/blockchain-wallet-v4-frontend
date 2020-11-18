import { call, put, select } from 'redux-saga/effects'

import {
  AccountTypes,
  FiatType,
  PaymentValue,
  RatesType,
  SBBalancesType
} from 'core/types'
import { Exchange } from 'blockchain-wallet-v4/src'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
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

  const createLimits = function * (
    payment?: PaymentValue,
    balances?: SBBalancesType
  ) {
    try {
      const coin = S.getCoinType(yield select())
      const limitsR = S.getInterestLimits(yield select())
      const limits = limitsR.getOrFail('NO_LIMITS_AVAILABLE')
      const balance = payment && payment.effectiveBalance
      const custodialBalance = balances && balances[coin]?.available
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
            value: balance || custodialBalance || 0,
            fromUnit: 'SAT',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'BTC':
          maxFiat = Exchange.convertBtcToFiat({
            value: balance || custodialBalance || 0,
            fromUnit: 'SAT',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'ETH':
          maxFiat = Exchange.convertEthToFiat({
            value: balance || custodialBalance || 0,
            fromUnit: 'WEI',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'PAX':
          maxFiat = Exchange.convertPaxToFiat({
            value: balance || custodialBalance || 0,
            fromUnit: 'WEI',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'USDT':
          maxFiat = Exchange.convertUsdtToFiat({
            value: balance || custodialBalance || 0,
            fromUnit: 'WEI',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'WDGLD':
          maxFiat = Exchange.convertWdgldToFiat({
            value: balance || custodialBalance || 0,
            fromUnit: 'WEI',
            toCurrency: userCurrency,
            rates
          }).value
          break
        case 'XLM':
          maxFiat = Exchange.convertXlmToFiat({
            value: balance || custodialBalance || 0,
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

  return {
    createLimits,
    createPayment
  }
}
