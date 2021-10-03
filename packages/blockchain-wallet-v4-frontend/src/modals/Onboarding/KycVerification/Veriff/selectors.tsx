import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const veriffUrlR = selectors.components.veriff.getVeriffUrl(state)
  const veriffDomainR = selectors.core.walletOptions.getVeriffDomain(state)

  return lift(
    (
      veriffUrl: ExtractSuccess<typeof veriffUrlR>,
      veriffDomain: ExtractSuccess<typeof veriffDomainR>
    ) => ({
      veriffUrl,
      veriffDomain
    })
  )(veriffUrlR, veriffDomainR)
}
