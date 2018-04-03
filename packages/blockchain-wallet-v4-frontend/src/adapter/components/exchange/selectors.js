import { path } from 'ramda'

export const getStep = path(['adapter', 'components', 'exchange', 'step'])

export const getFirstStep = path(['adapter', 'components', 'exchange', 'firstStep'])

export const getFirstStepLoading = path(['adapter', 'components', 'exchange', 'firstStep', 'loading'])

export const getFirstStepError = path(['adapter', 'components', 'exchange', 'firstStep', 'error'])

export const getSecondStep = path(['adapter', 'components', 'exchange', 'secondStep'])

export const getThirdStep = path(['adapter', 'components', 'exchange', 'thirdStep'])
