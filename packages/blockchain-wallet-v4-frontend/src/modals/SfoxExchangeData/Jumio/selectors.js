import { selectors } from 'data'
import { lift, path } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.sfox.getAccounts,
    selectors.core.walletOptions.getOptions,
    path(['sfoxSignup', 'jumioToken'])
  ],
  (accountsR, optionsR, tokenR) => {
    const transform = (accounts, options, token) => {
      return {
        accounts,
        options,
        token
      }
    }
    return lift(transform)(accountsR, optionsR, tokenR)
  }
)
