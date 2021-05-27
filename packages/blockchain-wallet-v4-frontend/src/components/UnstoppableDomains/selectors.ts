import { lift } from 'ramda'

import { ExtractSuccess } from 'core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const unstoppableDomainsResultsR = selectors.components.send.getUnstoppableDomainResults(
    state
  )

  return lift(
    (
      unstoppableDomains: ExtractSuccess<typeof unstoppableDomainsResultsR>
    ) => ({
      unstoppableDomains
    })
  )(unstoppableDomainsResultsR)
}
