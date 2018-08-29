import { path } from 'ramda'

export const getStep = path(['components', 'sendEth', 'step'])
export const getPayment = path(['components', 'sendEth', 'payment'])
export const getFeeToggled = path(['components', 'sendEth', 'feeToggled'])
