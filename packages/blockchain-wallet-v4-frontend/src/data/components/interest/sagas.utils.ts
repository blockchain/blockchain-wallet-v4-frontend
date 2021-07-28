import { head, isNil } from 'ramda'
import { call, CallEffect, put, select, take } from 'redux-saga/effects'

import { Exchange } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import {
  AccountTypes,
  CoinType,
  FiatType,
  PaymentType,
  PaymentValue,
  SBBalancesType
} from 'blockchain-wallet-v4/src/types'
import { actions, actionTypes, selectors } from 'data'
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

  const buildAndPublishPayment = function* (
    coin: CoinType,
    payment: PaymentType,
    destination: string
  ): Generator<PaymentType | CallEffect, PaymentValue, any> {
    let updatedPayment = payment
    // eslint-disable-next-line no-useless-catch
    try {
      if (coin === 'XLM') {
        // separate out addresses and memo
        const depositAddressMemo = destination.split(':')
        const txMemo = depositAddressMemo[1]
        // throw error if we cant parse the memo for tx
        if (isNil(txMemo) || (typeof txMemo === 'string' && txMemo.length === 0)) {
          throw new Error('Memo for transaction is missing')
        }
        updatedPayment = yield updatedPayment.to(depositAddressMemo[0], 'CUSTODIAL')
        // @ts-ignore
        updatedPayment = yield updatedPayment.memo(txMemo)
        // @ts-ignore
        updatedPayment = yield updatedPayment.memoType('text')
        // @ts-ignore
        updatedPayment = yield updatedPayment.setDestinationAccountExists(true)
      } else {
        updatedPayment = yield updatedPayment.to(destination, 'CUSTODIAL')
      }
      updatedPayment = yield updatedPayment.build()
      // ask for second password
      const password = yield call(promptForSecondPassword)
      updatedPayment = yield updatedPayment.sign(password)
      updatedPayment = yield updatedPayment.publish()
    } catch (e) {
      throw e
    }

    return updatedPayment.value()
  }

  const createLimits = function* (payment?: PaymentValue, custodialBalances?: SBBalancesType) {
    try {
      const coin = S.getCoinType(yield select())
      const limitsR = S.getInterestLimits(yield select())
      const limits = limitsR.getOrFail('NO_LIMITS_AVAILABLE')
      const ratesR = S.getRates(yield select())
      const rates = ratesR.getOrElse(0)
      const userCurrency = (yield select(selectors.core.settings.getCurrency)).getOrFail(
        'Failed to get user currency'
      )
      const walletCurrencyR = S.getWalletCurrency(yield select())
      const walletCurrency = walletCurrencyR.getOrElse({} as FiatType)

      // determine balance to use based on args passed in
      const nonCustodialBalance = payment && payment.effectiveBalance
      const custodialBalance = custodialBalances && custodialBalances[coin]?.available
      const baseUnitBalance = nonCustodialBalance || custodialBalance || 0

      const minFiat = limits[coin]?.minDepositAmount || 100
      const maxFiat = Exchange.convertCoinToFiat({
        coin,
        currency: userCurrency,
        rates,
        value: baseUnitBalance
      })
      const maxCoin = Exchange.convertCoinToCoin({
        coin,
        value: baseUnitBalance
      })
      const minCoin = Exchange.convertFiatToCoin({
        coin,
        currency: walletCurrency,
        rates,
        value: Number(convertBaseToStandard('FIAT', minFiat))
      })

      yield put(
        A.setDepositLimits({
          // default unit is cents, convert to standard
          maxCoin: Number(maxCoin),
          maxFiat: Number(maxFiat),
          minCoin: Number(minCoin),
          minFiat: Number(convertBaseToStandard('FIAT', minFiat))
        })
      )
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const createPayment = function* (source: AccountTypes) {
    const coin = S.getCoinType(yield select())

    const payment: PaymentValue = yield call(
      calculateProvisionalPayment,
      source,
      0,
      coin === 'BTC' ? 'regular' : 'priority'
    )

    return payment
  }

  const toCustodialDropdown = (currencyDetails) => {
    // this object has to be equal to object we do expect in dropdown
    const { ...restDetails } = currencyDetails
    return [
      {
        ...restDetails,
        label: 'Trading Account',
        type: ADDRESS_TYPES.CUSTODIAL
      }
    ]
  }

  const getCustodialAccountForCoin = function* (coin: CoinType) {
    const state = yield select()

    yield put(actions.components.send.fetchPaymentsTradingAccount(coin))
    yield take([
      actionTypes.components.send.FETCH_PAYMENTS_TRADING_ACCOUNTS_SUCCESS,
      actionTypes.components.send.FETCH_PAYMENTS_TRADING_ACCOUNTS_FAILURE
    ])

    const custodialAccount = selectors.components.simpleBuy
      .getSBBalances(state)
      .map((balances) => ({
        ...balances[coin]
      }))
      .map(toCustodialDropdown)

    return custodialAccount.map(head)
  }

  return {
    buildAndPublishPayment,
    createLimits,
    createPayment,
    getCustodialAccountForCoin
  }
}
