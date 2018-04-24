import { path } from 'ramda'

export const getStep = path(['components', 'exchange', 'step'])

export const getAccounts = path(['components', 'exchange', 'accounts'])

export const getPayment = path(['components', 'exchange', 'payment'])

export const getFirstStepEnabled = path(['components', 'exchange', 'firstStepEnabled'])
