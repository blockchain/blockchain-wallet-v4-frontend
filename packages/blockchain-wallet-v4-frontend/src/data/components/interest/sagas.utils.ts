import { head, isNil, nth } from 'ramda'
import { call, CallEffect, put, select, take } from 'redux-saga/effects'

import { Exchange } from 'blockchain-wallet-v4/src'
import { NO_DEFAULT_ACCOUNT } from 'blockchain-wallet-v4/src/model'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import {
  AccountTypes,
  CoinType,
  FiatType,
  PaymentType,
  PaymentValue,
  RatesType,
  SBBalancesType
} from 'blockchain-wallet-v4/src/types'
import { actions, actionTypes, selectors } from 'data'
import coinSagas from 'data/coins/sagas'
import { promptForSecondPassword } from 'services/sagas'

import exchangeSagaUtils from '../exchange/sagas.utils'
import { convertBaseToStandard } from '../exchange/services'
import * as A from './actions'
import * as S from './selectors'

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

  const toCustodialDropdown = currencyDetails => {
    // this object has to be equal to object we do expect in dropdown
    const { ...restDetails } = currencyDetails
    return [
      {
        ...restDetails,
        address: currencyDetails.address,
        type: ADDRESS_TYPES.CUSTODIAL,
        label: 'Trading Account'
      }
    ]
  }

  const getCustodialAccountForCoin = function * (coin: CoinType) {
    let defaultAccountR

    yield put(actions.components.send.fetchPaymentsTradingAccount(coin))
    yield take([
      actionTypes.components.send.FETCH_PAYMENTS_TRADING_ACCOUNTS_SUCCESS,
      actionTypes.components.send.FETCH_PAYMENTS_TRADING_ACCOUNTS_FAILURE
    ])

    const accountAddress = selectors.components.send.getPaymentsTradingAccountAddress(
      coin,
      yield select()
    )
    const state = yield select()

    const sellAndBuyAccount = selectors.components.simpleBuy
      .getSBBalances(state)
      .map(x => ({
        ...x[coin],
        coin,
        address: accountAddress ? accountAddress.data : null
      }))
      .map(toCustodialDropdown)

    if (coin === 'ALGO' || coin === 'WDGLD') {
      throw new Error('Invalid Coin Type')
    }

    if (coin === 'BCH' || coin === 'BTC') {
      const sellAndBuyAccountDefaultIndex = yield select(
        selectors.core.wallet.getDefaultAccountIndex
      )
      defaultAccountR = sellAndBuyAccount.map(
        nth(sellAndBuyAccountDefaultIndex)
      )
    } else {
      defaultAccountR = sellAndBuyAccount.map(head)
    }

    return defaultAccountR.getOrFail(NO_DEFAULT_ACCOUNT)
  }

  return {
    buildAndPublishPayment,
    createLimits,
    createPayment,
    getCustodialAccountForCoin
  }
}
