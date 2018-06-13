import { selectors } from 'data'
import { length, lift } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { Color } from 'blockchain-info-components'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getBtcBalance = createDeepEqualSelector(
  [selectors.core.data.bitcoin.getSpendableBalance],
  (btcBalanceR) => Remote.of(btcBalanceR.getOrElse(0))
)

export const getBchBalance = createDeepEqualSelector(
  [selectors.core.data.bch.getSpendableBalance],
  (bchBalanceR) => Remote.of(bchBalanceR.getOrElse(0))
)

export const getEthBalance = createDeepEqualSelector(
  [selectors.core.data.ethereum.getBalance],
  (ethBalanceR) => Remote.of(ethBalanceR.getOrElse(0))
)

export const getBtcBalanceInfo = createDeepEqualSelector(
  [
    getBtcBalance,
    selectors.core.data.bitcoin.getRates,
    selectors.core.settings.getCurrency
  ],
  (btcBalanceR, btcRatesR, currencyR) => {
    const transform = (btcBalance, btcRates, currency) => ({
      coin: btcBalance,
      fiat: Exchange.convertBitcoinToFiat({ value: btcBalance, fromUnit: 'SAT', toCurrency: currency, rates: btcRates })
    })
    return lift(transform)(btcBalanceR, btcRatesR, currencyR)
  }
)

export const getBchBalanceInfo = createDeepEqualSelector(
  [
    getBchBalance,
    selectors.core.data.bch.getRates,
    selectors.core.settings.getCurrency
  ],
  (bchBalanceR, bchRatesR, currencyR) => {
    const transform = (bchBalance, bchRates, currency) => ({
      coin: bchBalance,
      fiat: Exchange.convertBchToFiat({ value: bchBalance, fromUnit: 'SAT', toCurrency: currency, rates: bchRates })
    })
    return lift(transform)(bchBalanceR, bchRatesR, currencyR)
  }
)

export const getEthBalanceInfo = createDeepEqualSelector(
  [
    getEthBalance,
    selectors.core.data.ethereum.getRates,
    selectors.core.settings.getCurrency
  ],
  (ethBalanceR, ethRatesR, currencyR) => {
    const transform = (ethBalance, ethRates, currency) => ({
      coin: ethBalance,
      fiat: Exchange.convertEtherToFiat({ value: ethBalance, fromUnit: 'WEI', toCurrency: currency, rates: ethRates })
    })
    return lift(transform)(ethBalanceR, ethRatesR, currencyR)
  }
)

export const getData = createDeepEqualSelector(
  [
    getBtcBalanceInfo,
    getBchBalanceInfo,
    getEthBalanceInfo,
    selectors.core.common.btc.getActiveHDAccounts,
    selectors.core.kvStore.bch.getAccounts
  ],
  (btcBalanceInfoR, bchBalanceInfoR, ethBalanceInfoR, btcAccountsR, bchAccountsR) => {
    const btcAccountsLength = length(btcAccountsR.getOrElse([]))
    const bchAccountsLength = length(bchAccountsR.getOrElse([]))

    const transform = (btcBalances, bchBalances, ethBalances) => {
      const symbol = btcBalances.fiat.unit.symbol
      const btcBalance = btcBalances.coin
      const bchBalance = bchBalances.coin
      const ethBalance = ethBalances.coin

      const chartData = [{
        y: Number(btcBalances.fiat.value),
        color: Color('brand-primary'),
        fiat: btcBalances.fiat.value,
        name: 'Bitcoin',
        id: 'btc'
      }, {
        y: Number(ethBalances.fiat.value),
        color: Color('brand-secondary'),
        fiat: ethBalances.fiat.value,
        name: 'Ether',
        id: 'eth'
      }, {
        y: Number(bchBalances.fiat.value),
        color: Color('brand-tertiary'),
        fiat: bchBalances.fiat.value,
        name: 'Bitcoin Cash',
        id: 'bch'
      }]

      return {
        btcBalance,
        ethBalance,
        bchBalance,
        chartData,
        symbol,
        btcAccountsLength,
        bchAccountsLength
      }
    }
    return lift(transform)(btcBalanceInfoR, bchBalanceInfoR, ethBalanceInfoR)
  }
)
