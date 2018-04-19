import { path } from 'ramda'

export const getStep = path(['components', 'exchange', 'step'])

export const getFirstStep = path(['components', 'exchange', 'firstStep'])

export const getFirstStepLoading = path(['components', 'exchange', 'firstStep', 'loading'])

export const getFirstStepError = path(['components', 'exchange', 'firstStep', 'error'])

export const getSecondStep = path(['components', 'exchange', 'secondStep'])

export const getThirdStep = path(['components', 'exchange', 'thirdStep'])
