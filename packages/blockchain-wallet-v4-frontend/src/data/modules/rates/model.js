import { prop, lensProp, over, eqBy, flip, contains, split } from 'ramda'

export const formatPair = (source, target) => `${source}-${target}`
export const splitPair = split('-')

export const AUTH_ERROR_MESSAGE = {
  channel: 'auth',
  type: 'error',
  description: 'Can not process auth request, token can not be found'
}

export const ADVICE_SUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'conversion',
  type: 'subscribed'
}

export const ADVICE_SUBSCRIBE_ERROR_MESSAGE = {
  channel: 'conversion',
  type: 'currencyRatioError'
}

export const ADVICE_UNSUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'conversion',
  type: 'unsubscribed'
}

export const ADVICE_MESSAGE = {
  channel: 'conversion',
  type: 'currencyRatio'
}

export const RATES_SUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'exchange_rate',
  type: 'subscribed'
}

export const RATES_SUBSCRIBE_ERROR_MESSAGE = {
  channel: 'exchange_rate',
  type: 'error'
}

export const RATES_UNSUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'exchange_rate',
  type: 'unsubscribed'
}

export const RATES_MESSAGE = {
  channel: 'exchange_rate',
  type: 'exchangeRate'
}

export const getRatesSubscribeMessage = pairs => ({
  channel: 'exchange_rate',
  operation: 'subscribe',
  params: {
    type: 'exchangeRates',
    pairs
  }
})

export const getRatesUnsubscribeMessage = () => ({
  channel: 'exchange_rate',
  operation: 'unsubscribe',
  params: {
    type: 'allCurrencyPairs'
  }
})

export const getAdviceSubscribeMessage = (pair, volume, fix, fiatCurrency) => ({
  channel: 'conversion',
  operation: 'subscribe',
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
  operation: 'unsubscribe',
  params: {
    type: 'conversionPair',
    pair
  }
})

export const getAuthMessage = token => ({
  channel: 'auth',
  operation: 'subscribe',
  params: {
    type: 'auth',
    token
  }
})

export const FIX_TYPES = {
  BASE: 'base',
  COUNTER: 'counter',
  BASE_IN_FIAT: 'baseInFiat',
  COUNTER_IN_FIAT: 'counterInFiat'
}

const { BASE, COUNTER, BASE_IN_FIAT, COUNTER_IN_FIAT } = FIX_TYPES

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
