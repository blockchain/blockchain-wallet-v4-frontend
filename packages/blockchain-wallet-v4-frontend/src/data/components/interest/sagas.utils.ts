import { call, CallEffect, put, select } from 'redux-saga/effects'
import { isNil } from 'ramda'

import {
  AccountTypes,
  CoinType,
  FiatType,
  PaymentType,
  PaymentValue,
  RatesType,
  SBBalancesType
} from 'core/types'
import { Exchange } from 'blockchain-wallet-v4/src'
import { promptForSecondPassword } from 'services/sagas'
import { selectors } from 'data'
import coinSagas from 'data/coins/sagas'

import * as A from './actions'
import * as S from './selectors'
import { convertBaseToStandard } from '../exchange/services'
import exchangeSagaUtils from '../exchange/sagas.utils'

export default ({ coreSagas, networks }: { coreSagas: any; networks: any }) => {
  const { calculateProvisionalPayment } = exchangeSagaUtils({
    coreSagas,
    networks
  })
  const { convertCoinFromBaseUnitToFiat } = coinSagas({ coreSagas, networks })

  const buildAndPublishPayment = function * (
    coin: CoinType,
    payment: PaymentType,
    destination: string
  ): Generator<PaymentType | CallEffect, PaymentValue, any> {
    try {
      if (coin === 'XLM') {
        // separate out addresses and memo
        const depositAddressMemo = destination.split(':')
        const txMemo = depositAddressMemo[1]
        // throw error if we cant parse the memo for tx
        if (
          isNil(txMemo) ||
          (typeof txMemo === 'string' && txMemo.length === 0)
        ) {
          throw new Error('Memo for transaction is missing')
        }
        payment = yield payment.to(depositAddressMemo[0], 'CUSTODIAL')
        // @ts-ignore
        payment = yield payment.memo(txMemo)
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
      const baseUnitBalance = custodialBalance || balance || 0

      const minFiat = limits[coin]?.minDepositAmount || 100
      const maxFiat = convertCoinFromBaseUnitToFiat(
        coin,
        baseUnitBalance,
        userCurrency,
        rates
      )
      const maxCoin = Exchange.convertCoinToCoin({
        value: baseUnitBalance,
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
    buildAndPublishPayment,
    createLimits,
    createPayment
  }
}
