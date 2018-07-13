import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = state => {
  const userCountryR = selectors.core.settings.getCountryCode(state)
  const userStateR = selectors.core.kvStore.shapeShift.getUsState(state)
  const exchangeStep = selectors.components.exchange.getStep(state)

  const transform = (country, usState) => {
    // determine if user is in the US and has not registered their state with Shapeshift
    const isRegistered = country === 'US' && usState && usState.Code

    return {
      step: isRegistered || country !== 'US' ? exchangeStep : 0
    }
  }

  return lift(transform)(userCountryR, userStateR)
}
