import { path } from 'ramda'

export const getStep = path(['components', 'exchange', 'step'])
export const getPayment = path(['components', 'exchange', 'payment'])
export const getOrder = path(['components', 'exchange', 'order'])
export const getError = path(['components', 'exchange', 'error'])
export const getFirstStepEnabled = path(['components', 'exchange', 'firstStepEnabled'])
export const getSecondStep = path(['components', 'exchange', 'secondStep'])
export const getThirdStep = path(['components', 'exchange', 'thirdStep'])
