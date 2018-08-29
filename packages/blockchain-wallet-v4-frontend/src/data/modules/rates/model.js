import { prop, flip } from 'ramda'

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

export const getPairSubscribeMessage = (pair, volume, fix, fiatCurrency) => ({
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

export const getPairUnsubscribeMessage = pair => ({
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

export const getComplementaryField = flip(prop)({
  sourceAmount: 'sourceFiat',
  sourceFiat: 'sourceAmount',
  targetAmount: 'targetFiat',
  targetFiat: 'targetAmount'
})

export const mapFixToFieldName = flip(prop)({
  [FIX_TYPES.BASE]: 'sourceAmount',
  [FIX_TYPES.BASE_IN_FIAT]: 'sourceFiat',
  [FIX_TYPES.COUNTER]: 'targetAmount',
  [FIX_TYPES.COUNTER_IN_FIAT]: 'targetFiat'
})
