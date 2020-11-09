import { call, put, select } from 'redux-saga/effects'
import { head, nth } from 'ramda'

import {
  AccountTypes,
  CoinType,
  FiatType,
  PaymentValue,
  RatesType,
  SBBalancesType
} from 'core/types'
import { Exchange } from 'blockchain-wallet-v4/src'
import {
  INVALID_COIN_TYPE,
  NO_DEFAULT_ACCOUNT
} from 'blockchain-wallet-v4/src/model'
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

  const getDefaultAccountForCoin = function * (coin: CoinType) {
    let defaultAccountR

    switch (coin) {
      case 'BCH':
        const bchAccountsR = yield select(
          selectors.core.common.bch.getAccountsBalances
        )
        const bchDefaultIndex = (yield select(
          selectors.core.kvStore.bch.getDefaultAccountIndex
        )).getOrElse(0)
        defaultAccountR = bchAccountsR.map(nth(bchDefaultIndex))
        break
      case 'BTC':
        const btcAccountsR = yield select(
          selectors.core.common.btc.getAccountsBalances
        )
        const btcDefaultIndex = yield select(
          selectors.core.wallet.getDefaultAccountIndex
        )
        defaultAccountR = btcAccountsR.map(nth(btcDefaultIndex))
        break
      case 'ETH':
        const ethAccountR = yield select(
          selectors.core.common.eth.getAccountBalances
        )
        defaultAccountR = ethAccountR.map(head)
        break
      case 'PAX':
      case 'USDT':
        const erc20AccountR = yield select(
          selectors.core.common.eth.getErc20AccountBalances,
          coin
        )
        defaultAccountR = erc20AccountR.map(head)
        break
      case 'XLM':
        defaultAccountR = (yield select(
          selectors.core.common.xlm.getAccountBalances
        )).map(head)
        break
      default:
        throw new Error('Invalid Coin Type')
    }

    return defaultAccountR.getOrFail(NO_DEFAULT_ACCOUNT)
  }

  const getReceiveAddressForCoin = function * (coin: CoinType) {
    switch (coin) {
      case 'BCH':
        return selectors.core.common.bch
          .getNextAvailableReceiveAddress(
            networks.bch,
            (yield select(
              selectors.core.kvStore.bch.getDefaultAccountIndex
            )).getOrFail(),
            yield select()
          )
          .getOrFail('Failed to get BCH receive address')
      case 'BTC':
        return selectors.core.common.btc
          .getNextAvailableReceiveAddress(
            networks.btc,
            yield select(selectors.core.wallet.getDefaultAccountIndex),
            yield select()
          )
          .getOrFail('Failed to get BTC receive address')
      case 'ETH':
      case 'PAX':
      case 'USDT':
        return selectors.core.data.eth
          .getDefaultAddress(yield select())
          .getOrFail(`Failed to get ${coin} receive address`)
      case 'XLM':
        return selectors.core.kvStore.xlm
          .getDefaultAccountId(yield select())
          .getOrFail(`Failed to get XLM receive address`)
      default:
        throw new Error('Invalid Coin Type')
    }
  }

  return {
    createLimits,
    createPayment,
    getDefaultAccountForCoin,
    getReceiveAddressForCoin
  }
}
