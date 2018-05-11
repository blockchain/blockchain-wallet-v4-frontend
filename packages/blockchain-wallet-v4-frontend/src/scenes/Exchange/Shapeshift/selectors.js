import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = state => {
  const userCountryR = selectors.core.settings.getCountryCode(state)
  const userStateR = selectors.core.kvStore.shapeShift.getUsState(state)
  const exchangeStep = selectors.components.exchange.getStep(state)

  const transform = (country, usState) => {
    // determine is user is in the US and has not registered their state with Shapeshift
    const isRegistered = country === 'US' && usState && usState.Code

    return {
      step: !isRegistered ? 0 : exchangeStep
    }
  }

  return lift(transform)(userCountryR, userStateR)
}
