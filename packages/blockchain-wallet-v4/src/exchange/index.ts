/* eslint-disable */
import { BigNumber } from 'bignumber.js'
import { path, prop } from 'ramda'

import { CoinType, FiatType, RatesType, WalletFiatType } from 'core/types'

import Currencies, { FiatCurrenciesType } from './currencies'
import { formatCoin, getLang } from './utils'

type KeysOfUnion<T> = T extends any ? keyof T : never
export type UnitType = KeysOfUnion<FiatCurrenciesType[keyof FiatCurrenciesType]['units']>

const getSymbol = (currency): string => {
  const data = Currencies[currency]
  const tradeUnit = prop('trade', data)
  return path(['units', tradeUnit, 'symbol'], data) as string
}

// =====================================================================
// ============================== DECIMALS =============================
// =====================================================================
const convertCoinToCoin = ({
  baseToStandard = true,
  coin,
  isFiat = false,
  value = '0'
}: {
  baseToStandard?: boolean
  coin: string
  isFiat?: boolean
  value: number | string
}): string => {
  if (isFiat || coin === 'FIAT') {
    return baseToStandard
      ? new BigNumber(value).dividedBy(100).valueOf()
      : new BigNumber(value).multipliedBy(100).valueOf()
  }

  const { coinfig } = window.coins[coin]

  const number = baseToStandard
    ? new BigNumber(value).dividedBy(Math.pow(10, coinfig.precision))
    : new BigNumber(value).times(Math.pow(10, coinfig.precision))

  return baseToStandard ? number.toFixed() : number.toFixed(0)
}

const convertCoinToFiat = ({
  coin,
  value = '0',
  currency,
  rates,
  isStandard
}: {
  coin: string
  value?: number | string
  currency: FiatType
  rates: RatesType
  isStandard?: boolean
}): string => {
  if (!value) return new BigNumber(0).toFixed(2)

  const { coinfig } = window.coins[coin]
  const { price } = rates
  const amt = isStandard
    ? new BigNumber(value)
    : new BigNumber(value).dividedBy(Math.pow(10, coinfig.precision))

  return amt.times(price).toFixed(2, 1)
}

const convertFiatToCoin = ({
  coin,
  currency,
  rates,
  value = '0',
  maxPrecision
}: {
  coin: CoinType
  currency: keyof FiatCurrenciesType
  rates: RatesType
  value: number | string
  maxPrecision?: number
}): string => {
  if (!value) return '0'

  const { coinfig } = window.coins[coin]
  const { price } = rates

  return new BigNumber(value)
    .dividedBy(price)
    .toFixed(maxPrecision ? Math.min(maxPrecision, coinfig.precision) : coinfig.precision)
}

// 🔺Triangulate Wallet Fiat -> BTC -> To other Fiat
const convertFiatToFiat = ({
  fromCurrency,
  rates,
  toCurrency,
  value = '0'
}: {
  fromCurrency: WalletFiatType
  rates: RatesType
  toCurrency: WalletFiatType
  value: number | string
}) => {
  const btcAmt = convertFiatToCoin({
    coin: 'BTC',
    value,
    currency: fromCurrency,
    rates
  })
  const { price } = rates
  return new BigNumber(btcAmt).times(price).toFixed(2)
}

// =====================================================================
// =============================== STRING ==============================
// =====================================================================
const displayCoinToCoin = ({
  coin,
  isFiat,
  value = '0'
}: {
  coin: string
  isFiat?: boolean
  value: number | string
}): string => {
  if (isFiat) {
    const options = { style: 'currency', currency: coin }
    return new Intl.NumberFormat(getLang(), options).format(Number(value))
  }

  return `${formatCoin(convertCoinToCoin({ baseToStandard: true, value, coin }))} ${coin}`
}

const displayCoinToFiat = ({
  rates,
  toCurrency,
  value = '0'
}: {
  rates: RatesType
  toCurrency: keyof FiatCurrenciesType
  value: number | string
}): string => {
  const options = { style: 'currency', currency: toCurrency }

  const { price } = rates
  const number = new BigNumber(value).times(price).toNumber()
  return new Intl.NumberFormat(getLang(), options).format(number)
}

const displayFiatToFiat = ({ value }: { value: number | string }) => {
  return new BigNumber(value).toFixed(2)
}

export {
  convertCoinToCoin,
  convertCoinToFiat,
  convertFiatToCoin,
  convertFiatToFiat,
  displayCoinToCoin,
  displayCoinToFiat,
  displayFiatToFiat,
  getSymbol
}
