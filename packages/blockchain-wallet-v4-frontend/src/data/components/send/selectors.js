import { curry, path, prop } from 'ramda'

export const getPaymentsAccountPit = curry((currency, state) =>
  path(['components', 'send', 'pitPaymentsAccount', currency], state).map(
    prop('address')
  )
)
