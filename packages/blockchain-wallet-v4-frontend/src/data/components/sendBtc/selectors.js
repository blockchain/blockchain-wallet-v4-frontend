import { path } from 'ramda'

export const getStep = path(['components', 'sendBtc', 'step'])
export const getPayment = path(['components', 'sendBtc', 'payment'])
export const getToToggled = path(['components', 'sendBtc', 'toToggled'])
export const getFeePerByteToggled = path(['components', 'sendBtc', 'feePerByteToggled'])
