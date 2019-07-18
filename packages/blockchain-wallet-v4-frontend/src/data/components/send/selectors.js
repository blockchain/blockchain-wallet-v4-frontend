import { path, prop } from 'ramda'

export const getPaymentsAccountPit = (currency, state) =>
  path(['components', 'send', 'pitPaymentsAccount', currency], state).map(
    prop('address')
  )
