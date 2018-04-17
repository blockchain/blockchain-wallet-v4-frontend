import { path } from 'ramda'

export const getStep = path(['components', 'sendBtc', 'step'])

export const getPayment = path(['components', 'sendBtc', 'payment'])

export const getEffectiveBalance = path(['components', 'sendBtc', 'effectiveBalance'])

export const getToToggled = path(['components', 'sendBtc', 'toToggled'])

export const getFeePerByteToggled = path(['components', 'sendBtc', 'feePerByteToggled'])

export const getCaptureToggled = path(['components', 'sendBtc', 'captureToggled'])
