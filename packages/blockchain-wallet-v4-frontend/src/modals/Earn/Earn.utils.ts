import { Exchange, Remote } from '@core'
import { fiatToString, formatFiat } from '@core/exchange/utils'
import { CoinType, FiatType, RatesType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const PERCENTAGE_100 = 100

export const getAddressDataR = (state: RootState, coin: CoinType) => {
  switch (coin) {
    case 'BCH':
      return selectors.core.common.bch.getAccountsBalances(state)
    case 'BTC':
      return selectors.core.common.btc.getActiveAccountsBalances(state)
    case 'ETH':
      return selectors.core.common.eth.getAccountBalances(state)
    case 'XLM':
      return selectors.core.common.xlm.getAccountBalances(state)
    default:
      switch (true) {
        case selectors.core.data.coins.getErc20Coins().includes(coin):
          return selectors.core.common.eth.getErc20AccountBalances(state, coin)
        default:
          return Remote.Success([{}])
      }
  }
}

// BTC & BCH balance is a number
// ETH balance is a bigNumber
// XLM & ERC20 balance is a string
export const getHasNonCustodialBalance = (addressData): boolean =>
  addressData.some(({ balance }) => {
    const balanceType = typeof balance
    return balanceType === 'number' || balanceType === 'string'
      ? Number(balance) > 0
      : Number(Exchange.convertCoinToCoin({ baseToStandard: true, coin: 'ETH', value: balance })) >
          0
  })

export const maxFiat = (maxFiat: number, walletCurrency: FiatType) =>
  fiatToString({
    unit: walletCurrency,
    value: maxFiat
  })

export const amountToFiat = (
  displayCoin: boolean,
  amount: string,
  coin: CoinType,
  walletCurrency: FiatType,
  rates: RatesType
) =>
  displayCoin
    ? Exchange.convertCoinToFiat({
        coin,
        currency: walletCurrency,
        isStandard: true,
        rates,
        value: amount
      })
    : amount

export const amountToCrypto = (
  displayCoin: boolean,
  amount: string,
  coin: CoinType,
  walletCurrency: FiatType,
  rates: RatesType
) => {
  if (displayCoin) {
    return amount
  }
  return Exchange.convertFiatToCoin({
    coin,
    currency: walletCurrency,
    rates,
    value: amount
  })
}

export const calcCompoundInterest = (principal: string, rate: number, term: number) => {
  const COMPOUNDS_PER_YEAR = 365
  const principalInt = parseFloat(principal)
  if (!principalInt) return '0.00'
  const totalAmount =
    principalInt * (1 + rate / (COMPOUNDS_PER_YEAR * PERCENTAGE_100)) ** (COMPOUNDS_PER_YEAR * term)
  return formatFiat(totalAmount - principalInt)
}
