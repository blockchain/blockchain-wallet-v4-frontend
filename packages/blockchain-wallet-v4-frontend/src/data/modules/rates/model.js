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

export const FIX_TYPES = {
  BASE: 'base',
  COUNTER: 'counter',
  BASE_IN_FIAT: 'baseInFiat',
  COUNTER_IN_FIAT: 'counterInFiat'
}
