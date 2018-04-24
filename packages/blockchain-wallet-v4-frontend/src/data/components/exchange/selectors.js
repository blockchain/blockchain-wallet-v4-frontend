import { path } from 'ramda'

export const getStep = path(['components', 'exchange', 'step'])

export const getAccounts = path(['components', 'exchange', 'accounts'])

export const getPayment = path(['components', 'exchange', 'payment'])

export const getMinimum = path(['components', 'exchange', 'minimum'])

export const getMaximum = path(['components', 'exchange', 'maximum'])

export const getError = path(['components', 'exchange', 'error'])

export const getFirstStepEnabled = path(['components', 'exchange', 'firstStepEnabled'])
