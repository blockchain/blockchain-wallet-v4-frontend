import { selectors } from 'data'
import { lift, path } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.core.walletOptions.getOptions, path(['sfoxSignup', 'jumioToken'])],
  (optionsR, tokenR) => {
    const transform = (options, token) => {
      return {
        options,
        token
      }
    }
    return lift(transform)(optionsR, tokenR)
  }
)
