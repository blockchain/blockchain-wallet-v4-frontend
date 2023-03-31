import { head, isNil } from 'ramda'
import { call, CallEffect, put, select, take } from 'redux-saga/effects'

import { Exchange } from '@core'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { AccountTypes, CoinType, FiatType, PaymentType, PaymentValue, RatesType } from '@core/types'
import { actions, actionTypes, selectors } from 'data'
import { promptForSecondPassword } from 'services/sagas'

import exchangeSagaUtils from '../exchange/sagas.utils'
import { convertBaseToStandard } from '../exchange/services'
import * as S from './selectors'
import { actions as A } from './slice'
import { CreateLimitsParamTypes } from './types'

export default ({ coreSagas, networks }: { coreSagas: any; networks: any }) => {
  const { calculateProvisionalPayment } = exchangeSagaUtils({
    coreSagas,
    networks
  })

  const buildAndPublishPayment = function* (
    coin: CoinType,
    payment: PaymentType,
    destination: string,
    hotwalletAddress?: string
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
      } else if (hotwalletAddress && payment.coin === 'ETH') {
        // @ts-ignore
        updatedPayment = yield updatedPayment.depositAddress(destination)
        updatedPayment = yield updatedPayment.to(hotwalletAddress)
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

  const getMinMaxLimits = function* ({ baseUnitBalance, coin, minDepositAmount }) {
    const walletCurrencyR = S.getWalletCurrency(yield select())
    const ratesR = S.getRates(yield select())
    const rates = ratesR.getOrElse({} as RatesType)
    const walletCurrency = walletCurrencyR.getOrElse({} as FiatType)
    const userCurrency = (yield select(selectors.core.settings.getCurrency)).getOrFail(
      'Failed to get user currency'
    )
    const minFiat = Number(convertBaseToStandard('FIAT', minDepositAmount))
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
      value: minFiat
    })

    return {
      limits: {
        // default unit is cents, convert to standard
        maxCoin: Number(maxCoin),
        maxFiat: Number(maxFiat),
        minCoin: Number(minCoin),
        minFiat: Number(minFiat)
      }
    }
  }

  const createLimits = function* ({ custodialBalances, payment, product }: CreateLimitsParamTypes) {
    try {
      const coin = S.getCoinType(yield select())
      let limitsR

      switch (product) {
        case 'Staking':
          limitsR = S.getStakingLimits(yield select())
          break
        case 'Active':
          limitsR = S.getActiveRewardsLimits(yield select())
          break
        case 'Passive':
        default:
          limitsR = S.getInterestLimits(yield select())
          break
      }

      const limits = limitsR.getOrFail('NO_LIMITS_AVAILABLE')

      const nonCustodialBalance = payment && payment.effectiveBalance
      const custodialBalance = custodialBalances && custodialBalances[coin]?.available
      const baseUnitBalance = nonCustodialBalance || custodialBalance || 0
      const minDepositAmount = limits[coin]?.minDepositValue || 1
      const minMaxLimits = yield call(getMinMaxLimits, {
        baseUnitBalance,
        coin,
        minDepositAmount
      })

      yield put(A.setEarnDepositLimits(minMaxLimits))
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
    yield put(actions.components.send.fetchPaymentsTradingAccount(coin))
    yield take([
      actionTypes.components.send.FETCH_PAYMENTS_TRADING_ACCOUNTS_SUCCESS,
      actionTypes.components.send.FETCH_PAYMENTS_TRADING_ACCOUNTS_FAILURE
    ])

    const accountAddress = selectors.components.send.getPaymentsTradingAccountAddress(
      coin,
      yield select()
    )

    const custodialAccount = selectors.components.buySell
      .getBSBalances(yield select())
      .map((balances) => ({
        ...balances[coin],
        address: accountAddress ? accountAddress.data : null // add address to custodial account to match the dropdown value
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
