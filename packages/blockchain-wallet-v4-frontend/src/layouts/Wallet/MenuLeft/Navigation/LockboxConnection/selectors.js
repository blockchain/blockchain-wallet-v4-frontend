import { selectors } from 'data'
import { lift } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.components.lockbox.getConnectionStatus],
  (connectionStatusR) => {
    console.log('runnninin')
    const transform = (status) => {
      console.log(status)
      return {
        status
      }
    }
    return lift(transform)(connectionStatusR)
  }
)
