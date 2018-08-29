import { curry, path } from 'ramda'
import { selectors } from 'data'

export const useShapeShift = state =>
  !selectors.modules.profile.userFlowSupported(state).getOrElse(false)

export const getStep = path(['components', 'exchange', 'step'])
export const getPayment = path(['components', 'exchange', 'payment'])
export const getOrder = path(['components', 'exchange', 'order'])
export const getError = path(['components', 'exchange', 'error'])
export const getFirstStepEnabled = path([
  'components',
  'exchange',
  'firstStepEnabled'
])
export const getSecondStep = path(['components', 'exchange', 'secondStep'])
export const getThirdStep = path(['components', 'exchange', 'thirdStep'])

const adviceToAmount = ({ base, counter }) => ({
  sourceAmount: base.crypto.value,
  targetAmount: counter.crypto.value,
  sourceFiat: base.fiat.value,
  targetFiat: counter.fiat.value
})
export const getAmounts = curry((pair, state) =>
  selectors.modules.rates.getPairAdvice(pair, state).map(adviceToAmount)
)

const adviceToRate = advice => ({
  sourceToTargetRate: advice.baseToCounterRate,
  targetToSourceRate: advice.counterToBaseRate,
  sourceToFiatRate: advice.baseToFiatRate,
  targetToFiateRate: advice.counterToFiatRate
})
export const getRates = curry((pair, state) =>
  selectors.modules.rates.getPairAdvice(pair, state).map(adviceToRate)
)
