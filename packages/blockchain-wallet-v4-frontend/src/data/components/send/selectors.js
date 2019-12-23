import { curry, path, prop } from 'ramda'

export const getPaymentsAccountExchange = curry((currency, state) =>
  path(['components', 'send', 'exchangePaymentsAccount', currency], state).map(
    prop('address')
  )
)
