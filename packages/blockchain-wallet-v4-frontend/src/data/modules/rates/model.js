import { prop, lensProp, over, eqBy, flip, contains } from 'ramda'

export const AUTH_ERROR_MESSAGE = {
  channel: 'auth',
  type: 'error',
  description: 'Can not process auth request, token can not be found'
}

export const SUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'conversion',
  type: 'subscribed'
}

export const SUBSCRIBE_ERROR_MESSAGE = {
  channel: 'conversion',
  type: 'error'
}

export const UNSUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'conversion',
  type: 'unsubscribed'
}

export const ADVICE_MESSAGE = {
  channel: 'conversion',
  type: 'currencyRatio'
}

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

export const fixIsFiat = flip(contains)([BASE_IN_FIAT, COUNTER_IN_FIAT])

const volumeLens = lensProp('volume')
export const configEquals = eqBy(over(volumeLens, Number))
