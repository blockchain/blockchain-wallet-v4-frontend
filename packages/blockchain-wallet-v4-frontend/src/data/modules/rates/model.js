export const SUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'quotes',
  type: 'subscribed',
  sequenceNumber: 1
}

export const SUBSCRIBE_ERROR_MESSAGE = {
  channel: 'quotes',
  type: 'error_during_subscription',
  sequenceNumber: 0
}

export const UNSUBSCRIBE_SUCCESS_MESSAGE = {
  channel: 'quotes',
  type: 'unsubscribed',
  sequenceNumber: 5
}

export const QUOTES_MESSAGE = {
  channel: 'quotes',
  type: 'quote',
  sequenceNumber: 3
}

export const getPairSubscribeMessage = pairs => ({
  channel: 'quotes',
  operation: 'subscribe',
  params: {
    type: 'pairs',
    pairs
  }
})

export const getPairUnsubscribeMessage = pairs => ({
  channel: 'quotes',
  operation: 'UNSUBSCRIBE',
  params: {
    type: 'pairs',
    pairs
  }
})
