import { contains, eqBy, flip, lensProp, over, prop, split } from 'ramda'

export const formatPair = (source, target) => `${source}-${target}`
export const splitPair = split('-')

export const AUTH_ERROR_MESSAGE = {
  channel: 'auth',
  event: 'rejected',
  description: 'Can not process auth request, token can not be found'
}

export const ADVICE_SUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'conversion',
  event: 'subscribed'
}

export const ADVICE_SUBSCRIBE_ERROR_MESSAGE = {
  channel: 'conversion',
  event: 'rejcted'
}

export const ADVICE_UNSUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'conversion',
  event: 'unsubscribed'
}

export const ADVICE_SNAPSHOT_MESSAGE = {
  channel: 'conversion',
  event: 'snapshot'
}

export const ADVICE_UPDATED_MESSAGE = {
  channel: 'conversion',
  event: 'updated'
}

export const RATES_SUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'exchange_rate',
  event: 'subscribed'
}

export const RATES_SUBSCRIBE_ERROR_MESSAGE = {
  channel: 'exchange_rate',
  event: 'error'
}

export const RATES_UNSUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'exchange_rate',
  event: 'unsubscribed'
}

export const RATES_SNAPSHOT_MESSAGE = {
  channel: 'exchange_rate',
  event: 'snapshot'
}

export const RATES_UPDATED_MESSAGE = {
  channel: 'exchange_rate',
  event: 'updated'
}

export const getRatesSubscribeMessage = pairs => ({
  channel: 'exchange_rate',
  action: 'subscribe',
  params: {
    type: 'exchangeRates',
    pairs
  }
})

export const getRatesUnsubscribeMessage = () => ({
  channel: 'exchange_rate',
  action: 'unsubscribe',
  params: {
    type: 'allCurrencyPairs'
  }
})

export const getAdviceSubscribeMessage = (pair, volume, fix, fiatCurrency) => ({
  channel: 'conversion',
  action: 'subscribe',
  params: {
    type: 'conversionSpecification',
    pair,
    volume,
    fix,
    fiatCurrency
  }
})

export const getAdviceUnsubscribeMessage = pair => ({
  channel: 'conversion',
  action: 'unsubscribe',
  params: {
    type: 'conversionPair',
    pair
  }
})

export const getAuthMessage = token => ({
  channel: 'auth',
  action: 'subscribe',
  params: {
    type: 'auth',
    token
  }
})

export const MIN_ERROR = 'Result volume is too small'
export const MAX_ERROR = 'Too big volume'

export const FIX_TYPES = {
  BASE: 'base',
  COUNTER: 'counter',
  BASE_IN_FIAT: 'baseInFiat',
  COUNTER_IN_FIAT: 'counterInFiat'
}

const { BASE, BASE_IN_FIAT, COUNTER, COUNTER_IN_FIAT } = FIX_TYPES

export const getComplementaryField = flip(prop)({
  sourceAmount: 'sourceFiat',
  sourceFiat: 'sourceAmount',
  targetAmount: 'targetFiat',
  targetFiat: 'targetAmount'
})

export const mapFixToFieldName = flip(prop)({
  [BASE]: 'sourceAmount',
  [BASE_IN_FIAT]: 'sourceFiat',
  [COUNTER]: 'targetAmount',
  [COUNTER_IN_FIAT]: 'targetFiat'
})

export const swapCoinAndFiat = flip(prop)({
  [BASE]: BASE_IN_FIAT,
  [COUNTER]: COUNTER_IN_FIAT,
  [BASE_IN_FIAT]: BASE,
  [COUNTER_IN_FIAT]: COUNTER
})

export const swapBaseAndCounter = flip(prop)({
  [BASE]: COUNTER,
  [COUNTER]: BASE,
  [BASE_IN_FIAT]: COUNTER_IN_FIAT,
  [COUNTER_IN_FIAT]: BASE_IN_FIAT
})

export const coinActive = flip(contains)([BASE, COUNTER])
export const fiatActive = flip(contains)([BASE_IN_FIAT, COUNTER_IN_FIAT])
export const sourceActive = flip(contains)([BASE, BASE_IN_FIAT])
export const targetActive = flip(contains)([COUNTER, COUNTER_IN_FIAT])

const volumeLens = lensProp('volume')
export const configEquals = eqBy(over(volumeLens, Number))

export const getBestRatesPairs = (sourceCoin, targetCoin, fiatCurrency) => [
  formatPair(sourceCoin, targetCoin),
  formatPair(targetCoin, sourceCoin),
  formatPair(sourceCoin, fiatCurrency),
  formatPair(fiatCurrency, sourceCoin),
  formatPair(targetCoin, fiatCurrency),
  formatPair(fiatCurrency, targetCoin)
]
