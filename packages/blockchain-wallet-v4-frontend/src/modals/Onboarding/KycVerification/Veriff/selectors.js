import { selectors } from 'data'

const { getVeriffUrl } = selectors.components.veriff

export const getData = state => ({
  veriffUrl: getVeriffUrl(state),
  veriffDomain: selectors.core.walletOptions
    .getVeriffDomain(state)
    .getOrElse('')
})
